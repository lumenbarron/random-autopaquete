import React, { useState, useEffect } from 'react';

import {
    Table,
    Column,
    Input,
    Button,
    FileSelector,
    ImportRecordsFlow,
} from 'react-rainbow-components';
import styled from 'styled-components';

import { StyledAdminoverweight } from './styled';
import { useFirebaseApp } from 'reactfire';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImport } from '@fortawesome/free-solid-svg-icons';

const StyledTable = styled(Table)`
    color: #1de9b6;
`;

const StyledColumn = styled(Column)`
    color: #1de9b6;
`;

const AdminOverweightPage = () => {
    const firebase = useFirebaseApp();
    const db = firebase.firestore();

    const [guia, setGuia] = useState();
    const [userId, setUserId] = useState();
    const [name, setName] = useState('');
    const [date, setDate] = useState();
    const [kgDeclarados, setKgdeclarados] = useState();
    const [realKg, setRealKg] = useState();
    const [charge, setCharge] = useState();
    const [docId, setDocId] = useState();

    const [overWeightInformation, setOverWeightInformation] = useState([]);

    const [isOpen, setIsOpen] = useState(false);
    const [xlsData, setxlsData] = useState([]);

    const [kgExtra, setKgExtra] = useState([]);

    const [overweightRatesBase, setOverweightRatesBase] = useState([]);

    const creationDate = new Date();
    const cargo = (realKg - kgDeclarados) * 2;

    //Guide data
    useEffect(() => {
        if (!guia) {
            console.log('Este valor tiene que tener un valor de guía valida');
        } else {
            const docRef = db.collection('guia').doc(guia);

            docRef
                .get()
                .then(function(doc) {
                    if (doc.exists) {
                        setDocId(doc.id);
                        setName(doc.data().name);
                        setUserId(doc.data().ID);
                        setDate(doc.data().creation_date);
                        setKgdeclarados(doc.data().package.weight);
                    } else {
                        // doc.data() will be undefined in this case
                        console.log('No such document!');
                    }
                })
                .catch(function(error) {
                    console.log('Error getting document:', error);
                });
            //  console.log('Vamos a mostrar los datos del usuario');
        }
    }, [guia]);

    //overWeight data
    useEffect(() => {
        if (!userId) {
            console.log('Este valor tiene que tener un valor de guía valida');
        } else {
            db.collection('profiles')
                .where('ID', '==', userId)
                .get()
                .then(function(profilesSnapshot) {
                    profilesSnapshot.forEach(function(profileDoc) {
                        db.collection(`profiles/${profileDoc.id}/rate`)
                            .get()
                            .then(function(ratesSnapshot) {
                                const tmpOverweightRatesBase = [];

                                ratesSnapshot.forEach(function(rateDoc) {
                                    tmpOverweightRatesBase.push(rateDoc.data());
                                });

                                setOverweightRatesBase(tmpOverweightRatesBase);
                            })
                            .catch(function(error) {
                                console.log('rates not found');
                            });
                    });
                })
                .catch(function(error) {
                    console.log('profile not found');
                });
        }
    }, [guia, userId]);

    // display new prices according to overweight rate base change
    useEffect(() => {
        console.log(overweightRatesBase);
    }, [overweightRatesBase]);

    // console.log(userId);

    console.log('Kg extra', kgExtra);

    useEffect(() => {
        const reloadOverWeight = () => {
            db.collection('overweights').onSnapshot(handleOverWeight);
        };
        reloadOverWeight();
    }, []);

    function handleOverWeight(snapshot) {
        const overWeightInformation = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data(),
            };
        });
        setOverWeightInformation(overWeightInformation);
    }

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const addOverWeight = () => {
        //Datos manualmente
        if (name) {
            const addOverWeightData = {
                ID: userId,
                usuario: name,
                fecha: creationDate.toLocaleDateString(),
                guia,
                kilos_declarados: kgDeclarados,
                kilos_reales: realKg,
            };
            db.collection('overweights')
                .add(addOverWeightData)
                .then(function(docRef) {
                    console.log('Document written with ID (origen): ', docRef.id);
                })
                .catch(function(error) {
                    console.error('Error adding document: ', error);
                });
            console.log('Esto no debe de aparecer');
        }
        //Datos cuando se agregan por medio de csv
        if (xlsData.length === 0) {
            console.log('El csv esta vacío');
            return;
        }
        xlsData.data.map(function(overWeight, idx) {
            if (!overWeight.guia) {
                console.log('Este valor tiene que tener un valor de guía valida');
            } else {
                const docRef = db.collection('guia').doc(overWeight.guia);
                docRef
                    .get()
                    .then(function(doc) {
                        if (doc.exists) {
                            setUserId(doc.data().ID);
                        } else {
                            // doc.data() will be undefined in this case
                            console.log('No such document!');
                        }

                        db.collection('overweights')
                            .add({
                                ID: doc.data().ID,
                                usuario: doc.data().name,
                                fecha: creationDate.toLocaleDateString(),
                                guia: overWeight.guia,
                                kilos_declarados: doc.data().package.weight,
                                kilos_reales: overWeight.kilos_reales,
                                cargo: overWeight.kilos_reales + 50,
                            })
                            .then(function(docRef) {
                                console.log('Document written with ID (origen): ', docRef.id);
                            })
                            .catch(function(error) {
                                console.error('Error adding document: ', error);
                            });
                    })
                    .catch(function(error) {
                        console.log('Error getting document:', error);
                    });
                console.log('Vamos a mostrar los datos del usuario');
            }
        });
    };

    const schema = {
        collection: 'overWeight',
        attributes: {
            guia: {
                type: String,
                required: true,
            },
            kilos_reales: {
                type: Number,
                required: true,
            },
        },
    };

    const infoOverWeight = overWeightInformation.map((overWeight, idx) => {
        return {
            guide: overWeight.guia,
            user: overWeight.usuario,
            date: overWeight.fecha,
            kdeclared: overWeight.kilos_declarados,
            kreal: overWeight.kilos_reales,
            cadd: overWeight.cargo,
        };
    });

    return (
        <StyledAdminoverweight>
            <div className="back">
                <h1>Sobrepeso</h1>

                <div className="rainbow-m-vertical_medium">
                    <h5>Agregar Sobrepeso</h5>
                    <div className="rainbow-flex rainbow-flex_wrap rainbow-flex_row">
                        <Input
                            id="guia"
                            label="Numero de guia"
                            className="rainbow-p-around_medium"
                            style={{ flex: '1 1' }}
                            onChange={ev => setGuia(ev.target.value)}
                        />
                        <Input
                            id="usuario"
                            label="Usuario"
                            value={name}
                            className="rainbow-p-around_medium"
                            style={{ flex: '1 1' }}
                            readOnly
                        />
                        <Input
                            id="fecha"
                            label="Fecha"
                            value={date}
                            className="rainbow-p-around_medium"
                            style={{ flex: '1 1' }}
                            readOnly
                        />
                        <Input
                            id="kgs"
                            label="Kgs Declarados"
                            value={kgDeclarados}
                            className="rainbow-p-around_medium"
                            style={{ flex: '1 1' }}
                            readOnly
                        />
                        <Input
                            id="kgsReales"
                            label="Kgs Reales"
                            className="rainbow-p-around_medium"
                            value={realKg}
                            style={{ flex: '1 1' }}
                            onChange={ev => setRealKg(ev.target.value)}
                        />
                        <Input
                            id="cargo"
                            label="Cargo"
                            value={cargo}
                            className="rainbow-p-around_medium"
                            style={{ flex: '1 1' }}
                            readOnly
                        />
                        <div style={{ flex: '1 1 100%', height: '0' }}></div>
                        <div>
                            <Button variant="neutral" onClick={openModal}>
                                <FontAwesomeIcon
                                    icon={faFileImport}
                                    className="rainbow-m-right_x-small"
                                />
                                Selecciona el archivo a importar
                            </Button>
                            <ImportRecordsFlow
                                isOpen={isOpen}
                                onRequestClose={closeModal}
                                schema={schema}
                                onComplete={data => setxlsData(data)}
                                actionType="add-records"
                            />
                        </div>
                        <Button
                            label="Confirmar"
                            style={{ flex: '1 1 50%' }}
                            onClick={addOverWeight}
                        />
                    </div>
                </div>

                <div className="rainbow-p-bottom_xx-large">
                    <div>
                        <StyledTable
                            pageSize={10}
                            keyField="id"
                            data={infoOverWeight}
                            emptyTitle="Oh no!"
                            emptyDescription="No hay ningun registro actualmente..."
                        >
                            <StyledColumn header="Número de Guía" field="guide" />
                            <StyledColumn header="Usuario" field="user" />
                            <StyledColumn header="Fecha " field="date" />
                            <StyledColumn header="Kilos Declarados" field="kdeclared" />
                            <StyledColumn header="Kilos reales" field="kreal" />
                            <StyledColumn header="Cargos Adicionales" field="cadd" />
                        </StyledTable>
                    </div>
                </div>
            </div>
        </StyledAdminoverweight>
    );
};

export default AdminOverweightPage;
