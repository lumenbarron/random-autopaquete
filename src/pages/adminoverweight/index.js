import React, { useState, useEffect, useRef } from 'react';

import {
    Table,
    Column,
    Input,
    Button,
    FileSelector,
    ImportRecordsFlow,
} from 'react-rainbow-components';
import styled from 'styled-components';
import swal from 'sweetalert2';
import formatMoney from 'accounting-js/lib/formatMoney';
import toFixed from 'accounting-js/lib/toFixed';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
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
    const [costGuia, setCostGuia] = useState();
    const [costTotal, setCostTotal] = useState();
    const [matchRate, setMatchRate] = useState(false);
    const [matchPrice, setMatchPrice] = useState(false);
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
    let extraCharge = useRef();

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
                            console.log(profileDoc.data());
                            setSaldo(profileDoc.data().saldo);
                            setProfileDocId(profileDoc.id);
                            db.collection(`profiles/${profileDoc.id}/rate`)
                                .get()
                                .then(function(ratesSnapshot) {
                                    const tmpOverweightRatesBase = [];
                                    // console.log(ratesSnapshot);
                                    ratesSnapshot.forEach(function(rateDoc) {
                                        //console.log(rateDoc.data());
                                        tmpOverweightRatesBase.push(rateDoc.data());
                                    });
                                    console.log('obteniendo las tarifas', tmpOverweightRatesBase);
                                    setOverweightRatesBase(tmpOverweightRatesBase);
                                })
                                .catch(function(error) {
                                    console.log('rates not found', error);
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
        console.log('obteniendo los kg extra');
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
        let cargoExtraCero;
        let cargoExtra;
        let cargo;
        let maxrate;

        console.log(
            'realKg',
            realKg,
            'kgDeclarados',
            kgDeclarados,
            'rateKgExtra',
            rateKgExtra,
            'CostGuia',
            costGuia,
            'CostTotal',
            costTotal,
            'supplier',
            supplier,
        );
        //console.log('overweightRatesBase', overweightRatesBase);
        overweightRatesBase.forEach(rates => {
            //console.log(rates.min, rates.max, rates.precio, rates.entrega);

            if (
                parseInt(rates.min, 10) <= parseInt(kgDeclarados, 10) &&
                parseInt(rates.max, 10) >= parseInt(kgDeclarados, 10) &&
                rates.precio === costGuia &&
                rates.entrega === supplier &&
                !rates.kgExtra
            ) {
                //console.log('guardando el max rate de su tarifa');
                maxrate = parseInt(rates.max, 10);
                //console.log(maxrate);
                if (
                    parseInt(rates.min, 10) <= parseInt(realKg, 10) &&
                    parseInt(rates.max, 10) >= parseInt(realKg, 10) &&
                    rates.precio === costGuia &&
                    rates.entrega === supplier &&
                    !rates.kgExtra
                ) {
                    //console.log('entra en su tarifa');
                    cargoExtraCero = 0;
                    setMatchPrice(`de ${rates.min} hasta  ${rates.max} con ${rates.entrega}`);
                } else {
                    // console.log(
                    //     'maxrate',
                    //     maxrate,
                    //     'realKg',
                    //     parseInt(realKg, 10),
                    //     'kg exta',
                    //     rateKgExtra,
                    // );
                    //console.log(parseInt(realKg, 10) - maxrate);
                    cargoExtra =
                        (parseInt(realKg, 10) - maxrate) * parseInt(rateKgExtra, 10) * 1.16;
                }
            } else {
                //console.log('no entra en ninguna tarifa');
                cargo =
                    (parseInt(realKg, 10) - parseInt(kgDeclarados, 10)) *
                    parseInt(rateKgExtra, 10) *
                    1.16;
            }
        });
        //console.log('cargoExtraCero', cargoExtraCero, 'cargoExtra', cargoExtra, 'cargo', cargo);
        if (cargoExtraCero === 0) {
            setMatchRate(false);
            setCargo(cargoExtraCero);
        } else if (cargoExtra < cargo) {
            setMatchRate(true);
            setCargo(cargoExtra);
        } else {
            setMatchRate(true);
            setCargo(cargo);
        }
    }, [realKg, kgDeclarados, rateKgExtra, supplier, xlsData]);

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
                    setCostGuia(doc.data().supplierData.cargos.guia);
                    setCostTotal(doc.data().supplierData.Supplier_cost);
                    setErrorGuia(true);
                });
            })
            .catch(function(error) {
                setErrorGuia(true);
                console.log('Error getting documents: ', error);
            });
        db.collection('guia')
            .where('rastreo', '==', trackingNumber)
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    console.log(doc.data());
                    setGuia(doc.id);
                    setCostGuia(doc.data().supplierData.cargos.guia);
                    setCostTotal(doc.data().supplierData.Supplier_cost);
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
            console.log('obteniendo datos de la guia');
            docRef
                .get()
                .then(function(doc) {
                    if (doc.exists) {
                        //console.log(doc.data());
                        setDocId(doc.id);
                        setName(doc.data().name);
                        setUserId(doc.data().ID);
                        setDate(
                            doc
                                .data()
                                .creation_date.toDate()
                                .toLocaleDateString(),
                        );
                        setKgdeclarados(
                            doc.data().package.weight >
                                Math.ceil(
                                    (doc.data().package.height *
                                        doc.data().package.width *
                                        doc.data().package.depth) /
                                        5000,
                                )
                                ? doc.data().package.weight
                                : Math.ceil(
                                      (doc.data().package.height *
                                          doc.data().package.width *
                                          doc.data().package.depth) /
                                          5000,
                                  ),
                        );
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
        let overWeightSorted = [];
        const overWeightInformation = snapshot.docs.map(doc => {
            //console.log(doc.data().fecha.toDate());
            return {
                id: doc.id,
                fecha: doc.data().fecha.toDate(),
                ...doc.data(),
            };
        });
        overWeightSorted = overWeightInformation.sort((a, b) => b.fecha - a.fecha);
        setOverWeightInformation(overWeightSorted);
    }

    useEffect(() => {
        console.log('cargo', cargo);
        console.log('entrando aqui, 5 use effect');
        const reloadOverWeight = () => {
            db.collection('overweights').onSnapshot(handleOverWeight);
        };
        //setCargo(toFixed((realKg - kgDeclarados) * parseInt(rateKgExtra, 10) * 1.16), 2);
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
        swal.fire('Agregado', '', 'success');
        console.log('xlsData', xlsData);
        console.log('cargo', cargo);
        //Datos manualmente
        if (name) {
            console.log('xlsData', xlsData);
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
                    console.log(addOverWeightData);
                    setGuia('');
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
                console.log('entrando a la coleccion guia');
                console.log('xlsData', xlsData);
                let guia = [overWeight.guia];
                console.log(guia);
                let weight;
                let volWeight;
                let costGuia;
                let maxrate;
                let supplier;
                let kgDeclarados;
                db.collection('guia')
                    .where('rastreo', 'array-contains', overWeight.guia)
                    .get()
                    .then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                            const IdGuiaXls = doc.id;
                            console.log('si entro');
                            console.log('IdGuiaXls', IdGuiaXls);
                            db.collection('guia')
                                .doc(IdGuiaXls)
                                .get()
                                .then(function(doc) {
                                    if (doc.exists) {
                                        console.log(doc.data());
                                        weight = doc.data().package.weight;
                                        volWeight = Math.ceil(
                                            (doc.data().package.height *
                                                doc.data().package.width *
                                                doc.data().package.depth) /
                                                5000,
                                        );
                                        costGuia = doc.data().supplierData.cargos.guia;
                                        supplier = doc.data().supplierData.Supplier;
                                        kgDeclarados = weight > volWeight ? weight : volWeight;

                                        console.log(
                                            'weight',
                                            weight,
                                            'volWeight',
                                            volWeight,
                                            'costGuia',
                                            costGuia,
                                            'supplier',
                                            supplier,
                                            'kgDeclarados',
                                            kgDeclarados,
                                        );
                                        setUserId(doc.data().ID);
                                        db.collection('profiles')
                                            .where('ID', '==', doc.data().ID)
                                            .get()
                                            .then(function(profilesSnapshot) {
                                                profilesSnapshot.forEach(function(profileDoc) {
                                                    //console.log(profileDoc);
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
                                                            console.log(
                                                                'obteniendo las tarifas',
                                                                overweightRatesBase,
                                                            );
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
                                                            console.log(
                                                                'obteniendo los kg extra',
                                                                overweightRatesBaseXls,
                                                            );
                                                            console.log(
                                                                'realKg',
                                                                overWeight.kilos_reales,
                                                            );
                                                            console.log(
                                                                'overweightRatesBase',
                                                                overweightRatesBase,
                                                            );
                                                            let minmax = overweightRatesBase.map(
                                                                value => ({
                                                                    min: value.min,
                                                                    max: value.max,
                                                                }),
                                                            );
                                                            console.log('minmax', minmax);
                                                            let cargoOverweight;
                                                            let cargoExtra;
                                                            overweightRatesBase.forEach(rates => {
                                                                if (
                                                                    parseInt(rates.min, 10) <=
                                                                        parseInt(
                                                                            kgDeclarados,
                                                                            10,
                                                                        ) &&
                                                                    parseInt(rates.max, 10) >=
                                                                        parseInt(
                                                                            kgDeclarados,
                                                                            10,
                                                                        ) &&
                                                                    rates.precio === costGuia &&
                                                                    rates.entrega === supplier &&
                                                                    !rates.kgExtra
                                                                ) {
                                                                    console.log(
                                                                        'guardando el max rate de su tarifa',
                                                                    );
                                                                    maxrate = parseInt(
                                                                        rates.max,
                                                                        10,
                                                                    );
                                                                    console.log(maxrate);
                                                                    if (
                                                                        parseInt(rates.min, 10) <=
                                                                            parseInt(
                                                                                overWeight.kilos_reales,
                                                                                10,
                                                                            ) &&
                                                                        parseInt(rates.max, 10) >=
                                                                            parseInt(
                                                                                overWeight.kilos_reales,
                                                                                10,
                                                                            ) &&
                                                                        rates.precio === costGuia &&
                                                                        rates.entrega ===
                                                                            supplier &&
                                                                        !rates.kgExtra
                                                                    ) {
                                                                        console.log(
                                                                            'entra en su tarifa',
                                                                        );
                                                                        cargoOverweight = 0;
                                                                    } else {
                                                                        console.log(
                                                                            overWeight.kilos_reales -
                                                                                maxrate,
                                                                        );
                                                                        console.log(
                                                                            'cargo dentro de la tarifa',
                                                                        );
                                                                        cargoOverweight = toFixed(
                                                                            (overWeight.kilos_reales -
                                                                                maxrate) *
                                                                                parseInt(
                                                                                    overweightRatesBaseXls,
                                                                                    10,
                                                                                ) *
                                                                                1.16,
                                                                        );
                                                                    }
                                                                } else {
                                                                    console.log(
                                                                        'no entra en ninguna tarifa',
                                                                    );
                                                                    cargoExtra = toFixed(
                                                                        (overWeight.kilos_reales -
                                                                            doc.data().package
                                                                                .weight) *
                                                                            parseInt(
                                                                                overweightRatesBaseXls,
                                                                                10,
                                                                            ) *
                                                                            1.16,
                                                                        2,
                                                                    );
                                                                }
                                                            });
                                                            if (cargoOverweight === 0) {
                                                                console.log(
                                                                    'cargoOverweight es igual a',
                                                                    cargoOverweight,
                                                                );
                                                                cargoOverweight = cargoOverweight;
                                                            } else if (
                                                                cargoOverweight < cargoExtra
                                                            ) {
                                                                console.log(
                                                                    'cargoOverweight es igual a',
                                                                    cargoOverweight,
                                                                );
                                                                cargoOverweight = cargoOverweight;
                                                            } else {
                                                                cargoOverweight = cargoExtra;
                                                            }

                                                            console.log(
                                                                'cargoOverweight',
                                                                cargoOverweight,
                                                            );
                                                            const cargo = db
                                                                .collection('overweights')
                                                                .add({
                                                                    ID: doc.data().ID,
                                                                    usuario: doc.data().name,
                                                                    fecha: creationDate,
                                                                    guia: IdGuiaXls,
                                                                    rastreo: overWeight.guia,
                                                                    kilos_declarados: kgDeclarados,
                                                                    kilos_reales:
                                                                        overWeight.kilos_reales,
                                                                    cargo: cargoOverweight,
                                                                })
                                                                .then(function(docRef) {
                                                                    console.log(
                                                                        'documento subido exitosamente',
                                                                    );
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
                            value={date ? date : undefined}
                            className="rainbow-p-around_medium"
                            style={{ flex: '1 1' }}
                            readOnly
                        />
                        <Input
                            id="kgs"
                            label="Kgs Cobrados"
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
                        {!matchRate && (
                            <Container style={{ flex: '1 1 100%' }}>
                                <Row>
                                    <Col>
                                        <div className="">
                                            El sobrepeso abarca la tarifa del cliente
                                        </div>
                                    </Col>
                                    <Col>
                                        <p> Tarifa : {matchPrice} </p>
                                    </Col>
                                </Row>
                                <div className="app-spacer height-1 height-2" />
                            </Container>
                        )}
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
                                    //console.log(data)
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
