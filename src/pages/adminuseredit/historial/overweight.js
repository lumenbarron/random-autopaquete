import React, { useState, useEffect, useRef } from 'react';
import { Column, Input, Badge, TableWithBrowserPagination, Button } from 'react-rainbow-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import swal from 'sweetalert2';
import toFixed from 'accounting-js/lib/toFixed';
import formatMoney from 'accounting-js/lib/formatMoney';
import { Row, Col, Container } from 'react-bootstrap';
import { useFirebaseApp } from 'reactfire';
import { StyledPanel, StyleHeader } from './styled';
import ExportReactCSV from '../../dowloadData/index';

const StyledTable = styled(TableWithBrowserPagination)`
    td[data-label='Guía'] {
        > div {
            line-height: 1.2rem;
            > span {
                white-space: break-spaces;
                font-size: 12px;
            }
        }
    }
`;

export default function OverweightUser({ user }) {
    const firebase = useFirebaseApp();
    const db = firebase.firestore();
    const [history, setHistory] = useState([]);
    const [saldo, setSaldo] = useState();
    const [guiaId, setGuiaId] = useState();
    const [trackNumber, setTrackNumber] = useState();
    const [costGuia, setCostGuia] = useState();

    const [matchRate, setMatchRate] = useState(false);
    const [matchPrice, setMatchPrice] = useState(false);
    const [userId, setUserId] = useState();
    const [name, setName] = useState('');
    const [date, setDate] = useState();
    const [kgDeclarados, setKgdeclarados] = useState();
    const [realKg, setRealKg] = useState();
    const [supplier, setSupplier] = useState([]);
    const [profileDocId, setProfileDocId] = useState();
    const [rateKgExtra, setRateKgExtra] = useState();
    const [overweightRatesBase, setOverweightRatesBase] = useState([]);
    const [cargo, setCargo] = useState();

    const creationDate = new Date();
    let guiaRef = useRef('');
    let rateKgExtraSup = useRef('');
    let supplierExtra = useRef('');

    //Get user overWeight data
    useEffect(() => {
        if (!user) {
        } else {
            db.collection('profiles')
                .where('ID', '==', user.ID)
                .onSnapshot(
                    function(profilesSnapshot) {
                        profilesSnapshot.forEach(function(profileDoc) {
                            //console.log(profileDoc.data());
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
                                    //console.log('obteniendo las tarifas', tmpOverweightRatesBase);
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
    }, [user]);

    if (isNaN(cargo)) {
        setCargo(0);
    }

    //Get user overweights in real time
    useEffect(() => {
        const reloadOverweight = () => {
            db.collection('overweights')
                .where('ID', '==', user.ID)
                .orderBy('fecha', 'desc')
                .onSnapshot(handleOverweight);
        };
        reloadOverweight();
    }, []);

    const handleOverweight = querySnapshot => {
        let dataOverweights = [];
        querySnapshot.forEach(function(doc) {
            //console.log(doc.id, doc.data().cargo);
            dataOverweights.push({
                id: doc.id,
                ...doc.data(),
            });
        });
        setHistory(dataOverweights);
    };

    const infoOverweight = history.map(overweight => {
        return {
            id: overweight.id,
            guide: overweight.rastreo,
            date: overweight.fecha.toDate().toLocaleDateString(),
            kdeclared: overweight.kilos_declarados,
            kreal: overweight.kilos_reales,
            cadd: formatMoney(overweight.cargo),
            delete: (
                <FontAwesomeIcon
                    icon={faTrashAlt}
                    onClick={() => deleteOverWeight(overweight.id)}
                />
            ),
        };
    });

    //Get the id data´s guia
    const getGuia = e => {
        e.preventDefault();
        setTrackNumber(e.target.value);
        guiaRef.current = e.target.value;
        let overWeightGuide = [];
        history.forEach(item => {
            // console.log( item.rastreo)
            overWeightGuide.push(item.rastreo);
        });
        // console.log('overWeightGuide', overWeightGuide);
        if (overWeightGuide.includes(guiaRef.current)) {
            swal.fire('¡Oh no!', 'Parece que esta guía ya tiene sobrepeso', 'error');
            guiaRef.current = '';
        } else {
            // console.log(guiaRef.current)
            setTrackNumber(e.target.value);
            db.collection('guia')
                .where('ID', '==', user.ID)
                .where('rastreo', 'array-contains', guiaRef.current)
                .get()
                .then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        // console.log(doc.data());
                        setGuiaId(doc.id);
                        setCostGuia(doc.data().supplierData.cargos.guia);
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
                        supplierExtra.current = doc.data().supplierData.tarifa.entrega;
                        getExtraWeight(doc.data().supplierData.tarifa.entrega);
                        // setErrorGuia(true);
                    });
                })
                .catch(function(error) {
                    // setErrorGuia(true);
                    console.log('Error getting documents: ', error);
                });
        }
    };

    //Get extra overweight rate
    const getExtraWeight = supplierExtra => {
        //console.log(overweightRatesBase, 'todos las tarifas', supplier, 'supplier', supplierExtra);
        let overweightRatesExtra = overweightRatesBase
            .filter(kgExtraFilter => {
                return kgExtraFilter.entrega === `${supplierExtra}Extra`;
            })
            .map(getCostkgExtra => {
                return getCostkgExtra.kgExtra;
            });
        //console.log('kg extra', overweightRatesExtra);
        setRateKgExtra(overweightRatesExtra);
        rateKgExtraSup.current = overweightRatesExtra;
        //calculateExtraWeight(overweightRatesExtra, supplier)
    };

    //Make operations
    const calculateExtraWeight = e => {
        let cargoExtraCero;
        let cargoExtra;
        let cargo;
        let maxrate;
        let realKg = e.target.value;
        setRealKg(e.target.value);

        if (parseInt(realKg, 10) < parseInt(kgDeclarados, 10)) {
            //console.log('cargo 0');
            cargoExtraCero = 0;
        }

        overweightRatesBase.forEach(rates => {
            //console.log(rates.min, rates.max, rates.precio, rates.entrega, parseInt(realKg, 10));
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
                // let rest =  (parseInt(realKg, 10) - parseInt(kgDeclarados, 10))
                // console.log(rest, 'rest')
                cargo =
                    (parseInt(realKg, 10) - parseInt(kgDeclarados, 10)) *
                    parseInt(rateKgExtra, 10) *
                    1.16;
                //console.log(cargo)
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
    };

    const deleteOverWeight = idDoc => {
        // console.log('idDoc', idDoc);
        let costo = null;

        db.collection('overweights')
            .doc(idDoc)
            .get()
            .then(doc => {
                costo = doc.data().cargo;
                // console.log(costo,  doc.data(), saldo)
                if (!saldo) {
                    return null;
                } else {
                    updateSaldo(profileDocId, costo);
                    deleteOverWeightData(idDoc);
                }
            });

        const updateSaldo = (id, costo) => {
            // console.log(saldo, costo)
            db.collection('profiles')
                .doc(id)
                .update({
                    saldo: toFixed(parseFloat(saldo) + parseFloat(costo), 2),
                });
            console.log('sumado');
        };

        const deleteOverWeightData = idDoc => {
            db.collection('overweights')
                .doc(idDoc)
                .delete()
                .then(function() {
                    console.log('Document successfully deleted', idDoc);
                    swal.fire('Eliminado', '', 'success');
                })
                .catch(function(error) {
                    console.error('Error removing document: ', error);
                });
        };
    };

    const addOverWeight = () => {
        //console.log('cargo', cargo, 'saldo', saldo);
        //Datos manualmente
        if (userId) {
            //console.log('xlsData', xlsData);
            const addOverWeightData = {
                ID: userId,
                usuario: name,
                fecha: creationDate,
                guiaId,
                rastreo: trackNumber,
                kilos_declarados: kgDeclarados,
                kilos_reales: parseInt(realKg, 10),
                cargo,
            };
            //console.log(addOverWeightData);

            db.collection('overweights')
                .add(addOverWeightData)
                .then(function(docRef) {
                    console.log(addOverWeightData);
                    setGuiaId('');
                    setCostGuia('');
                    setUserId('');
                    setDate('');
                    setKgdeclarados('');
                    setSupplier('');
                    setTrackNumber('');
                    setRealKg('');
                    setCargo('');
                    console.log('Document written');
                    swal.fire('Agregado', '', 'success');
                })
                .catch(function(error) {
                    console.error('Error adding document: ', error);
                });

            //console.log(toFixed(parseFloat(saldo) - parseFloat(cargo), 2));

            db.collection('profiles')
                .doc(profileDocId)
                .update({
                    saldo: toFixed(parseFloat(saldo) - parseFloat(cargo), 2),
                });
            guiaRef.current = '';
        }
    };

    return (
        <>
            <StyleHeader>
                <Row className="row-header">
                    <h2>Sobrepesos</h2>
                    {/* <ExportReactCSV data={history} /> */}
                </Row>
            </StyleHeader>
            <div className="rainbow-flex rainbow-flex_wrap">
                <Input
                    id="guia"
                    label="Numero de guia"
                    className="rainbow-p-around_medium"
                    style={{ flex: '1 1' }}
                    onChange={e => getGuia(e)}
                    value={trackNumber}
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
                    style={{ flex: '1 1' }}
                    onChange={e => calculateExtraWeight(e)}
                    value={realKg}
                />
                <Input
                    id="cargo"
                    label="Cargo"
                    value={formatMoney(cargo)}
                    className="rainbow-p-around_medium"
                    style={{ flex: '1 1' }}
                    readOnly
                />
                {!matchRate && trackNumber && (
                    <Container style={{ flex: '1 1 100%' }}>
                        <Row>
                            <Col>
                                <div className="">El sobrepeso abarca la tarifa del cliente</div>
                            </Col>
                            <Col>
                                <p> Tarifa : {matchPrice} </p>
                            </Col>
                        </Row>
                        <div className="app-spacer height-1 height-2" />
                    </Container>
                )}
                <div style={{ flex: '1 1' }}>
                    <Button className="btn-confirm" label="Confirmar" onClick={addOverWeight} />
                </div>
            </div>
            <div className="rainbow-p-bottom_large rainbow-p-top_large">
                <StyledPanel>
                    <StyledTable
                        data={infoOverweight}
                        pageSize={10}
                        keyField="id"
                        emptyTitle="Oh no!"
                        emptyDescription="No hay ningun registro actualmente..."
                        className="direction-table"
                    >
                        <Column header="Número de Guía" field="guide" defaultWidth={250} />
                        <Column header="Fecha" field="date" />
                        <Column header="Kilos Cobrados" field="kdeclared" />
                        <Column header="Kilos reales" field="kreal" />
                        <Column header="Cargos Adicionales" field="cadd" />
                        <Column header="" field="delete" />
                    </StyledTable>
                </StyledPanel>
            </div>
        </>
    );
}
