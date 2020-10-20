import React, { useState, useEffect } from 'react';
import { Column, Badge, TableWithBrowserPagination, MenuItem } from 'react-rainbow-components';
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
    color: #1de9b6;
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

export default function AllGuides({}) {
    const firebase = useFirebaseApp();
    const db = firebase.firestore();
    const [history, setHistory] = useState([]);
    const [tableData, setTableData] = useState();

    useEffect(() => {
        let dataGuias = [];
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
                });
                setHistory(dataGuias);
                console.log('data', dataGuias);
            })
            .catch(function(error) {
                console.log('Error getting documents: ', error);
            });
    }, []);

    useEffect(() => {
        setTableData(
            history.map(historyRecord => {
                console.log('datos dentro del map', historyRecord.guide);
                return {
                    id: historyRecord.id,
                    date: new Date(historyRecord.sentDate).toLocaleDateString(),
                    name: historyRecord.name,
                    guide: historyRecord.rastreo,
                    origin: `${historyRecord.sender_addresses.street_number} , ${historyRecord.sender_addresses.neighborhood} , ${historyRecord.sender_addresses.country} , ${historyRecord.sender_addresses.codigo_postal}`,
                    Destination: `${historyRecord.receiver_addresses.street_number} , ${historyRecord.receiver_addresses.neighborhood} , ${historyRecord.receiver_addresses.country} , ${historyRecord.receiver_addresses.codigo_postal}`,
                    weight: historyRecord.package.weight,
                    service: historyRecord.supplierData.Supplier,
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
                        <Column header="Name " field="name" defaultWidth={105} />
                        {/* <Column
                            header="Status"
                            field="status"
                            component={StatusBadge}
                            defaultWidth={140}
                        /> */}
                        <Column header="Guía" field="guide" defaultWidth={85} />
                        <Column header="Origen" field="origin" />
                        <Column header="Destino" field="Destination" />
                        <Column header="Peso" field="weight" defaultWidth={65} />
                        <Column header="Servicio" field="service" defaultWidth={135} />
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
