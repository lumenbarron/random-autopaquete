import React, { useState, useEffect } from 'react';
import { Input, CheckboxToggle, Button } from 'react-rainbow-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { StyledLeftPane, StyledRightPane, StyledPaneContainer, StyledRadioGroup } from './styled';
import * as firebase from 'firebase';
import { useFirebaseApp, useUser } from 'reactfire';

const AddressRadioOption = ({ directions }) => {
    const {
        neighborhood,
        place_reference,
        phone,
        street_number,
        country,
        codigo_postal,
        name,
    } = directions;

    return (
        <>
            <span>
                <b>{name}</b>
            </span>
            <p>{street_number}</p>
            <p>{neighborhood}</p>
            <p>{country}</p>
            <p>C.P. {codigo_postal}</p>
            <p>Tel {phone}</p>
        </>
    );
};

export const DestinoComponent = ({ onSave }) => {
    const [value, setValue] = useState(null);
    const [directionDataa, setDirectionDataa] = useState([]);

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

    const [checkBox, setCheckBox] = useState(true);

    const creationDate = new Date();

    useEffect(() => {
        const reloadDirectios = () => {
            db.collection('receiver_addresses')
                .where('ID', '==', user.uid)
                .onSnapshot(handleDirections);
        };
        reloadDirectios();
    }, []);

    function handleDirections(snapshot) {
        const directionDataa = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data(),
            };
        });
        setDirectionDataa(directionDataa);
    }

    const options = directionDataa.map((directions, idx) => {
        return {
            value: directions.id,
            label: <AddressRadioOption key={directions.id} directions={directions} />,
        };
    });

    useEffect(() => {
        if (value) {
            const docRef = db.collection('receiver_addresses').doc(value);
            docRef
                .get()
                .then(function(doc) {
                    if (doc.exists) {
                        setName(doc.data().name);
                        setCP(doc.data().codigo_postal);
                        setNeighborhood(doc.data().neighborhood);
                        setCountry(doc.data().country);
                        setStreetNumber(doc.data().street_number);
                        setPlaceRef(doc.data().place_reference);
                        setPhone(doc.data().phone);
                        setCheckBox(false);
                    } else {
                        console.log('No such document!');
                    }
                })
                .catch(function(error) {
                    console.log('Error getting document:', error);
                });
        }
    }, [value]);

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

        const directionData = {
            name,
            codigo_postal: CP,
            neighborhood,
            country,
            street_number: streetNumber,
            place_reference: placeRef,
            phone,
            ID: user.uid,
            creation_date: creationDate.toLocaleDateString(),
        };

        const directionGuiaData = {
            receiver_addresses: {
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
        };
        const duplicateStreet = directionDataa.map((searchStree, idx) => {
            return searchStree.street_number;
        });
        onSave(directionData, directionGuiaData, checkBox, duplicateStreet, streetNumber);
    };

    return (
        <StyledPaneContainer>
            <StyledLeftPane>
                <h4>Mis direcciones</h4>
                <Input
                    placeholder="Buscar"
                    iconPosition="right"
                    icon={<FontAwesomeIcon icon={faSearch} />}
                />
                <StyledRadioGroup
                    id="radio-group-component-1"
                    options={options}
                    value={value}
                    className="rainbow-m-around_small"
                    onChange={e => setValue(e.target.value)}
                />
            </StyledLeftPane>
            <StyledRightPane>
                <h4>Dirección de Destino</h4>
                <div className="rainbow-align-content_center rainbow-flex_wrap">
                    <Input
                        id="nombre"
                        label="Nombre"
                        name="nombre"
                        value={name}
                        className="rainbow-p-around_medium"
                        style={{ width: '70%' }}
                        onChange={e => setName(e.target.value)}
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
                <div className="rainbow-align-content_center rainbow-flex_wrap">
                    <Input
                        id="colonia"
                        label="Colonia"
                        name="colonia"
                        value={neighborhood}
                        className="rainbow-p-around_medium"
                        style={{ flex: '1 1' }}
                        onChange={e => setNeighborhood(e.target.value)}
                    />
                    <Input
                        id="ciudad"
                        label="Ciudad y Estado"
                        name="ciudad"
                        value={country}
                        className="rainbow-p-around_medium"
                        style={{ flex: '1 1' }}
                        onChange={e => setCountry(e.target.value)}
                    />
                </div>
                <div className="rainbow-align-content_center rainbow-flex_wrap">
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
                <div className="rainbow-align-content_center rainbow-flex_wrap">
                    <Input
                        id="telefono"
                        label="Telefono"
                        name="telefono"
                        value={phone}
                        className="rainbow-p-around_medium"
                        style={{ width: '50%' }}
                        onChange={e => setPhone(e.target.value)}
                    />
                    <div style={{ flex: '1 1', textAlign: 'right' }}>
                        <CheckboxToggle
                            id="guardar"
                            label="Guardar"
                            value={checkBox}
                            onChange={e => setCheckBox(e.target.checked)}
                        />
                    </div>
                </div>
                <Button
                    variant="brand"
                    className="rainbow-m-around_medium"
                    onClick={registerDirecction}
                >
                    Continuar
                    <FontAwesomeIcon icon={faArrowRight} className="rainbow-m-left_medium" />
                </Button>
            </StyledRightPane>
        </StyledPaneContainer>
    );
};
