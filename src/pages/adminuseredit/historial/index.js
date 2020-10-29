import React, { useState, useEffect } from 'react';
import { Column, Badge, TableWithBrowserPagination, Button } from 'react-rainbow-components';
import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { useFirebaseApp } from 'reactfire';
import { StyledPanel, StyleHeader } from './styled';
import { CSVLink } from 'react-csv';

const StyledBadge = styled(Badge)`
    color: #09d3ac;
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

export default function HistoryUser({ user }) {
    const firebase = useFirebaseApp();
    const db = firebase.firestore();
    const [history, setHistory] = useState([]);
    const [tableData, setTableData] = useState();
    const headers = [
        { label: 'ID', key: 'id' },
        { label: 'Nombre', key: 'name' },
        { label: 'Fecha', key: 'package.creation_date' },
        { label: 'Guia', key: 'rastreo' },
        { label: 'Nombre Origen', key: 'sender_addresses.name' },
        { label: 'Telefono Origen', key: 'sender_addresses.phone' },
        { label: 'Calle Origen', key: 'sender_addresses.street_number' },
        { label: 'Colonia Origen', key: 'sender_addresses.neighborhood' },
        { label: 'Código Postal Origen', key: 'sender_addresses.codigo_postal' },
        { label: 'Referencias Origen', key: 'sender_addresses.place_reference' },
        { label: 'Nombre Destino', key: 'receiver_addresses.name' },
        { label: 'Telefono Destino', key: 'receiver_addresses.phone' },
        { label: 'Calle Destino', key: 'receiver_addresses.street_number' },
        { label: 'Colonia Destino', key: 'receiver_addresses.neighborhood' },
        { label: 'Código Postal Destino', key: 'receiver_addresses.codigo_postal' },
        { label: 'Referencias Destino', key: 'receiver_addresses.place_reference' },
        { label: 'Paquete', key: 'package.content_description' },
        { label: 'Paquete Peso', key: 'package.weight' },
        { label: 'Paquete Largo', key: 'package.height' },
        { label: 'Paquete Ancho', key: 'package.width' },
        { label: 'Paquete Alto', key: 'package.depth' },
        { label: 'Servicios', key: 'supplierData.Supplier' },
        { label: 'Costo', key: 'supplierData.Supplier_cost' },
    ];

    useEffect(() => {
        if (user) {
            let dataGuias = [];
            db.collection('guia')
                .where('ID', '==', user.ID)
                .where('status', '==', 'completed')
                .orderBy('creation_date', 'desc')
                .get()
                .then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        //console.log('doc.id', doc.data().creation_date);
                        dataGuias.push({
                            id: doc.id,
                            //sentDate: doc.data().creation_date.toDate(),
                            ...doc.data(),
                        });
                    });
                    setHistory(dataGuias);
                    console.log('data', dataGuias);
                })
                .catch(function(error) {
                    console.log('Error getting documents: ', error);
                });
        }
    }, []);

    useEffect(() => {
        setTableData(
            history.map(historyRecord => {
                //console.log('datos dentro del map', historyRecord.guide);
                return {
                    id: historyRecord.id,
                    date: historyRecord.package.creation_date,
                    status: historyRecord.status,
                    guide: historyRecord.rastreo,
                    origin: historyRecord.sender_addresses.name,
                    Destination: historyRecord.receiver_addresses.name,
                    weight: historyRecord.package.weight,
                    service: historyRecord.supplierData.Supplier,
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

    return (
        <>
            <StyleHeader>
                <Row className="row-header">
                    <h2>Historial de envíos</h2>
                    <Button variant="destructive" className="rainbow-m-around_medium">
                        <CSVLink
                            data={history}
                            headers={headers}
                            filename={'historial-de-envios.csv'}
                            target="_blank"
                        >
                            Descargar archivo
                        </CSVLink>
                    </Button>
                </Row>
            </StyleHeader>
            <div className="rainbow-p-bottom_large rainbow-p-top_large">
                <StyledPanel>
                    <StyledTable
                        data={tableData}
                        pageSize={10}
                        keyField="id"
                        emptyTitle="Oh no!"
                        emptyDescription="No hay ningun registro actualmente..."
                        className="direction-table"
                    >
                        <Column header="Fecha " field="date" defaultWidth={105} />
                        <Column
                            header="Status"
                            field="status"
                            component={StatusBadge}
                            defaultWidth={140}
                        />
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
                </StyledPanel>
            </div>
        </>
    );
}
