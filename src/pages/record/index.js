import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Column, Badge, TableWithBrowserPagination, Input } from 'react-rainbow-components';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faDownload } from '@fortawesome/free-solid-svg-icons';
import { useFirebaseApp, useUser } from 'reactfire';
import { useHistory } from 'react-router-dom';
import { StyledRecord, RecordContainer } from './styled';

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
StatusBadge.propTypes = {
    value: PropTypes.string.isRequired,
};

const DownloadLabel = ({ value }) => (
    <a
        download="guia"
        href={`data:application/pdf;base64,${value}`}
        title="Descargar etiqueta"
        variant="neutral"
        className="rainbow-m-around_medium"
    >
        <FontAwesomeIcon icon={faDownload} className="rainbow-m-left_medium" />
    </a>
);
DownloadLabel.propTypes = {
    value: PropTypes.string.isRequired,
};

const containerStyles = { height: 312 };
const containerTableStyles = { height: 356 };

const RecordPage = () => {
    const firebase = useFirebaseApp();
    const db = firebase.firestore();
    const user = useUser();
    const history = useHistory();

    const [filter, setFilter] = useState(null);

    const [recordsData, setRecordsData] = useState([]);

    function handleRecods(snapshot) {
        const recordsMap = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data(),
            };
        });
        setRecordsData(recordsMap);
    }

    useEffect(() => {
        const reloadRecords = () => {
            db.collection('guia')
                .where('ID', '==', user.uid)
                .where('status', '==', 'completed')
                .onSnapshot(handleRecods);
        };
        reloadRecords();
    }, []);

    const data = recordsData
        .filter(historyRecord => {
            if (filter === null) {
                return historyRecord;
            } else if (
                historyRecord.sender_addresses.name.includes(filter) ||
                historyRecord.supplierData.Supplier_cost.includes(filter)
            ) {
                return historyRecord;
            }
        })
        .map(historyRecord => {
            return {
                date: historyRecord.sender_addresses.creation_date,
                guide: historyRecord.rastreo ? historyRecord.rastreo.join(' ') : 'N/D',
                origin: historyRecord.sender_addresses.name,
                Destination: historyRecord.receiver_addresses.name,
                weight: historyRecord.package.weight,
                service: historyRecord.supplierData.Supplier,
                status: 'Finalizado',
                cost: historyRecord.supplierData.Supplier_cost,
                label: historyRecord.label,
            };
        });

    const search = e => {
        let keyword = e.target.value;
        setFilter(keyword);
    };

    const pushSend = () => {
        history.push('/mi-cuenta/enviar');
    };

    return (
        <StyledRecord>
            <RecordContainer>
                <div>
                    <div>
                        <h1>Mis envíos</h1>

                        <div>
                            <Input
                                value={filter}
                                className="rainbow-p-around_medium"
                                placeholder="Buscar"
                                icon={
                                    <FontAwesomeIcon
                                        icon={faSearch}
                                        className="rainbow-color_gray-3"
                                    />
                                }
                                onChange={e => search(e)}
                            />
                        </div>

                        <div className="rainbow-p-bottom_xx-large">
                            <div style={containerStyles}>
                                <StyledTable
                                    data={data}
                                    pageSize={10}
                                    keyField="id"
                                    style={containerTableStyles}
                                    emptyTitle="Oh no!"
                                    emptyDescription="No hay ningun registro actualmente..."
                                    sortedBy="date"
                                    sortDirection="desc"
                                >
                                    <Column header="Fecha " field="date" />
                                    <Column header="Guía" field="guide" />
                                    <Column header="Origen" field="origin" />
                                    <Column header="Destino" field="Destination" />
                                    <Column header="Peso" field="weight" />
                                    <Column header="Servicio" field="service" />
                                    <Column
                                        header="Status"
                                        field="status"
                                        component={StatusBadge}
                                    />
                                    <Column header="Costo" field="cost" />
                                    <Column
                                        header="Etiqueta"
                                        component={DownloadLabel}
                                        field="label"
                                    />
                                </StyledTable>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <button className="btn-new" onClick={pushSend}>
                        Enviar uno nuevo
                    </button>
                </div>
            </RecordContainer>
        </StyledRecord>
    );
};

export default RecordPage;
