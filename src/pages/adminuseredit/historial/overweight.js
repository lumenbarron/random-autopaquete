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
    const [confirmar, setConfirmar] = useState(true);
    const [inputRealKg, setinputRealKg] = useState(true);

    const creationDate = new Date();
    let guiaRef = useRef('');
    let rateKgExtraSup = useRef('');
    let supplierExtra = useRef('');

    //Get user overWeight data
    useEffect(() => {
        if (!user) {
        } else {
            console.log('obteniendo sobrepesos de usuario');
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
            if (doc.data().cargo === 0) {
                console.log(doc.id);
                db.collection('overweights')
                    .doc(doc.id)
                    .delete()
                    .then(function() {
                        console.log('Document successfully deleted', doc.id);
                    })
                    .catch(function(error) {
                        console.error('Error removing document: ', error);
                    });
            }
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
        setDate('');
        setKgdeclarados('');
        setMatchPrice(`Guia no registrada`);
        setCargo('');
        setRealKg('');
        setConfirmar(true);
        setinputRealKg(true);
        console.log('obteniendo guia');
        e.preventDefault();
        setTrackNumber(e.target.value);
        guiaRef.current = e.target.value;
        let overWeightGuide = [];
        if (e.target.value.trim() === '') {
            setMatchPrice('');
        }
        history.forEach(item => {
            // console.log( item.rastreo)
            overWeightGuide.push(item.rastreo);
        });
        // console.log('overWeightGuide', overWeightGuide);
        if (overWeightGuide.includes(guiaRef.current)) {
            setMatchPrice(` Esta Guia ya tiene sobrepeso`);
            guiaRef.current = '';
        } else {
            // console.log(guiaRef.current)
            setTrackNumber(e.target.value);
            db.collection('guia')
                .where('ID', '==', user.ID)
                .where('rastreo', 'array-contains', guiaRef.current)
                .get()
                .then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc, index, docs) {
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

                        setMatchPrice('');
                        setinputRealKg(false);
                    });
                })
                .catch(function(error) {
                    console.log('Error getting documents: ', error);
                });
        }
    };

    //Make operations
    const calculateExtraWeight = e => {
        let cargoExtra = 0;
        let overweightCostBase;
        let costoKiloExtra;
        let realKg = e.target.value;
        let totalKg;
        setRealKg(e.target.value);
        setConfirmar(true);
        if (realKg.trim() === '') {
            setMatchPrice('');
            setCargo('');
        }
        //mientras que los kilos reales sean menores que los de la plataforma el cargo es 0
        if (parseInt(realKg, 10) <= parseInt(kgDeclarados, 10) && parseInt(realKg, 10) >= 0) {
            console.log('cargo 0');
            setMatchPrice(` Peso cubierto con ${supplier}`);
            setCargo(cargoExtra);
        } //si no, se hace el calculo
        else if (parseInt(realKg, 10) > parseInt(kgDeclarados, 10)) {
            //se busca el convenio del cliente
            console.log('Convenio:', overweightRatesBase);
            //se busca el rango en donde esta kilos cobrados
            overweightCostBase = overweightRatesBase
                .filter(rates => rates.entrega === supplier)
                .filter(
                    rates =>
                        parseInt(rates.min, 10) <= parseInt(kgDeclarados, 10) &&
                        parseInt(rates.max, 10) >= parseInt(kgDeclarados, 10),
                )[0];
            //si los kilos cobrados es mayor que el rango buscar el valor maximo registrado
            if (overweightCostBase === undefined) {
                overweightCostBase = overweightRatesBase.filter(
                    rates => rates.entrega === supplier,
                );
                overweightCostBase = overweightRatesBase[overweightRatesBase.length - 1];
            }

            costoKiloExtra = overweightRatesBase.filter(
                rates => rates.entrega === supplier + 'Extra',
            )[0].kgExtra;

            console.log('Rango: ', overweightCostBase);
            console.log('Costo Kilo extra: ', costoKiloExtra);

            try {
                totalKg = realKg - overweightCostBase.max;
                if (totalKg <= 0) {
                    console.log('cargo 0, Kilos a cobrar:', totalKg);
                    setMatchPrice(` Peso cubierto con ${supplier}`);
                    setCargo(cargoExtra);
                } else {
                    try {
                        console.log('Kilos a cobrar:', totalKg);
                        cargoExtra = totalKg * costoKiloExtra * 1.16;
                        console.log('Cargo extra:', cargoExtra);
                        setMatchPrice(` Kilos a cobrar: ${totalKg}`);
                        setCargo(cargoExtra);
                        setConfirmar(false);
                    } catch (err) {
                        console.log('No se encontro Costo de kilo extra');
                        setMatchPrice(` Precio kilo Extra ${supplier} no registrado`);
                        console.log(err.message);
                        setCargo(cargoExtra);
                    }
                }
            } catch (err) {
                console.log('no se encontro convenio');
                setMatchPrice(` Precios no registrados`);
                console.log(err.message);
            }
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
                console.log(costo, doc.data(), saldo);
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
                    setMatchPrice('');
                    setConfirmar(true);
                    setinputRealKg(true);
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
                    disabled={inputRealKg}
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
                <div style={{ flex: '1 1' }}>
                    <p>Estatus</p>
                    <p>{matchPrice}</p>
                </div>
                <Button
                    disabled={confirmar}
                    style={{ flex: '1 1' }}
                    className="btn-confirm"
                    label="Confirmar"
                    onClick={addOverWeight}
                />
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
