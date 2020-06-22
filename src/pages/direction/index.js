import React, { useEffect, useState } from 'react';
import {
    Accordion,
    AccordionSection,
    Column,
    TableWithBrowserPagination,
    Input,
    Button,
} from 'react-rainbow-components';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useFirebaseApp, useUser } from 'reactfire';
import { StyledDirection, DirectionContainer } from './styled';
import OrigenComponent from '../../pages/send/origen';

const containerStyles = { height: 312 };
const containerTableStyles = { height: 356 };

export default function DirectionPage() {
    const firebase = useFirebaseApp();
    const db = firebase.firestore();
    const user = useUser();

    const [name, setName] = useState('');
    const [CP, setCP] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [country, setCountry] = useState('');
    const [streetNumber, setStreetNumber] = useState('');
    const [placeRef, setPlaceRef] = useState('');
    const [phone, setPhone] = useState('');

    const [senderAddresses, setSenderAddresses] = useState([]);
    const [receiverAddresses, setReceiverAddresses] = useState([]);

    const creationDate = new Date();

    useEffect(() => {
        const reloadRecords = () => {
            db.collection('sender_addresses')
                .where('ID', '==', user.uid)
                .onSnapshot(handleSenderAddresses);
            db.collection('receiver_addresses')
                .where('ID', '==', user.uid)
                .onSnapshot(handleReceiverAddresses);
        };
        reloadRecords();
    }, []);

    function handleSenderAddresses(snapshot) {
        const data = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data(),
            };
        });
        setSenderAddresses(data);
    }

    function handleReceiverAddresses(snapshot) {
        const data = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data(),
            };
        });
        setReceiverAddresses(data);
    }

    function mapAddresses(address, idx) {
        return {
            date: address.creation_date,
            name: address.name,
            codigo_postal: address.codigo_postal,
            country: address.country,
            neighborhood: address.neighborhood,
            street_number: address.street_number,
            phone: address.phone,
        };
    }

    const data = senderAddresses.map(mapAddresses).concat(receiverAddresses.map(mapAddresses));

    const registerDirecction = () => {
        if (
            name.trim() === '' ||
            CP.trim() === '' ||
            neighborhood.trim() === '' ||
            country.trim() === '' ||
            streetNumber.trim() === '' ||
            placeRef.trim() === '' ||
            phone.trim() === ''
        ) {
            console.log('Espacios vacios');
            return;
        }
        const duplicateStreet = data.map((searchStree, idx) => {
            return searchStree.street_number;
        });
        if (duplicateStreet.includes(streetNumber)) {
            console.log('Necesitas poner una calle diferente');
            return;
        }

        const directionsCollectionAdd = db.collection('sender_addresses').add({
            name,
            codigo_postal: CP,
            neighborhood,
            country,
            street_number: streetNumber,
            place_reference: placeRef,
            phone,
            ID: user.uid,
            creation_date: creationDate.toLocaleDateString(),
        });

        directionsCollectionAdd
            .then(function(docRef) {
                console.log('Document written with ID (origen): ', docRef.id);
            })
            .catch(function(error) {
                console.error('Error adding document: ', error);
            });

        const directionsGuiasCollectionAdd = db.collection('guia').add({
            ID: user.uid,
            creation_date: creationDate.toLocaleDateString(),
            sender_addresses: {
                name,
                codigo_postal: CP,
                neighborhood,
                country,
                street_number: streetNumber,
                place_reference: placeRef,
                phone,
                ID: user.uid,
                creation_date: creationDate.toLocaleDateString(),
            },
        });

        const searchDuplicate = db.collection('sender_addresses').get();

        directionsGuiasCollectionAdd
            .then(function(docRef) {
                console.log('Document written with ID (Guía): ', docRef.id);
            })
            .catch(function(error) {
                console.error('Error adding document: ', error);
            });
    };

    return (
        <StyledDirection>
            <DirectionContainer>
                <div>
                    <div>
                        <h1>Mis direcciones</h1>

                        <div>
                            <Input
                                className="rainbow-p-around_medium"
                                placeholder="Buscar"
                                icon={
                                    <FontAwesomeIcon
                                        icon={faSearch}
                                        className="rainbow-color_gray-3"
                                    />
                                }
                            />
                        </div>

                        <div className="rainbow-p-bottom_xx-large">
                            <div style={containerStyles}>
                                <TableWithBrowserPagination
                                    data={data}
                                    pageSize={10}
                                    keyField="id"
                                    style={containerTableStyles}
                                >
                                    <Column header="Fecha " field="date" />
                                    <Column header="Nombre" field="name" />
                                    <Column header="Cod. Postal" field="codigo_postal" />
                                    <Column header="Ciudad" field="country" />
                                    <Column header="Colonia" field="neighborhood" />
                                    <Column header="Direccion" field="street_number" />
                                    <Column header="Telefono" field="phone" />
                                </TableWithBrowserPagination>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <Accordion id="accordion-1">
                        <AccordionSection label="Agregar Dirección">
                            <div
                                className="rainbow-align_end rainbow-flex"
                                style={{ flexWrap: 'wrap-reverse' }}
                            >
                                <div style={{ flex: '1 1', minWidth: '400px' }}>
                                    <h2>Datos de quien envía</h2>
                                    <Input
                                        id="nombre"
                                        label="Nombre"
                                        name="nombre"
                                        value={name}
                                        className="rainbow-p-around_medium"
                                        style={{ width: '100%' }}
                                        onChange={e => setName(e.target.value)}
                                    />
                                    <Input
                                        id="telefono"
                                        label="Telefono"
                                        name="telefono"
                                        value={phone}
                                        className="rainbow-p-around_medium"
                                        style={{ width: '100%' }}
                                        onChange={e => setPhone(e.target.value)}
                                    />
                                    <Button className="btn-new" onClick={registerDirecction}>
                                        Guardar
                                    </Button>
                                </div>
                                <div style={{ flex: '1 1' }}>
                                    <h2>Dirección</h2>
                                    <div className="rainbow-align-content_center rainbow-flex_wrap">
                                        <Input
                                            id="ciudad"
                                            label="Ciudad y Estado"
                                            name="ciudad"
                                            value={country}
                                            className="rainbow-p-around_medium"
                                            style={{ width: '70%' }}
                                            onChange={e => setCountry(e.target.value)}
                                        />
                                        <Input
                                            id="cp"
                                            label="C.P."
                                            name="cp"
                                            value={CP}
                                            className="rainbow-p-around_medium"
                                            style={{ width: '30%' }}
                                            onChange={e => setCP(e.target.value)}
                                        />
                                    </div>
                                    <Input
                                        id="colonia"
                                        label="Colonia"
                                        name="colonia"
                                        value={neighborhood}
                                        className="rainbow-p-around_medium"
                                        onChange={e => setNeighborhood(e.target.value)}
                                    />
                                    <Input
                                        id="domicilio"
                                        label="Calle y Número"
                                        name="domicilio"
                                        value={streetNumber}
                                        className="rainbow-p-around_medium"
                                        style={{ flex: '1 1' }}
                                        onChange={e => setStreetNumber(e.target.value)}
                                    />
                                    <Input
                                        id="referencia"
                                        label="Referencias del Lugar"
                                        name="referencia"
                                        value={placeRef}
                                        className="rainbow-p-around_medium"
                                        style={{ flex: '1 1' }}
                                        onChange={e => setPlaceRef(e.target.value)}
                                    />
                                </div>
                            </div>
                        </AccordionSection>
                    </Accordion>
                </div>
            </DirectionContainer>
        </StyledDirection>
    );
}
