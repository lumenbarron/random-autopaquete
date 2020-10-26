import React, { useState, useEffect, useRef } from 'react';
import {
    Column,
    Badge,
    TableWithBrowserPagination,
    Select,
    Spinner,
} from 'react-rainbow-components';
import styled from 'styled-components';
import Row from 'react-bootstrap/Row';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { useFirebaseApp } from 'reactfire';
import { StyledUserEdit, StyledPanel } from '../adminuseredit/styled';
import { StyledAusers } from '../adminusers/styled';

// const StyledBadge = styled(Badge)`
//     color: #09d3ac;
// `;

// const StyledColumn = styled(Column)`
//     color: red;
//     white-space: initial;
// `;

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

// const containerStyles = {
//     maxWidth: 700,
//     color: 'red',
// };

//const StatusBadge = ({ value }) => <StyledBadge label={value} variant="lightest" />;

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
            <span style={{ whiteSpace: 'initial' }}>{value.row.origin}</span>
        </div>
    );
}

function NamesDest(value) {
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
    const [usersName, setUsersName] = useState([]);
    const [tableData, setTableData] = useState();
    const [tableUsers, setTableUsers] = useState();
    const [selectName, setSelectName] = useState();
    const [selectSupplier, setSelectSupplier] = useState();
    const [displayData, setDisplayData] = useState(false);
    const nameSelected = useRef('usuario');
    const supplierSelected = useRef('servicio');
    let allSuppliers = [
        {
            value: 'servicio',
            label: 'servicio',
        },
        {
            value: 'fedexEconomico',
            label: 'fedexEconomico',
        },
        {
            value: 'fedexDiaSiguiente',
            label: 'fedexDiaSiguiente',
        },
        {
            value: 'autoencargosEconomico',
            label: 'autoencargosEconomico',
        },
        {
            value: 'autoencargosExpress',
            label: 'autoencargosExpress',
        },
    ];

    useEffect(() => {
        let dataGuias = [];
        let dataUsers = [];
        let dataSingleUser = [];
        db.collection('guia')
            .where('status', '==', 'completed')
            .orderBy('creation_date', 'desc')
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    console.log(
                        'todas las guias',
                        doc.data(),
                        doc.data().supplierData.Supplier,
                        'doc.id',
                        doc.id,
                    );
                    dataGuias.push({
                        id: doc.id,
                        sentDate: doc.data().creation_date.toDate(),
                        ...doc.data(),
                    });
                    dataUsers.push(doc.data().name);
                });
                dataSingleUser = dataUsers.filter(
                    (item, index) => dataUsers.indexOf(item) === index,
                );
                //console.log(dataSingleUser);
                setHistory(dataGuias);
                setUsersName(dataSingleUser);
                setDisplayData(true);
                console.log('data', dataGuias, 'users', dataSingleUser);
            })
            .catch(function(error) {
                console.log('Error getting documents: ', error);
            });
    }, []);

    useEffect(() => {
        // console.log('name filtered', nameSelected.current);
        setTableData(
            history.map(historyRecord => {
                return {
                    id: historyRecord.id,
                    date: new Date(historyRecord.sentDate).toLocaleDateString(),
                    name: historyRecord.name,
                    guide: historyRecord.rastreo,
                    nameorigin: `${historyRecord.sender_addresses.name} , ${historyRecord.sender_addresses.phone}`,
                    origin: `${historyRecord.sender_addresses.street_number} , ${historyRecord.sender_addresses.neighborhood} , ${historyRecord.sender_addresses.country} , ${historyRecord.sender_addresses.codigo_postal}`,
                    Destination: `${historyRecord.receiver_addresses.street_number} , ${historyRecord.receiver_addresses.neighborhood} , ${historyRecord.receiver_addresses.country} , ${historyRecord.receiver_addresses.codigo_postal}`,
                    namedestination: `${historyRecord.receiver_addresses.name} , ${historyRecord.receiver_addresses.phone}`,
                    service: historyRecord.supplierData.Supplier,
                    weight: historyRecord.package.weight,
                    measurement: `${historyRecord.package.height} x ${historyRecord.package.width} x ${historyRecord.package.depth}`,
                    cost: historyRecord.supplierData.Supplier_cost,
                    label:
                        historyRecord.supplierData.Supplier === 'autoencargosExpress' ||
                        historyRecord.supplierData.Supplier === 'autoencargosEconomico'
                            ? 'no disponible'
                            : historyRecord.label,
                };
            }),
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
                    console.log('guias del cliente ' + name + ':', doc.data());
                    dataGuiasEachUser.push({
                        id: doc.id,
                        sentDate: doc.data().creation_date.toDate(),
                        ...doc.data(),
                    });
                });
                setHistory(dataGuiasEachUser);
                setDisplayData(true);
                nameSelected.current = name;
                setSelectName(name);
                if (supplierSelected.current != 'servicio') {
                    setSelectSupplier('');
                }
                console.log('dataGuiasEachUser', dataGuiasEachUser);
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
                    console.log('guias del cliente ' + supplier + ':', doc.data());
                    dataGuiasBySupplier.push({
                        id: doc.id,
                        sentDate: doc.data().creation_date.toDate(),
                        ...doc.data(),
                    });
                });
                setHistory(dataGuiasBySupplier);
                setDisplayData(true);
                supplierSelected.current = supplier;
                setSelectSupplier(supplier);
                if (nameSelected.current != 'usuario') {
                    setSelectName('');
                }
                console.log('dataGuiasBySupplier', dataGuiasBySupplier);
            });
    };

    return (
        <StyledAusers>
            <div className="back">
                <Row className="content-header">
                    <h1 id="header-margin">Historial de envíos</h1>
                    <Select
                        //label="Filtrar por usuario"
                        options={tableUsers}
                        id="example-select-1"
                        style={{ maxWidth: 700 }}
                        value={selectName}
                        onChange={ev => searchByName(ev.target.value)}
                        className="rainbow-m-vertical_x-large rainbow-p-horizontal_medium rainbow-m_auto"
                    />

                    <Select
                        //label="Filtrar por usuario"
                        options={allSuppliers}
                        id="example-select-2"
                        style={{ maxWidth: 700 }}
                        value={selectSupplier}
                        onChange={ev => searchBySupplier(ev.target.value)}
                        className="rainbow-m-vertical_x-large rainbow-p-horizontal_medium rainbow-m_auto"
                    />
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
                            <Column header="Name " field="name" />
                            <Column header="Guía" field="guide" defaultWidth={85} />
                            <Column header="Nombre Origen" field="nameorigin" />
                            <Column
                                header="Origen"
                                component={Destinations}
                                field="origin"
                                style={{ lineHeight: 25 }}
                                defaultWidth={125}
                            />
                            <Column header="Nombre Destino" field="namedestination" />
                            {/* <Column
                                header="Nombre Destino"
                                component={Destinations}
                                field="namedestination"
                                style={{ lineHeight: 25 }}
                                defaultWidth={105}
                            /> */}
                            <Column
                                header="Destino"
                                component={Destinations}
                                field="Destination"
                                style={{ lineHeight: 25 }}
                                defaultWidth={125}
                            />
                            <Column header="Servicio" field="service" defaultWidth={105} />
                            <Column header="Peso" field="weight" defaultWidth={50} />
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
