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

import formatMoney from 'accounting-js/lib/formatMoney';
import { useFirebaseApp } from 'reactfire';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImport, faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { StyledAdminoverweight } from './styled';

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

    const [supplier, setSupplier] = useState([]);
    const [errorGuia, setErrorGuia] = useState(false);

    const [overweightRatesBase, setOverweightRatesBase] = useState([]);
    const [overweightRatesBaseXls, setOverweightRatesBaseXls] = useState([]);

    const [cargo, setCargo] = useState();

    const creationDate = new Date();
    const [rateKgExtra, setRateKgExtra] = useState();

    //overWeight data
    useEffect(() => {
        if (!userId) {
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
    }, [guia, userId, xlsData]);

    useEffect(() => {
        if (!userId) {
            setErrorGuia(false);
            console.log(1);
        } else {
            console.log(2);
            setErrorGuia(false);
        }
    }, [guia]);

    // display new prices according to overweight rate base change
    useEffect(() => {
        setRateKgExtra(
            overweightRatesBase
                .filter(kgExtraFilter => {
                    return kgExtraFilter.entrega === `${supplier}Extra`;
                })
                .map(getCostkgExtra => {
                    return getCostkgExtra.kgExtra;
                }),
        );
    }, [overweightRatesBase]);

    // Calculo para el Kilo extra
    useEffect(() => {
        setCargo((realKg - kgDeclarados) * parseInt(rateKgExtra, 10));
    }, [realKg, kgDeclarados, rateKgExtra, xlsData]);

    if (isNaN(cargo)) {
        setCargo(0);
    }

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
                        setSupplier(doc.data().supplierData.tarifa.entrega);
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

    function handleOverWeight(snapshot) {
        const overWeightInformation = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data(),
            };
        });
        setOverWeightInformation(overWeightInformation);
    }

    useEffect(() => {
        const reloadOverWeight = () => {
            db.collection('overweights').onSnapshot(handleOverWeight);
        };
        setCargo((realKg - kgDeclarados) * parseInt(rateKgExtra, 10));
        reloadOverWeight();
    }, []);

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
                cargo,
            };

            // Actualizar duplicados
            // const idOverWeightDoc = overWeightInformation
            //     .filter(upDateOverWeight => {
            //         return upDateOverWeight.guia === guia;
            //     })
            //     .map((upDateOverWeight, idx) => {
            //         return upDateOverWeight.id;
            //     });

            //   const overWeightDocId = overWeightInformation.map((upDateOverWeight, idx) => {
            //     if (upDateOverWeight.id.indexOf(idOverWeightDoc) > -1) {
            //         console.log('1');
            //         console.log('Donde se esta comparando', upDateOverWeight.id);
            //         console.log('Donde se esta comparando', idOverWeightDoc);
            //         // db.collection('overweight')
            //         //     .doc(upDateOverWeight.id)
            //         //     .update(addOverWeightData);
            //         return;
            //     }
            // });

            db.collection('overweights')
                .add(addOverWeightData)
                .then(function(docRef) {
                    console.log('Document written with ID (origen): ', docRef.id);
                })
                .catch(function(error) {
                    console.error('Error adding document: ', error);
                });
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
                // const overWeightDocId = overweightRatesBase
                //     .filter(kgExtraFilter => {
                //         return kgExtraFilter.entrega === `${supplier}Extra`;
                //     })
                //     .map(getCostkgExtra => {
                //         return getCostkgExtra.kgExtra;
                //     });

                const docRef = db.collection('guia').doc(overWeight.guia);

                docRef
                    .get()
                    .then(function(doc) {
                        if (doc.exists) {
                            setUserId(doc.data().ID);
                            db.collection('profiles')
                                .where('ID', '==', doc.data().ID)
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

                                                const overweightRatesBase = tmpOverweightRatesBase;

                                                const overweightRatesBaseXls = overweightRatesBase
                                                    .filter(kgExtraFilter => {
                                                        return (
                                                            kgExtraFilter.entrega ===
                                                            `${
                                                                doc.data().supplierData.tarifa
                                                                    .entrega
                                                            }Extra`
                                                        );
                                                    })
                                                    .map(getCostkgExtra => {
                                                        return getCostkgExtra.kgExtra;
                                                    });

                                                console.log('Cargo extra', overweightRatesBaseXls);
                                                const cargo = db
                                                    .collection('overweights')
                                                    .add({
                                                        ID: doc.data().ID,
                                                        usuario: doc.data().name,
                                                        fecha: creationDate.toLocaleDateString(),
                                                        guia: overWeight.guia,
                                                        kilos_declarados: doc.data().package.weight,
                                                        kilos_reales: overWeight.kilos_reales,
                                                        cargo:
                                                            (overWeight.kilos_reales -
                                                                doc.data().package.weight) *
                                                            parseInt(overweightRatesBaseXls, 10),
                                                    })
                                                    .then(function(docRef) {
                                                        console.log(docRef);
                                                    })
                                                    .catch(function(error) {
                                                        console.error(
                                                            'Error adding document: ',
                                                            error,
                                                        );
                                                    });
                                            })
                                            .catch(function(error) {
                                                console.log('rates not found');
                                            });
                                    });
                                })
                                .catch(function(error) {
                                    console.log('profile not found');
                                });
                        } else {
                            // doc.data() will be undefined in this case
                            console.log('No such document!');
                        }
                    })

                    .catch(function(error) {
                        console.log('Error getting document:', error);
                    });
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

    const editOverWeight = idGuia => {
        setGuia(idGuia);
    };

    const deleteOverWeight = idDoc => {
        db.collection('overweights')
            .doc(idDoc)
            .delete()
            .then(function() {
                console.log('Document successfully deleted!', idDoc);
            })
            .catch(function(error) {
                console.error('Error removing document: ', error);
            });
    };

    const infoOverWeight = overWeightInformation.map((overWeight, idx) => {
        return {
            guide: overWeight.guia,
            user: overWeight.usuario,
            date: overWeight.fecha,
            kdeclared: overWeight.kilos_declarados,
            kreal: overWeight.kilos_reales,
            cadd: formatMoney(overWeight.cargo),
            edit: (
                <FontAwesomeIcon
                    icon={faPencilAlt}
                    onClick={() => editOverWeight(overWeight.guia)}
                />
            ),
            delete: (
                <FontAwesomeIcon
                    icon={faTrashAlt}
                    onClick={() => deleteOverWeight(overWeight.id)}
                />
            ),
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
                            value={guia}
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
                            value={formatMoney(cargo)}
                            className="rainbow-p-around_medium"
                            style={{ flex: '1 1' }}
                            readOnly
                        />
                        {errorGuia && (
                            <div style={{ flex: '1 1 100%', height: '0' }}>
                                <div className="alert-error">
                                    Necesitas completar todos los campos
                                </div>
                            </div>
                        )}
                        <div style={{ flex: '1 1 100%', height: '0' }}></div>
                        <div>
                            <Button variant="neutral" onClick={openModal} className="btn-import">
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
                        <div style={{ flex: '1 1 33%', height: '0' }} className="empty-espace" />
                        <Button
                            label="Confirmar"
                            style={{ flex: '1 1 33%' }}
                            onClick={addOverWeight}
                            className="btn-confirmar"
                        />
                    </div>
                </div>
                <div className="app-spacer height-1" />

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
                            <StyledColumn header="" field="delete" />
                        </StyledTable>
                    </div>
                </div>
            </div>
        </StyledAdminoverweight>
    );
};

export default AdminOverweightPage;
