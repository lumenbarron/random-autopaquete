import React, { useState, useEffect } from 'react';
import { Column, Badge, TableWithBrowserPagination, Button } from 'react-rainbow-components';
import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useFirebaseApp } from 'reactfire';
import { StyledPanel, StyleHeader } from './styled';
import ExportReactCSV from '../../dowloadData/index';

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
                        //console.log(doc.data(), doc.id);
                        //                         if ( typeof doc.data().label == 'undefined' ) {
                        // console.log(doc.id, doc.data())
                        // }
                        // db.collection('sender_addresses')
                        // .doc(doc.id)
                        // .update({ID : 'XMIlDAVlEnPZ55iTbuhXQrTUrFs1'})
                        dataGuias.push({
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
                    setHistory(dataGuias);
                    //console.log('guias', dataGuias);
                })
                .catch(function(error) {
                    console.log('Error getting documents: ', error);
                });
        }
    }, []);

    const deleteGuia = idDoc => {
        console.log('idDoc', idDoc);
        db.collection('guia')
            .doc(idDoc)
            .delete()
            .then(function() {
                console.log('Document successfully deleted', idDoc);
            })
            .catch(function(error) {
                console.error('Error removing document: ', error);
            });
    };

    useEffect(() => {
        setTableData(
            history.map(historyRecord => {
                //console.log('datos dentro del map', historyRecord.guide);
                return {
                    id: historyRecord.id,
                    date: historyRecord.package.creation_date,
                    // status: historyRecord.status,
                    guide: historyRecord.rastreo,
                    origin: `${historyRecord.sender_addresses.street_name} ,${historyRecord.sender_addresses.street_number} , ${historyRecord.sender_addresses.neighborhood} , ${historyRecord.sender_addresses.country} , ${historyRecord.sender_addresses.codigo_postal}`,
                    Destination: `${historyRecord.receiver_addresses.street_name} , ${historyRecord.receiver_addresses.street_number} , ${historyRecord.receiver_addresses.neighborhood} , ${historyRecord.receiver_addresses.country} , ${historyRecord.receiver_addresses.codigo_postal}`,
                    weight: historyRecord.package.weight,
                    volumetricWeight: historyRecord.volumetricWeight,
                    service: historyRecord.supplierData.Supplier,
                    cost:
                        typeof historyRecord.rastreo != 'undefined'
                            ? historyRecord.supplierData.Supplier_cost
                            : '0.00',
                    label:
                        historyRecord.supplierData.Supplier === 'autoencargosEconomico'
                            ? 'no disponible'
                            : historyRecord.label,
                    delete: (
                        <FontAwesomeIcon
                            icon={faTrashAlt}
                            onClick={() => deleteGuia(historyRecord.id)}
                        />
                    ),
                };
            }),
        );
    }, [history]);

    return (
        <>
            <StyleHeader>
                <Row className="row-header">
                    <h2>Historial de envíos</h2>
                    <ExportReactCSV data={history} />
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
                        {/* <Column
                            header="Status"
                            field="status"
                            component={StatusBadge}
                            defaultWidth={140}
                        /> */}
                        <Column header="Guía" field="guide" defaultWidth={85} />
                        <Column header="Origen" field="origin" />
                        <Column header="Destino" field="Destination" />
                        <Column header="PF" field="weight" defaultWidth={65} />
                        <Column header="PV" field="volumetricWeight" defaultWidth={65} />
                        <Column header="Servicio" field="service" defaultWidth={135} />

                        <Column header="Costo" field="cost" defaultWidth={75} />
                        <Column
                            header="Etiqueta"
                            component={DownloadLabel}
                            field="label"
                            style={{ width: '10px!important' }}
                            defaultWidth={100}
                        />
                        {/* <Column header="" field="delete" /> */}
                    </StyledTable>
                </StyledPanel>
            </div>
        </>
    );
}
