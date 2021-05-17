import React, { useEffect, useState, useRef } from 'react';
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
    const tokenProd = process.env.REACT_APP_REDPACK_PROD;

    const [filter, setFilter] = useState('');
    const [tableData, setTableData] = useState();
    const [recordsData, setRecordsData] = useState([]);
    const idGuiaGlobal = useRef(null);

    useEffect(() => {
        console.log(user.uid);
        const reloadOrdenes = () => {
            db.collection('guia')
                .where('ID', '==', user.uid)
                .where('status', '==', 'orden')
                .orderBy('creation_date', 'desc')
                .onSnapshot(handleOrdenes);
        };
        reloadOrdenes();
    }, []);

    const handleOrdenes = querySnapshot => {
        const data = [];
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
    };

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
                    console.log('datos dentro del map', historyRecord);
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
                                onClick={() => createShipping(historyRecord.id)}
                            />
                        ),
                    };
                }),
        );
    }, [recordsData]);

    const createShipping = idDoc => {
        idGuiaGlobal.current = idDoc;
        console.log('id', idGuiaGlobal.current);
        let myHeaders = new Headers();
        myHeaders.append('Authorization', tokenProd);
        myHeaders.append('Content-Type', 'application/json');
        db.collection('guia')
            .doc(idDoc)
            .get()
            .then(function(doc) {
                if (doc.exists) {
                    console.log('Document data:', doc.data());
                    let data = JSON.stringify({
                        sender: {
                            contact_name:
                                doc.data().supplierData.Supplier === 'estafetaEconomico' ||
                                doc.data().supplierData.Supplier === 'estafetaDiaSiguiente'
                                    ? doc.data().sender_addresses.name.substring(0, 30)
                                    : doc.data().sender_addresses.name,
                            company_name: doc.data().sender_addresses.name,
                            street:
                                doc.data().supplierData.Supplier === 'estafetaEconomico' ||
                                doc.data().supplierData.Supplier === 'estafetaDiaSiguiente'
                                    ? doc.data().sender_addresses.street_name.substring(0, 19)
                                    : doc.data().sender_addresses.street_name,
                            zip_code: doc.data().sender_addresses.codigo_postal,
                            neighborhood: doc.data().sender_addresses.neighborhood,
                            city: doc.data().sender_addresses.country,
                            country: 'MX',
                            state: doc.data().sender_addresses.state,
                            street_number: doc.data().sender_addresses.street_number,
                            place_reference: doc.data().sender_addresses.place_reference,
                            phone: doc.data().sender_addresses.phone,
                        },
                        receiver: {
                            contact_name:
                                doc.data().supplierData.Supplier === 'estafetaEconomico' ||
                                doc.data().supplierData.Supplier === 'estafetaDiaSiguiente'
                                    ? doc.data().receiver_addresses.name.substring(0, 30)
                                    : doc.data().receiver_addresses.name,
                            company_name: doc.data().receiver_addresses.name,
                            street:
                                doc.data().supplierData.Supplier === 'estafetaEconomico' ||
                                doc.data().supplierData.Supplier === 'estafetaDiaSiguiente'
                                    ? doc.data().receiver_addresses.street_name.substring(0, 19)
                                    : doc.data().receiver_addresses.street_name,
                            zip_code: doc.data().receiver_addresses.codigo_postal,
                            neighborhood: doc.data().receiver_addresses.neighborhood,
                            city: doc.data().receiver_addresses.country,
                            country: 'MX',
                            state: doc.data().receiver_addresses.state,
                            street_number: doc.data().receiver_addresses.street_number
                                ? doc.data().receiver_addresses.street_number
                                : '',
                            place_reference: doc.data().receiver_addresses.place_reference,
                            phone: doc.data().receiver_addresses.phone,
                        },
                        packages: [
                            {
                                name: doc.data().package.name.substring(0, 25),
                                height: doc.data().package.height,
                                width: doc.data().package.width,
                                depth: doc.data().package.depth,
                                weight: doc.data().package.weight,
                                content_description: doc.data().package.content_description,
                                quantity: doc.data().package.quantity,
                            },
                        ],
                        shipping_company: doc.data().supplierData.cargos.shippingInfo[0],
                        shipping_service: {
                            name: doc.data().supplierData.cargos.shippingInfo[1],
                            description: doc.data().supplierData.cargos.shippingInfo[2],
                            id: doc.data().supplierData.cargos.shippingInfo[3],
                        },
                        shipping_secure:
                            //false,
                            doc.data().supplierData.cargos.insurance === 0 ? false : true,
                        shipping_secure_data: {
                            notes:
                                // '-',
                                doc.data().package.content_description,
                            amount:
                                // 0,
                                doc.data().supplierData.cargos.insurance,
                        },
                    });
                    //console.log('data 2', data);
                    let requestOptions = {
                        method: 'POST',
                        headers: myHeaders,
                        body: data,
                        redirect: 'follow',
                    };
                    fetch('https://autopaquete.simplestcode.com/api/do-shipping/', requestOptions)
                        .then(response => response.json())
                        .then(result => {
                            console.log(result);
                            let finalResult = result;
                            let responseFetch = Object.keys(result);
                            console.log(responseFetch);
                            if (responseFetch.length === 0) {
                                // setEmptyResult(true);
                                db.collection('guia')
                                    .doc(idGuiaGlobal.current)
                                    .update({ result: responseFetch, body: data });
                            } else if (result.pdf_b64.length === 0 || result.pdf_b64 == '') {
                                // setEmptyResult(true);
                                db.collection('guia')
                                    .doc(idGuiaGlobal.current)
                                    .update({ result: result, body: data });
                            } else {
                                db.collection('guia')
                                    .doc(idGuiaGlobal.current)
                                    .update({
                                        label: result.pdf_b64[0],
                                        rastreo: result.id_shipping,
                                        body: data,
                                        result: finalResult,
                                        status: 'completed',
                                    });
                                // newBalance(costGuia);
                                // setguiaReady(true);
                            }
                        })
                        .catch(error => {
                            console.log('error', error);
                            // setEmptyResult(true);
                        });
                }
            })
            .catch(function(error) {
                console.error('Error getting document:', error);
            });
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
