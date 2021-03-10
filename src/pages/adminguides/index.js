import React, { useState, useEffect, useRef } from 'react';
import {
    Column,
    DatePicker,
    TableWithBrowserPagination,
    Select,
    Spinner,
    Input,
    Button,
} from 'react-rainbow-components';
import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { useFirebaseApp } from 'reactfire';
import { StyledAusers } from '../adminusers/styled';
import ExportReactCSV from '../dowloadData/index';
import swal from 'sweetalert2';

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

const DownloadLabel = ({ value }) => {
    const [label, setLabel] = useState(true);
    useEffect(() => {
        //console.log('value', value);
        if (value === 'no disponible') {
            setLabel(false);
        } else {
            setLabel(true);
        }
    }, []);
    return (
        <>
            {label ? (
                <a
                    download="guia"
                    href={`data:application/pdf;base64,${value}`}
                    title="Descargar etiqueta"
                    variant="neutral"
                    className="rainbow-m-around_medium"
                >
                    <FontAwesomeIcon icon={faDownload} className="rainbow-medium" />
                </a>
            ) : (
                <p className="rainbow-m-around_medium">N/D</p>
            )}
        </>
    );
};

function Destinations(value) {
    return (
        <div style={{ lineHeight: '30px' }}>
            <span style={{ whiteSpace: 'initial' }}>{value.row.Destination}</span>
        </div>
    );
}

function Origins(value) {
    return (
        <div style={{ lineHeight: '30px' }}>
            <span style={{ whiteSpace: 'initial' }}>{value.row.origin}</span>
        </div>
    );
}

export default function AllGuides({}) {
    const firebase = useFirebaseApp();
    const db = firebase.firestore();
    const [history, setHistory] = useState([]);
    const [allGuides, setAllGuides] = useState([]);
    const [usersName, setUsersName] = useState([]);
    const [tableData, setTableData] = useState();
    const [tableUsers, setTableUsers] = useState();
    const [selectName, setSelectName] = useState();
    const [selectSupplier, setSelectSupplier] = useState();
    const [selectDate, setSelectDate] = useState({ date: new Date() });
    const [startDate, setStartDate] = useState({ date: new Date() });
    const [endDate, setEndDate] = useState({ date: new Date() });
    const [displayData, setDisplayData] = useState(false);
    const [available, setAvailable] = useState(false);
    const nameSelected = useRef('usuario');
    const supplierSelected = useRef('servicio');
    const dateFrom = useRef('');
    const dateTo = useRef('');
    const dateSelected = useRef({ date: new Date() });
    let allSuppliers = [
        {
            value: 'servicio',
            label: 'servicio',
        },
        {
            value: 'fedexEconomico',
            label: 'Fedex Economico',
        },
        {
            value: 'fedexDiaSiguiente',
            label: 'Fedex Dia Siguiente',
        },
        {
            value: 'redpackExpress',
            label: 'Redpack Express',
        },
        {
            value: 'redpackEcoExpress',
            label: 'Redpack Eco Express',
        },
        {
            value: 'autoencargosEconomico',
            label: 'Autoencargos',
        },
    ];
    const optionsDate = { year: '2-digit', month: '2-digit', day: '2-digit' };

    //Get the first 100 guides, show only for today
    useEffect(() => {
        let dataGuias = [];
        let guiasByDate = [];
        let convertDate = new Date().toLocaleDateString('es-US', optionsDate);
        db.collection('guia')
            .where('status', '==', 'completed')
            .orderBy('creation_date', 'desc')
            .limit(100)
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    //console.log(doc.id, doc.data() );
                    // if ( typeof doc.data().rastreo == 'undefined' ) {
                    // console.log(doc.id, doc.data())
                    // }
                    dataGuias.push({
                        id: doc.id,
                        volumetricWeight: Math.ceil(
                            (doc.data().package.height *
                                doc.data().package.width *
                                doc.data().package.depth) /
                                5000,
                        ),
                        sentDate: doc
                            .data()
                            .creation_date.toDate()
                            .toLocaleDateString('es-US', optionsDate),
                        ...doc.data(),
                    });
                });

                guiasByDate = dataGuias.filter(item => item.sentDate.includes(convertDate));
                setHistory(guiasByDate);
                //localStorage.setItem('data', JSON.stringify(guiasByDate))
                //console.log(guiasByDate);
                setDisplayData(true);
                searchName();
                // if (localStorage.getItem('data')) {
                //     let dataGuias = JSON.parse(localStorage.getItem('data'));
                //     console.log(dataGuias);
                //     setAllGuides(dataGuias);
                // } else {
                //     allGuidesEver();
                // }
            })
            .catch(function(error) {
                console.log('Error getting documents: ', error);
            });
    }, []);

    //Get all the guides, all the times
    const allGuidesEver = () => {
        let dataALLGuias = [];
        db.collection('guia')
            .where('status', '==', 'completed')
            .orderBy('creation_date', 'desc')
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    dataALLGuias.push({
                        id: doc.id,
                        volumetricWeight: Math.ceil(
                            (doc.data().package.height *
                                doc.data().package.width *
                                doc.data().package.depth) /
                                5000,
                        ),
                        sentDate: doc
                            .data()
                            .creation_date.toDate()
                            .toLocaleDateString('es-US', optionsDate),
                        ...doc.data(),
                    });
                });
                //console.log(dataALLGuias);
                setAllGuides(dataALLGuias);
                setAvailable(true);
            })
            .catch(function(error) {
                console.log('Error getting documents: ', error);
            });
    };

    const searchName = () => {
        let dataUsers = [];
        let dataSingleUser = [];
        db.collection('guia')
            .where('status', '==', 'completed')
            .orderBy('creation_date', 'desc')
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    //console.log(doc.data().name)
                    dataUsers.push(doc.data().name);
                });
                //console.log(dataUsers);
                dataSingleUser = dataUsers
                    .filter((item, index) => dataUsers.indexOf(item) === index)
                    .sort();
                //onsole.log(dataSingleUser);
                setUsersName(dataSingleUser);
            });
    };

    useEffect(() => {
        setTableData(
            history.map(historyRecord => {
                return {
                    id: historyRecord.id,
                    date: historyRecord.package.creation_date,
                    name: historyRecord.name,
                    guide: historyRecord.rastreo,
                    nameorigin: `${historyRecord.sender_addresses.name} , ${historyRecord.sender_addresses.phone}`,
                    origin: `${historyRecord.sender_addresses.street_name} , ${historyRecord.sender_addresses.street_number} , ${historyRecord.sender_addresses.neighborhood} , ${historyRecord.sender_addresses.country} , ${historyRecord.sender_addresses.codigo_postal}`,
                    namedestination: `${historyRecord.receiver_addresses.name} , ${historyRecord.receiver_addresses.phone}`,
                    Destination: `${historyRecord.receiver_addresses.street_name} , ${historyRecord.receiver_addresses.street_number} , ${historyRecord.receiver_addresses.neighborhood} , ${historyRecord.receiver_addresses.country} , ${historyRecord.receiver_addresses.codigo_postal}`,

                    service: historyRecord.supplierData.Supplier,
                    volumetricWeight: historyRecord.volumetricWeight,
                    weight: historyRecord.package.weight,
                    measurement: `${historyRecord.package.height} x ${historyRecord.package.width} x ${historyRecord.package.depth}`,
                    cost:
                        typeof historyRecord.rastreo != 'undefined'
                            ? historyRecord.supplierData.Supplier_cost
                            : '0.00',
                    label:
                        historyRecord.supplierData.Supplier === 'autoencargosEconomico'
                            ? 'no disponible'
                            : historyRecord.label,
                };
            }),
            // console.log(history),
        );
    }, [history]);

    useEffect(() => {
        let mapUsers = usersName.map(historyRecord => {
            return {
                value: historyRecord,
                label: historyRecord,
            };
        });
        setTableUsers([{ value: 'usuario', label: 'usuario' }, ...mapUsers]);
        setDisplayData(true);
    }, [usersName]);

    const searchByName = name => {
        let dataGuiasEachUser = [];
        db.collection('guia')
            .where('name', '==', name)
            .where('status', '==', 'completed')
            .orderBy('creation_date', 'desc')
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    console.log('guias del cliente ' + name + ':', doc.id);
                    dataGuiasEachUser.push({
                        id: doc.id,
                        volumetricWeight: Math.ceil(
                            (doc.data().package.height *
                                doc.data().package.width *
                                doc.data().package.depth) /
                                5000,
                        ),
                        ...doc.data(),
                    });
                });
                setHistory(dataGuiasEachUser);
                setDisplayData(true);
                nameSelected.current = name;
                setSelectName(name);
                if (supplierSelected.current != 'servicio' || dateSelected.current != new Date()) {
                    setSelectSupplier('');
                    setSelectDate({ date: new Date() });
                }
                // console.log('dataGuiasEachUser', dataGuiasEachUser);
            });
    };

    const searchBySupplier = supplier => {
        let dataGuiasBySupplier = [];
        db.collection('guia')
            .where('supplierData.Supplier', '==', supplier)
            .where('status', '==', 'completed')
            .orderBy('creation_date', 'desc')
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    //console.log(doc.id, doc.data() );
                    // console.log('guias del cliente ' + supplier + ':', doc.data());
                    dataGuiasBySupplier.push({
                        id: doc.id,
                        volumetricWeight: Math.ceil(
                            (doc.data().package.height *
                                doc.data().package.width *
                                doc.data().package.depth) /
                                5000,
                        ),
                        ...doc.data(),
                    });
                });
                setHistory(dataGuiasBySupplier);
                setDisplayData(true);
                supplierSelected.current = supplier;
                setSelectSupplier(supplier);
                if (nameSelected.current != 'usuario' || dateSelected.current != new Date()) {
                    setSelectName('');
                    setSelectDate({ date: new Date() });
                }
            });
    };

    // const searchByDate = date => {
    //     let dataGuiasByDate = [];
    //     let guiasByDate = [];
    //     const optionsDate = { year: '2-digit', month: '2-digit', day: '2-digit' };
    //     let convertDate = new Date(date).toLocaleDateString('es-US', options);
    //     setSelectDate({ date: date });
    //     db.collection('guia')
    //         .where('status', '==', 'completed')
    //         .orderBy('creation_date', 'desc')
    //         .get()
    //         .then(function(querySnapshot) {
    //             querySnapshot.forEach(function(doc) {
    //                 dataGuiasByDate.push({
    //                     id: doc.id,
    //                     volumetricWeight: Math.ceil(
    //                         (doc.data().package.height *
    //                             doc.data().package.width *
    //                             doc.data().package.depth) /
    //                             5000,
    //                     ),
    //                     sentDate: doc
    //                         .data()
    //                         .creation_date.toDate()
    //                         .toLocaleDateString('es-US', options),
    //                     ...doc.data(),
    //                 });
    //                 // console.log('todas las guias', dataGuiasByDate);
    //             });
    //             guiasByDate = dataGuiasByDate.filter(item => item.sentDate.includes(convertDate));
    //             console.log('todas las guias', guiasByDate);
    //             setHistory(guiasByDate);
    //             setDisplayData(true);
    //             dateSelected.current = date;
    //             if (nameSelected.current != 'usuario' || supplierSelected.current != 'servicio') {
    //                 setSelectName('');
    //                 setSelectSupplier('');
    //             }
    //         })
    //         .catch(function(error) {
    //             console.log('Error getting documents: ', error);
    //         });
    // };

    const searchByDate = (startDate, endDate) => {
        console.log(startDate, endDate, allGuides);
        let newdates = [];
        let infoDates = [];

        const getDaysArray = (start, end) => {
            console.log(start);
            console.log(end);
            for (var arr = [], dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
                arr.push(new Date(dt));
            }
            arr.push(new Date(end));
            return arr;
        };
        let daylist = getDaysArray(new Date(startDate), new Date(endDate));
        console.log('daylist', daylist);
        daylist.forEach(dat => {
            newdates.push(dat.toLocaleDateString('es-US', optionsDate).slice(0, 10));
        });
        //console.log(newdates)
        allGuides.forEach(e => {
            // console.log(e.date)
            if (newdates.includes(e.sentDate)) {
                infoDates.push(e);
            }
        });
        setHistory(infoDates);
        setDisplayData(true);
        console.log(infoDates);
    };

    const getIdGuia = trackingNumber => {
        // console.log(trackingNumber);
        let dataGuia = [];
        if (trackingNumber == '' || !trackingNumber) {
            swal.fire(
                '¡Oh no!',
                'Parece que no hay alguna guía con ese número, podrías revisar',
                'error',
            );
        } else {
            db.collection('guia')
                .where('rastreo', '==', trackingNumber)
                .get()
                .then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        console.log(doc.data());
                        dataGuia.push({
                            id: doc.id,
                            volumetricWeight: Math.ceil(
                                (doc.data().package.height *
                                    doc.data().package.width *
                                    doc.data().package.depth) /
                                    5000,
                            ),
                            ...doc.data(),
                        });
                        setHistory(dataGuia);
                        setDisplayData(true);
                    });
                })
                .catch(function(error) {
                    swal.fire(
                        '¡Oh no!',
                        'Parece que no hay alguna guía con ese número, podrías revisar',
                        'error',
                    );
                    console.log('Error getting documents: ', error);
                });
            db.collection('guia')
                .where('rastreo', 'array-contains', trackingNumber)
                .get()
                .then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        console.log(doc.data());
                        dataGuia.push({
                            id: doc.id,
                            volumetricWeight: Math.ceil(
                                (doc.data().package.height *
                                    doc.data().package.width *
                                    doc.data().package.depth) /
                                    5000,
                            ),
                            ...doc.data(),
                        });
                        setHistory(dataGuia);
                        setDisplayData(true);
                    });
                })
                .catch(function(error) {
                    swal.fire(
                        '¡Oh no!',
                        'Parece que no hay alguna guía con ese número, podrías revisar',
                        'error',
                    );
                    console.log('Error getting documents: ', error);
                });
        }
    };

    return (
        <StyledAusers>
            <div className="back">
                <Row className="content-header row-header">
                    <h1 id="header-margin">Historial de envíos</h1>
                    <ExportReactCSV data={history} />
                </Row>
                <Row className="content-header">
                    <h2 style={{ marginBottom: 0 }}>Filtrar por :</h2>
                    <Col md="3">
                        <DatePicker
                            // formatStyle="medium"
                            label="Desde"
                            value={startDate.date}
                            onChange={value => setStartDate({ date: value })}
                        />
                    </Col>
                    <Col md="3">
                        <DatePicker
                            // formatStyle="small"
                            label="Hasta"
                            value={endDate.date}
                            onChange={value => setEndDate({ date: value })}
                        />
                    </Col>
                    <div className="rainbow-align-content_center rainbow-flex_wrap">
                        <Button
                            disabled={available ? false : true}
                            className="rainbow-m-around_medium"
                            onClick={() => searchByDate(startDate.date, endDate.date)}
                        >
                            Buscar
                        </Button>
                    </div>
                </Row>
                <Row className="content-header">
                    <Col>
                        <Input
                            id="guia"
                            placeholder="Numero de guia"
                            className="rainbow-p-around_medium"
                            style={{ flex: '1 1' }}
                            onChange={ev => getIdGuia(ev.target.value)}
                            icon={
                                <FontAwesomeIcon icon={faSearch} className="rainbow-color_gray-3" />
                            }
                        />
                        {/* <Button variant="destructive" className="rainbow-m-around_medium" onClick={ev => getIdGuia(ev.target.value)}>Buscar</Button> */}
                    </Col>
                    <Col>
                        <Select
                            options={tableUsers}
                            id="example-select-1"
                            style={{ width: '100%', padding: 0 }}
                            value={selectName}
                            onChange={ev => searchByName(ev.target.value)}
                            className="rainbow-m-vertical_x-large rainbow-p-horizontal_medium rainbow-m_auto"
                        />
                    </Col>
                    <Col>
                        <Select
                            options={allSuppliers}
                            id="example-select-2"
                            style={{ width: '100%', padding: 0 }}
                            value={selectSupplier}
                            onChange={ev => searchBySupplier(ev.target.value)}
                            className="rainbow-m-vertical_x-large rainbow-p-horizontal_medium rainbow-m_auto"
                        />
                    </Col>
                    {/* <Col>
                        <DatePicker
                            formatStyle="large"
                            value={selectDate.date}
                            onChange={value => searchByDate(value)}
                        />
                    </Col> */}
                </Row>
                <div className="rainbow-p-bottom_xx-large">
                    {displayData ? (
                        <StyledTable
                            data={tableData}
                            pageSize={20}
                            keyField="id"
                            emptyTitle="Oh no!"
                            emptyDescription="No hay ningun registro actualmente..."
                            className="direction-table"
                        >
                            <Column header="Fecha " field="date" defaultWidth={105} />
                            <Column header="Name " field="name" defaultWidth={120} />
                            <Column header="Guía" field="guide" defaultWidth={120} />
                            <Column header="Nombre Origen" field="nameorigin" defaultWidth={100} />
                            <Column
                                header="Origen"
                                component={Origins}
                                field="origin"
                                style={{ lineHeight: 25 }}
                                // defaultWidth={125}
                            />
                            <Column
                                header="Nombre Destino"
                                field="namedestination"
                                defaultWidth={100}
                            />
                            <Column
                                header="Destino"
                                component={Destinations}
                                field="Destination"
                                style={{ lineHeight: 25 }}
                                // defaultWidth={125}
                            />
                            <Column header="Servicio" field="service" defaultWidth={105} />
                            <Column header="PF" field="weight" defaultWidth={70} />
                            <Column header="PV" field="volumetricWeight" defaultWidth={70} />
                            <Column header="Medidas (cm)" field="measurement" defaultWidth={115} />
                            <Column header="Costo" field="cost" defaultWidth={75} />
                            <Column
                                header="Etiqueta"
                                component={DownloadLabel}
                                field="label"
                                style={{ width: '10px!important' }}
                                defaultWidth={100}
                            />
                        </StyledTable>
                    ) : (
                        <div className="rainbow-position_relative rainbow-m-vertical_xx-large rainbow-p-vertical_xx-large">
                            <Spinner size="large" />
                        </div>
                    )}
                </div>
            </div>
        </StyledAusers>
    );
}
