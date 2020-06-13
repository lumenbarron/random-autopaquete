import React, { useState, useEffect } from 'react';
import { Input, CheckboxToggle, Button } from 'react-rainbow-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useFirebaseApp, useUser } from 'reactfire';
import { StyledLeftPane, StyledRightPane, StyledPaneContainer, StyledRadioGroup } from './styled';
import SendPage from '../send/index';

const AddressRadioOption = ({ directions }) => {
    const {
        Colonia,
        Referencias_lugar,
        Telefono,
        calle_numero,
        ciudad_estado,
        codigo_postal,
        name,
    } = directions;

    return (
        <>
            <span>
                <b>{name}</b>
            </span>
            <p>{calle_numero}</p>
            <p>{Colonia}</p>
            <p>{ciudad_estado}</p>
            <p>C.P. {codigo_postal}</p>
            <p>Tel {Telefono}</p>
        </>
    );
};

export const OrigenComponent = ({ onSave }) => {
    const firebase = useFirebaseApp();
    const db = firebase.firestore();
    const user = useUser();

    const [directionData, setDirectionData] = useState([]);

    const [value, setValue] = useState();

    const [name, setName] = useState('');
    const [CP, setCP] = useState('');
    const [location, setLocation] = useState('');
    const [country, setCountry] = useState('');
    const [streetNumero, setStreetNumber] = useState('');
    const [placeRef, setPlaceRef] = useState('');
    const [phone, setPhone] = useState('');

    const [checkBox, setCheckBox] = useState(true);

    let idGuia;

    useEffect(() => {
        const reloadDirectios = () => {
            db.collection('sender_addresses')
                .where('ID', '==', user.uid)
                .onSnapshot(handleDirections);
        };
        reloadDirectios();
    }, []);

    function handleDirections(snapshot) {
        const directionData = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data(),
            };
        });
        setDirectionData(directionData);
    }

    const options = directionData.map((directions, idx) => {
        return {
            value: directions.id + '',
            label: <AddressRadioOption key={directions.id} directions={directions} />,
        };
    });

    useEffect(() => {
        if (value) {
            const docRef = db.collection('sender_addresses').doc(value);
            docRef
                .get()
                .then(function(doc) {
                    if (doc.exists) {
                        setName(doc.data().name);
                        setCP(doc.data().codigo_postal);
                        setLocation(doc.data().Colonia);
                        setCountry(doc.data().ciudad_estado);
                        setStreetNumber(doc.data().calle_numero);
                        setPlaceRef(doc.data().Referencias_lugar);
                        setPhone(doc.data().Telefono);
                    } else {
                        // doc.data() will be undefined in this case
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
            location.trim() === '' ||
            country.trim() === '' ||
            streetNumero.trim() === '' ||
            placeRef.trim() === '' ||
            phone.trim() === ''
        ) {
            console.log('Espacios vacios');
            return;
        }
        if (checkBox) {
            const directionsCollectionAdd = db.collection('sender_addresses').add({
                name,
                codigo_postal: CP,
                Colonia: location,
                ciudad_estado: country,
                calle_numero: streetNumero,
                Referencias_lugar: placeRef,
                Telefono: phone,
                ID: user.uid,
            });
            directionsCollectionAdd
                .then(function(docRef) {
                    console.log('Document written with ID (origen): ', docRef.id);
                })
                .catch(function(error) {
                    console.error('Error adding document: ', error);
                });
        }

        const directionsGuiasCollectionAdd = db.collection('guia').add({
            ID: user.uid,
            sender_addresses: {
                name,
                codigo_postal: CP,
                Colonia: location,
                ciudad_estado: country,
                calle_numero: streetNumero,
                Referencias_lugar: placeRef,
                Telefono: phone,
                ID: user.uid,
            },
        });
        directionsGuiasCollectionAdd
            .then(function(docRef) {
                console.log('Document written with ID (Guía): ', docRef.id);
                idGuia = docRef.id;
                console.log('Se crea y se guarda el id de la guía', idGuia);
                onSave({ idGuia });
            })
            .catch(function(error) {
                console.error('Error adding document: ', error);
            });
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
                <h4>Dirección de Origen</h4>
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
                        value={location}
                        className="rainbow-p-around_medium"
                        style={{ flex: '1 1' }}
                        onChange={e => setLocation(e.target.value)}
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
                        value={streetNumero}
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
                    onClick={() => registerDirecction()}
                >
                    Continuar
                    <FontAwesomeIcon icon={faArrowRight} className="rainbow-m-left_medium" />
                </Button>
            </StyledRightPane>
        </StyledPaneContainer>
    );
};
