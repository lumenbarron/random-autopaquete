import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Column, Badge, TableWithBrowserPagination, Input, Button } from 'react-rainbow-components';
import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faDownload } from '@fortawesome/free-solid-svg-icons';
import { useFirebaseApp, useUser } from 'reactfire';
import { useHistory } from 'react-router-dom';
import { StyledRecord, RecordContainer } from './styled';
import ExportReactCSV from '../dowloadData/index';

const StyledBadge = styled(Button)`
    border-color: transparent;
    background-color: #00652e;
    color: white;
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
const StatusBadge = () => <StyledBadge label="Crear" />;
StatusBadge.propTypes = {
    value: PropTypes.string.isRequired,
};

const containerStyles = { height: 312 };
const containerTableStyles = { height: 356 };

const optionsDate = { year: '2-digit', month: '2-digit', day: '2-digit' };

const OrdenesPage = () => {
    const firebase = useFirebaseApp();
    const db = firebase.firestore();
    const user = useUser();
    const history = useHistory();

    const [filter, setFilter] = useState('');
    const [tableData, setTableData] = useState();
    const [recordsData, setRecordsData] = useState([]);

    useEffect(() => {
        const data = [];
        db.collection('ordenes')
            .where('ID', '==', user.uid)
            .where('status', '==', 'completed')
            .orderBy('creation_date', 'desc')
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    data.push({
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
                setRecordsData(data);
            })
            .catch(function(error) {
                console.log('Error getting documents: ', error);
            });
    }, []);

    useEffect(() => {
        setTableData(
            recordsData
                .filter(historyRecord => {
                    if (filter === null) {
                        return historyRecord;
                    } else if (historyRecord.sender_addresses.name.includes(filter)) {
                        return historyRecord;
                    }
                })
                .map(historyRecord => {
                    // console.log('datos dentro del map', historyRecord);
                    return {
                        id: historyRecord.id,
                        /* name: historyRecord.name, */
                        date: historyRecord.sentDate,
                        nameOrigin: historyRecord.sender_addresses.name,
                        origin: `${historyRecord.sender_addresses.street_name}, ${historyRecord.sender_addresses.street_number} , ${historyRecord.sender_addresses.neighborhood} , ${historyRecord.sender_addresses.country} , ${historyRecord.sender_addresses.codigo_postal}`,
                        nameDestination: historyRecord.receiver_addresses.name,
                        destination: `${historyRecord.receiver_addresses.street_name}, ${historyRecord.receiver_addresses.street_number} , ${historyRecord.receiver_addresses.neighborhood} , ${historyRecord.receiver_addresses.country} , ${historyRecord.receiver_addresses.codigo_postal}`,
                        measurement: `${historyRecord.package.height} x ${historyRecord.package.width} x ${historyRecord.package.depth}`,
                        weight: historyRecord.package.weight,
                        service: historyRecord.supplierData.Supplier,
                        cost: historyRecord.supplierData.Supplier_cost,
                        crear: (
                            <StyledBadge
                                label="Crear"
                                // variant="success"
                                // className="create-button"
                                onClick={() => createShipping()}
                            />
                        ),
                    };
                }),
        );
    }, [recordsData]);

    const createShipping = () => {
        console.log('creando guia');
    };

    // const search = e => {
    //     let keyword = e.target.value;
    //     console.log('keyword', keyword);
    //     setFilter(keyword);
    // };

    // const pushSend = () => {
    //     history.push('/mi-cuenta/enviar');
    // };

    return (
        <StyledRecord>
            <Row className="row-header">
                <h1 id="main-title">Ordenes</h1>
                <ExportReactCSV data={recordsData} />
            </Row>
            <RecordContainer>
                {/*                 <div>
                    <Input
                        value={filter}
                        className="rainbow-p-around_medium"
                        placeholder="Buscar"
                        icon={<FontAwesomeIcon icon={faSearch} className="rainbow-color_gray-3" />}
                        onChange={e => search(e)}
                    />
                </div> */}

                <div className="rainbow-p-bottom_xx-large">
                    <div style={containerStyles}>
                        <StyledTable
                            data={tableData}
                            pageSize={10}
                            keyField="id"
                            style={containerTableStyles}
                            emptyTitle="Oh no!"
                            emptyDescription="No hay ningun registro actualmente..."
                            className="direction-table"
                        >
                            <Column header="Fecha " field="date" defaultWidth={105} />
                            <Column header="Nombre Origen" field="nameOrigin" />
                            <Column header="Origen" field="origin" />
                            <Column header="Nombre Destino" field="nameDestination" />
                            <Column header="Destino" field="destination" />
                            <Column header="Medidas" field="measurement" defaultWidth={100} />
                            <Column header="Peso" field="weight" defaultWidth={65} />
                            <Column header="Paquetería" field="service" />
                            <Column header="Costo" field="cost" defaultWidth={135} />
                            <Column
                                header=""
                                field="crear"
                                // component={StatusBadge}
                                defaultWidth={90}
                            />
                            {/* <Column header="" field="crear" defaultWidth={90}  /> */}
                        </StyledTable>
                    </div>
                </div>
                {/* </div>
                </div> */}
                {/*                 <div>
                    <button className="btn-new" onClick={pushSend}>
                        Enviar uno nuevo
                    </button>
                </div> */}
            </RecordContainer>
        </StyledRecord>
    );
};

export default OrdenesPage;
