import React, { useEffect, useState, useRef } from 'react';
import PropTypes, { func } from 'prop-types';
import {
    Column,
    Badge,
    TableWithBrowserPagination,
    Button,
    Spinner,
    Modal,
} from 'react-rainbow-components';
import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faDownload } from '@fortawesome/free-solid-svg-icons';
import { useFirebaseApp, useUser } from 'reactfire';
import { useHistory } from 'react-router-dom';
import { StyledRecord, RecordContainer } from './styled';
import ExportReactCSV from '../dowloadData/index';
import swal from 'sweetalert2';

const StyledBadge = styled(Button)`
    border-color: transparent;
    background-color: #00652e;
    color: white;
`;
const StyledBadgeBlue = styled(Button)`
    border-color: transparent;
    background-color: #00183d;
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
    const creationDate = new Date();

    const [filter, setFilter] = useState('');
    const [tableData, setTableData] = useState();
    const [recordsData, setRecordsData] = useState([]);
    const [guiaReady, setguiaReady] = useState(false);
    const idGuiaGlobal = useRef(null);
    const userSaldo = useRef();

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
                                onClick={() => createShipping(historyRecord.id)}
                            />
                        ),
                        repetir: (
                            <StyledBadgeBlue
                                label="Repetir"
                                onClick={() => replayGuia(historyRecord.id)}
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

        //Get saldo's user
        db.collection('profiles')
            .where('ID', '==', user.uid)
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    userSaldo.current = parseFloat(doc.data().saldo);
                });
            })
            .catch(function(error) {
                console.log('Error getting documents: ', error);
            });

        db.collection('guia')
            .doc(idDoc)
            .get()
            .then(function(doc) {
                if (doc.exists) {
                    console.log('Document data:', doc.data());
                    let costGuia = doc.data().supplierData.Supplier_cost;
                    //console.log('costGuia', costGuia, 'saldo', userSaldo.current)
                    if (parseFloat(costGuia) > userSaldo.current) {
                        swal.fire({
                            title: '!Lo siento!',
                            text: 'No tienes saldo suficiente',
                            icon: 'error',
                            confirmButtonText: 'Ok',
                        });
                    } else {
                        if (
                            doc.data().supplierData.Supplier === 'fedexDiaSiguiente' ||
                            doc.data().supplierData.Supplier === 'fedexEconomico'
                        ) {
                            db.collection('guia')
                                .doc(idDoc)
                                .update({ status: 'completed' })
                                .then(function() {
                                    console.log('peticion a la api fed');
                                    user.getIdToken().then(idToken => {
                                        const xhr = new XMLHttpRequest();
                                        xhr.responseType = 'json';
                                        xhr.contentType = 'application/json';
                                        xhr.open('POST', '/guia/fedex');
                                        // xhr.open(
                                        //     'POST',
                                        //     'https://cors-anywhere.herokuapp.com/https://us-central1-autopaquete-92c1b.cloudfunctions.net/fedex-create',
                                        // );
                                        xhr.setRequestHeader('Authorization', `Bearer ${idToken}`);
                                        xhr.send(JSON.stringify({ guiaId: idDoc }));
                                        swal.fire({
                                            title: '¡Excelente!',
                                            text: 'Tu guía ha sido creada',
                                            icon: 'success',
                                            confirmButtonText: 'Ok',
                                        });
                                    });
                                })
                                .catch(function(error) {
                                    console.error('Error adding document: ', error);
                                });
                        } else {
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
                                            ? doc
                                                  .data()
                                                  .sender_addresses.street_name.substring(0, 19)
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
                                            ? doc
                                                  .data()
                                                  .receiver_addresses.street_name.substring(0, 19)
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
                            setguiaReady(true);
                            fetch(
                                'https://autopaquete.simplestcode.com/api/do-shipping/',
                                requestOptions,
                            )
                                .then(response => response.json())
                                .then(result => {
                                    console.log(result);
                                    let finalResult = result;
                                    let responseFetch = Object.keys(result);
                                    console.log(responseFetch);
                                    if (responseFetch.length === 0) {
                                        console.log('result', finalResult);
                                        swal.fire({
                                            title: '!Lo siento!',
                                            text:
                                                'Ha ocurrido un error, ¿podrías intentarlo de nuevo?',
                                            icon: 'error',
                                            confirmButtonText: 'Ok',
                                        });
                                    } else if (finalResult.error) {
                                        console.log(finalResult.error);
                                        swal.fire({
                                            title: '!Lo siento!',
                                            text:
                                                'Ha ocurrido un error, ¿podrías intentarlo de nuevo?',
                                            icon: 'error',
                                            confirmButtonText: 'Ok',
                                        });
                                    } else if (
                                        result.pdf_b64.length === 0 ||
                                        result.pdf_b64 == ''
                                    ) {
                                        console.log('result', finalResult);
                                        swal.fire({
                                            title: '!Lo siento!',
                                            text:
                                                'Ha ocurrido un error, ¿podrías intentarlo de nuevo?',
                                            icon: 'error',
                                            confirmButtonText: 'Ok',
                                        });
                                    } else {
                                        db.collection('guia')
                                            .doc(idGuiaGlobal.current)
                                            .update({
                                                label: result.pdf_b64[0],
                                                rastreo: result.id_shipping,
                                                body: data,
                                                result: finalResult,
                                                creation_date: creationDate,
                                                status: 'completed',
                                            });
                                        swal.fire({
                                            title: '¡Excelente!',
                                            text: 'Tu guía ha sido creada',
                                            icon: 'success',
                                            confirmButtonText: 'Ok',
                                        });
                                        newBalance(costGuia);
                                        setguiaReady(false);
                                    }
                                })
                                .catch(error => {
                                    console.log('error', error);
                                });
                        }
                    }
                }
            })
            .catch(function(error) {
                console.error('Error getting document:', error);
            });
    };

    const newBalance = cost => {
        console.log('cost', cost);
        db.collection('profiles')
            .where('ID', '==', user.uid)
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    let newBalance = parseFloat(doc.data().saldo) - cost;
                    newBalance = Math.round((newBalance + Number.EPSILON) * 100) / 100;
                    if (newBalance < 0) {
                        return false;
                    }
                    console.log('newBalance', newBalance);
                    db.collection('profiles')
                        .doc(doc.id)
                        .update({ saldo: newBalance })
                        .then(() => {
                            console.log('get it');
                        });
                });
            })
            .catch(function(error) {
                console.log('Error getting documents: ', error);
            });
    };

    async function replayGuia(id) {
        const ogGuia = await db
            .collection('guia')
            .doc(id)
            .get();
        const {
            ID,
            receiver_addresses: rAddress,
            sender_addresses: sAddress,
            status,
            supplierData,
            razon_social,
            name,
            creation_date,
        } = ogGuia.data();
        console.log('guia a duplicar', ogGuia.data());
        const newGuia = await db
            .collection('guia')
            .add({
                ID,
                receiver_addresses: rAddress,
                sender_addresses: sAddress,
                status,
                supplierData,
                razon_social,
                name,
                creation_date: creationDate,
                package: ogGuia.data().package,
            })
            .then(function(docRef) {
                console.log('Document written with ID (destino): ', docRef.id);
            })
            .catch(function(error) {
                console.error('Error adding document: ', error);
            });
    }

    const modalClose = () => {
        setguiaReady(false);
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
                {/* <ExportReactCSV data={recordsData} /> */}
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
                            <Column header="Costo" field="cost" defaultWidth={105} />
                            <Column
                                header=""
                                field="crear"
                                // component={StatusBadge}
                                defaultWidth={90}
                            />
                            <Column
                                header=""
                                field="repetir"
                                // component={StatusBadge}
                                defaultWidth={110}
                            />
                        </StyledTable>
                    </div>
                </div>
                <Modal
                    id="modal-1"
                    isOpen={guiaReady}
                    style={{ height: '200px' }}
                    // onRequestClose={modalClose}
                    hideCloseButton="false"
                    title="Generando guía"
                >
                    <Spinner size="large" variant="brand" style={{ marginTop: '3rem' }} />
                </Modal>
            </RecordContainer>
        </StyledRecord>
    );
};

export default OrdenesPage;
