import React, { useEffect, useState } from 'react';
import {
    Accordion,
    AccordionSection,
    Column,
    TableWithBrowserPagination,
    Input,
    Button,
    Picklist,
    Option,
} from 'react-rainbow-components';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { useFirebaseApp, useUser } from 'reactfire';
import { StyledDirection, DirectionContainer } from './styled';
import OrigenComponent from '../../pages/send/origen';

const states = {
    AG: 'Aguascalientes',
    BC: 'Baja California',
    BS: 'Baja California Sur',
    CM: 'Campeche',
    CS: 'Chiapas',
    CH: 'Chihuahua',
    CO: 'Coahuila',
    CL: 'Colima',
    DF: 'Ciudad de México',
    DG: 'Durango',
    GT: 'Guanajuato',
    GR: 'Guerrero',
    HG: 'Hidalgo',
    JA: 'Jalisco',
    EM: 'Estado de México',
    MI: 'Michoacán',
    MO: 'Morelos',
    NA: 'Nayarit',
    NL: 'Nuevo León',
    OA: 'Oaxaca',
    PU: 'Puebla',
    QE: 'Queretaro',
    QR: 'Quintana Roo',
    SL: 'San Luis Potosi',
    SI: 'Sinaloa',
    SO: 'Sonora',
    TB: 'Tabasco',
    TM: 'Tamaulipas',
    TL: 'Tlaxcala',
    VE: 'Veracruz',
    YU: 'Yucatán',
    ZA: 'Zacatecas',
};

const StatePicklistOptions = () => {
    const allStates = Object.keys(states).map(code => {
        return <Option key={code} value={code} name={states[code]} label={states[code]} />;
    });

    return allStates;
};

const containerStyles = { height: 312 };
const containerTableStyles = { height: 356 };

export default function DirectionPage() {
    const firebase = useFirebaseApp();
    const db = firebase.firestore();
    const user = useUser();

    const [error, setError] = useState(false);
    const [filter, setFilter] = useState('');

    const [name, setName] = useState('');
    const [CP, setCP] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [country, setCountry] = useState('');
    const [streetNumber, setStreetNumber] = useState('');
    const [placeRef, setPlaceRef] = useState('');
    const [phone, setPhone] = useState('');
    const [state, setState] = useState();

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
        console.log(data);
        setSenderAddresses(data);
    }

    function handleReceiverAddresses(snapshot) {
        const data = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data(),
            };
        });
        console.log(data);
        setReceiverAddresses(data);
    }

    //Aqui esta el error
    const deleteAddress = idDoc => {
        db.collection('receiver_addresses')
            //db.collection('sender_addresses')
            .doc(idDoc)
            .delete()
            .then(function() {
                console.log('Document successfully deleted!', idDoc);
            })
            .catch(function(error) {
                console.error('Error removing document: ', error);
            });
    };

    function mapAddresses(address, idx) {
        return {
            id: address.id,
            date: address.creation_date,
            name: address.name,
            codigo_postal: address.codigo_postal,
            country: address.country,
            neighborhood: address.neighborhood,
            street_number: address.street_number,
            phone: address.phone,
            delete: <FontAwesomeIcon icon={faTrashAlt} onClick={() => deleteAddress(address.id)} />,
        };
    }

    const data = senderAddresses
        .filter(address => {
            if (filter === null) {
                return address;
            } else if (address.name.includes(filter) || address.street_number.includes(filter)) {
                return address;
            }
        })
        .map(mapAddresses)
        .concat(
            receiverAddresses
                .filter(address => {
                    if (filter === null) {
                        return address;
                    } else if (
                        address.name.includes(filter) ||
                        address.street_number.includes(filter)
                    ) {
                        return address;
                    }
                })
                .map(mapAddresses),
        );

    const search = e => {
        let keyword = e.target.value;
        setFilter(keyword);
    };

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
            setError(true);
            return;
        }
        const duplicateName = data.map((searchStree, idx) => {
            return searchStree.name;
        });
        if (duplicateName.includes(name)) {
            console.log('Necesitas poner una calle diferente');
            return;
        }

        const directionsCollectionAdd = db.collection('sender_addresses').add({
            name,
            codigo_postal: CP,
            neighborhood,
            country,
            state: state.value,
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
    };
    return (
        <StyledDirection>
            <DirectionContainer>
                <div className="directions-table">
                    <div>
                        <h1>Mis direcciones</h1>

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
                                <TableWithBrowserPagination
                                    data={data}
                                    pageSize={10}
                                    keyField="id"
                                    style={containerTableStyles}
                                    emptyTitle="Oh no!"
                                    emptyDescription="No hay ningun registro actualmente..."
                                >
                                    <Column header="Fecha " field="date" />
                                    <Column header="Nombre" field="name" />
                                    <Column header="Cod. Postal" field="codigo_postal" />
                                    <Column header="Ciudad" field="country" />
                                    <Column header="Colonia" field="neighborhood" />
                                    <Column header="Direccion" field="street_number" />
                                    <Column header="Telefono" field="phone" />
                                    <Column header="" field="delete" defaultWidth={75} />
                                </TableWithBrowserPagination>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <Accordion id="accordion-1">
                        <AccordionSection
                            label="Agregar Dirección de origen"
                            className="direction-accordion"
                        >
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
                                    <div className="rainbow-align-content_center rainbow-flex_wrap">
                                        <Input
                                            id="domicilio"
                                            label="Nombre de la calle, número exterior e interior"
                                            name="domicilio"
                                            value={streetNumber}
                                            className="rainbow-p-around_medium"
                                            style={{ flex: '70%' }}
                                            onChange={e => setStreetNumber(e.target.value)}
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
                                        style={{ width: '1 1' }}
                                        onChange={e => setNeighborhood(e.target.value)}
                                    />
                                </div>
                                <div style={{ flex: '1 1' }}>
                                    <h2>Dirección</h2>
                                    <div className="rainbow-align-content_center rainbow-flex_wrap">
                                        <Input
                                            id="ciudad"
                                            label="Ciudad"
                                            name="ciudad"
                                            value={country}
                                            className="rainbow-p-around_medium"
                                            style={{ width: '50%' }}
                                            onChange={e => setCountry(e.target.value)}
                                        />
                                        <Picklist
                                            id="estado"
                                            label="Estado"
                                            name="estado"
                                            value={state}
                                            className="rainbow-p-around_medium"
                                            style={{ flex: '50%' }}
                                            onChange={value => setState(value)}
                                            required
                                        >
                                            <StatePicklistOptions />
                                        </Picklist>
                                    </div>
                                    <Input
                                        id="telefono"
                                        label="Telefono"
                                        name="telefono"
                                        value={phone}
                                        className="rainbow-p-around_medium"
                                        style={{ width: '100%' }}
                                        onChange={e => setPhone(e.target.value)}
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
                                    {error && (
                                        <div className="alert-error">
                                            Todos los campos necesitan estar llenos
                                        </div>
                                    )}
                                    <Button className="btn-new" onClick={registerDirecction}>
                                        <span>Guardar</span>
                                    </Button>
                                </div>
                            </div>
                        </AccordionSection>
                    </Accordion>
                </div>
            </DirectionContainer>
        </StyledDirection>
    );
}
