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
import toFixed from 'accounting-js/lib/toFixed';
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
    const [saldo, setSaldo] = useState();
    const [profileDocId, setProfileDocId] = useState();
    const [trackingNumber, setTrackingNumber] = useState();

    const [overWeightInformation, setOverWeightInformation] = useState([]);

    const [isOpen, setIsOpen] = useState(false);
    const [xlsData, setxlsData] = useState([]);

    const [supplier, setSupplier] = useState([]);
    const [errorGuia, setErrorGuia] = useState(false);
    const [xlsToUpLoad, setXlsToUpLoad] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [overweightRatesBase, setOverweightRatesBase] = useState([]);
    const [overweightRatesBaseXls, setOverweightRatesBaseXls] = useState([]);

    const [cargo, setCargo] = useState();

    const creationDate = new Date();
    const [rateKgExtra, setRateKgExtra] = useState();
    // overWeight data
    useEffect(() => {
        if (!userId) {
        } else {
            db.collection('profiles')
                .where('ID', '==', userId)
                .onSnapshot(
                    function(profilesSnapshot) {
                        profilesSnapshot.forEach(function(profileDoc) {
                            setSaldo(profileDoc.data().saldo);
                            setProfileDocId(profileDoc.id);
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
                    },
                    function(error) {
                        console.log('profile not found');
                    },
                );
        }
    }, [guia, userId, xlsData]);

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
        setCargo((realKg - kgDeclarados) * parseInt(rateKgExtra, 10) * 1.16);
    }, [realKg, kgDeclarados, rateKgExtra, xlsData]);

    if (isNaN(cargo)) {
        setCargo(0);
    }

    const getIdGuia = trackingNumber => {
        setTrackingNumber(trackingNumber);
        db.collection('guia')
            .where('rastreo', 'array-contains', trackingNumber)
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    console.log(doc.data());
                    setGuia(doc.id);
                    setErrorGuia(true);
                });
            })
            .catch(function(error) {
                setErrorGuia(true);
                console.log('Error getting documents: ', error);
            });
    };

    //Guide data
    useEffect(() => {
        if (!guia) {
            setDocId('');
            setName('');
            setUserId('');
            setDate('');
            setKgdeclarados('');
            setSupplier('');
        } else {
            const docRef = db.collection('guia').doc(guia);

            docRef
                .get()
                .then(function(doc) {
                    if (doc.exists) {
                        setDocId(doc.id);
                        setName(doc.data().name);
                        setUserId(doc.data().ID);
                        setDate(
                            doc
                                .data()
                                .creation_date.toDate()
                                .toLocaleDateString(),
                        );
                        setKgdeclarados(doc.data().package.weight);
                        setSupplier(doc.data().supplierData.tarifa.entrega);
                    } else {
                        // doc.data() will be undefined in this case
                        setErrorGuia(true);
                    }
                })
                .catch(function(error) {
                    console.log('Error getting document:', error);
                });
            //  console.log('Vamos a mostrar los datos del usuario');
        }
        setErrorGuia(false);
    }, [guia, getIdGuia]);
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
        setCargo(toFixed((realKg - kgDeclarados) * parseInt(rateKgExtra, 10) * 1.16), 2);
        reloadOverWeight();
    }, []);

    const openModal = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const closeModalImported = () => {
        setIsOpen(false);
        setXlsToUpLoad(true);
    };

    const addOverWeight = () => {
        //Datos manualmente
        if (name) {
            const addOverWeightData = {
                ID: userId,
                usuario: name,
                fecha: creationDate,
                guia,
                rastreo: trackingNumber,
                kilos_declarados: kgDeclarados,
                kilos_reales: realKg,
                cargo,
            };

            db.collection('overweights')
                .add(addOverWeightData)
                .then(function(docRef) {
                    console.log('Document written');
                })
                .catch(function(error) {
                    console.error('Error adding document: ', error);
                });

            db.collection('profiles')
                .doc(profileDocId)
                .update({
                    saldo: toFixed(parseFloat(saldo) - parseFloat(cargo), 2),
                });
        } else {
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
                db.collection('guia')
                    .where('rastreo', 'array-contains', overWeight.guia)
                    .get()
                    .then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                            const IdGuiaXls = doc.id;

                            db.collection('guia')
                                .doc(IdGuiaXls)
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
                                                            ratesSnapshot.forEach(function(
                                                                rateDoc,
                                                            ) {
                                                                tmpOverweightRatesBase.push(
                                                                    rateDoc.data(),
                                                                );
                                                            });

                                                            const overweightRatesBase = tmpOverweightRatesBase;

                                                            const overweightRatesBaseXls = overweightRatesBase
                                                                .filter(kgExtraFilter => {
                                                                    return (
                                                                        kgExtraFilter.entrega ===
                                                                        `${
                                                                            doc.data().supplierData
                                                                                .tarifa.entrega
                                                                        }Extra`
                                                                    );
                                                                })
                                                                .map(getCostkgExtra => {
                                                                    return getCostkgExtra.kgExtra;
                                                                });

                                                            const cargoOverweight = toFixed(
                                                                (overWeight.kilos_reales -
                                                                    doc.data().package.weight) *
                                                                    parseInt(
                                                                        overweightRatesBaseXls,
                                                                        10,
                                                                    ) *
                                                                    1.16,
                                                                2,
                                                            );
                                                            const cargo = db
                                                                .collection('overweights')
                                                                .add({
                                                                    ID: doc.data().ID,
                                                                    usuario: doc.data().name,
                                                                    fecha: creationDate,
                                                                    guia: IdGuiaXls,
                                                                    rastreo: overWeight.guia,
                                                                    kilos_declarados: doc.data()
                                                                        .package.weight,
                                                                    kilos_reales:
                                                                        overWeight.kilos_reales,
                                                                    cargo: cargoOverweight,
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
                                                            db.collection('profiles')
                                                                .doc(profileDoc.id)
                                                                .update({
                                                                    saldo: toFixed(
                                                                        profileDoc.data().saldo -
                                                                            cargoOverweight,
                                                                        2,
                                                                    ),
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
                        });
                    })
                    .catch(function(error) {
                        console.log('Error getting documents: ', error);
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

    const deleteOverWeight = idDoc => {
        if (deleting) return;
        setDeleting(true);
        let costo = null;
        db.collection('overweights')
            .doc(idDoc)
            .get()
            .then(doc => {
                costo = doc.data().cargo;

                db.collection('overweights')
                    .doc(idDoc)
                    .delete()
                    .then(function() {
                        console.log('Document successfully deleted!');
                        setDeleting(false);
                    })
                    .catch(function(error) {
                        console.error('Error removing document: ', error);
                        setDeleting(false);
                    });
            });
    };

    const infoOverWeight = overWeightInformation.map((overWeight, idx) => {
        return {
            id: overWeight.id,
            guide: overWeight.rastreo,
            user: overWeight.usuario,
            date:
                typeof overWeight.fecha.toDate === 'function'
                    ? overWeight.fecha.toDate().toLocaleDateString()
                    : overWeight.fecha,
            kdeclared: overWeight.kilos_declarados,
            kreal: overWeight.kilos_reales,
            cadd: formatMoney(overWeight.cargo),
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
                            label="Numero de guia"
                            className="rainbow-p-around_medium"
                            style={{ flex: '1 1' }}
                            onChange={ev => getIdGuia(ev.target.value)}
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
                            value={date ? new Date(date).toLocaleDateString() : undefined}
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
                            <>
                                <div style={{ flex: '1 1 100%' }}>
                                    <div className="alert-error">Número de guía inválido</div>
                                </div>
                                <div className="app-spacer height-1 height-2" />
                            </>
                        )}
                        {xlsToUpLoad && (
                            <>
                                <div style={{ flex: '1 1 100%' }}>
                                    <div className="alert-import">
                                        Excel importado con exito! Confirmar la importación
                                    </div>
                                </div>
                                <div className="app-spacer height-1 height-2" />
                            </>
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
                                onComplete={data => {
                                    setxlsData(data);
                                    closeModalImported();
                                }}
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
                            sortedBy="date"
                            sortDirection="desc"
                        >
                            <StyledColumn
                                header="Número de Guía"
                                field="guide"
                                defaultWidth={250}
                            />
                            <StyledColumn header="Usuario" field="user" />
                            <StyledColumn header="Fecha " field="date" />
                            <StyledColumn header="Kilos Declarados" field="kdeclared" />
                            <StyledColumn header="Kilos reales" field="kreal" />
                            <StyledColumn header="Cargos Adicionales" field="cadd" />
                            <StyledColumn header="" field="delete" defaultWidth={75} />
                        </StyledTable>
                    </div>
                </div>
            </div>
        </StyledAdminoverweight>
    );
};

export default AdminOverweightPage;
