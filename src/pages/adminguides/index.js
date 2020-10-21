import React, { useState, useEffect } from 'react';
import { Column, Badge, TableWithBrowserPagination, Select } from 'react-rainbow-components';
import styled from 'styled-components';
import Row from 'react-bootstrap/Row';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { useFirebaseApp } from 'reactfire';
import { StyledUserEdit, StyledPanel } from '../adminuseredit/styled';
import { StyledAusers } from '../adminusers/styled';

const StyledBadge = styled(Badge)`
    color: #09d3ac;
`;

const StyledColumn = styled(Column)`
    color: red;
    white-space: initial;
`;

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

const containerStyles = {
    maxWidth: 700,
};

const StatusBadge = ({ value }) => <StyledBadge label={value} variant="lightest" />;

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

export default function AllGuides({}) {
    const firebase = useFirebaseApp();
    const db = firebase.firestore();
    const [history, setHistory] = useState([]);
    const [users, setUsers] = useState([]);
    const [tableData, setTableData] = useState();

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
                    console.log('todas las guias', doc.data(), 'doc.id', doc.id);
                    dataGuias.push({
                        id: doc.id,
                        sentDate: doc.data().creation_date.toDate(),
                        ...doc.data(),
                    });

                    dataUsers.push(doc.data().name);
                });
                console.log('dataUsers', dataUsers);
                let singleName = dataUsers =>
                    dataUsers.filter((item, index) => dataUsers.indexOf(item) === index);
                dataSingleUser = [...new Set(singleName(dataUsers))];
                console.log(dataSingleUser);
                setHistory(dataGuias);
                setUsers(dataSingleUser);
                console.log('data', dataGuias, 'users', dataSingleUser);
            })
            .catch(function(error) {
                console.log('Error getting documents: ', error);
            });
    }, []);

    useEffect(() => {
        setTableData(
            history.map(historyRecord => {
                return {
                    id: historyRecord.id,
                    date: new Date(historyRecord.sentDate).toLocaleDateString(),
                    name: historyRecord.name,
                    guide: historyRecord.rastreo,
                    origin: `${historyRecord.sender_addresses.street_number} , ${historyRecord.sender_addresses.neighborhood} , ${historyRecord.sender_addresses.country} , ${historyRecord.sender_addresses.codigo_postal}`,
                    Destination: `${historyRecord.receiver_addresses.street_number} , ${historyRecord.receiver_addresses.neighborhood} , ${historyRecord.receiver_addresses.country} , ${historyRecord.receiver_addresses.codigo_postal}`,
                    service: historyRecord.supplierData.Supplier,
                    weight: historyRecord.package.weight,
                    measurement: `${historyRecord.package.height} x ${historyRecord.package.width} x ${historyRecord.package.depth}`,
                    cost: historyRecord.supplierData.Supplier_cost,
                    label:
                        historyRecord.supplierData.Supplier === 'autoencargos'
                            ? 'no disponible'
                            : historyRecord.label,
                };
            }),
        );
    }, [history]);

    return (
        <StyledAusers>
            <div className="back">
                <Row className="content-header">
                    <h1 id="header-margin">Historial de envíos</h1>
                    <Select
                        label="Select Label"
                        options={users}
                        id="example-select-1"
                        style={containerStyles}
                        className="rainbow-m-vertical_x-large rainbow-p-horizontal_medium rainbow-m_auto"
                    />
                    ;
                </Row>
                <div className="rainbow-p-bottom_xx-large">
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
                        <Column
                            header="Origen"
                            component={Destinations}
                            field="guide"
                            style={{ lineHeight: 25 }}
                            defaultWidth={125}
                        />
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
                </div>
            </div>
        </StyledAusers>
    );
}
