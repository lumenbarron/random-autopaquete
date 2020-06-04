import React, { useState } from 'react';
import { Input, CheckboxToggle, Button } from 'react-rainbow-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { StyledLeftPane, StyledRightPane, StyledPaneContainer, StyledRadioGroup } from './styled';
import * as firebase from 'firebase';
import { useFirebaseApp, useUser } from 'reactfire';

// TODO: CAMBIAR A LOS DATOS REALES DEL USUARIO
const addresses = [
    {
        name: 'Juan Hernández',
        address: 'Independencia 333',
        neighborhood: 'Col. Centro',
        city: 'Girasoles, Son.',
        references: 'afuera del centro',
        phone: '393939293',
        cp: '44444',
    },
    {
        name: 'Juan Hernández',
        address: 'Independencia 333',
        neighborhood: 'Col. Centro',
        city: 'Girasoles, Son.',
        references: 'afuera del centro',
        phone: '393939293',
        cp: '44444',
    },
    {
        name: 'Juan Hernández',
        address: 'Independencia 333',
        neighborhood: 'Col. Centro',
        city: 'Girasoles, Son.',
        references: 'afuera del centro',
        phone: '393939293',
        cp: '44444',
    },
    {
        name: 'Juan Hernández',
        address: 'Independencia 333',
        neighborhood: 'Col. Centro',
        city: 'Girasoles, Son.',
        references: 'afuera del centro',
        phone: '393939293',
        cp: '44444',
    },
];

const AddressRadioOption = ({ data }) => {
    return (
        <>
            <span>
                <b>{data.name}</b>
            </span>
            <p>{data.address}</p>
            <p>{data.neighborhood}</p>
            <p>{data.city}</p>
            <p>C.P. {data.cp}</p>
            <p>Tel {data.phone}</p>
        </>
    );
};

export const DestinoComponent = ({ onSave }) => {
    const [value, setValue] = useState(null);

    const options = addresses.map((val, idx) => {
        return {
            value: idx + '',
            label: <AddressRadioOption data={val} />,
        };
    });

    const firebase = useFirebaseApp();
    const db = firebase.firestore();
    const user = useUser();

    const [name, setName] = useState('');
    const [CP, setCP] = useState('');
    const [location, setLocation] = useState('');
    const [country, setCountry] = useState('');
    const [streetNumero, setStreetNumber] = useState('');
    const [refPlace, setrefPlace] = useState('');
    const [phone, setPhone] = useState('');

    const registerDirecction = e => {
        if (
            name.trim() === '' ||
            CP.trim() === '' ||
            location.trim() === '' ||
            country.trim() === '' ||
            streetNumero.trim() === '' ||
            refPlace.trim() === '' ||
            phone.trim() === ''
        ) {
            console.log('Espacios vacios');
            return;
        }
        const directionsCollectionAdd = db.collection('receiver_addresses').add({
            name,
            codigo_postal: CP,
            Colonia: location,
            ciudad_estado: country,
            calle_numero: streetNumero,
            Referencias_lugar: refPlace,
            Telefono: phone,
            ID: user.uid,
        });

        directionsCollectionAdd
            .then(function(docRef) {
                console.log('Document written with ID: ', docRef.id);
            })
            .catch(function(error) {
                console.error('Error adding document: ', error);
            });
        const docRef = db.collection('guia').where('ID', '==', user.uid);
        console.log(docRef);
        docRef.get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                console.log('El código llega hasta aquí');
                console.log('Doc:', doc);
            });
        });
        docRef.get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                const userName = doc.data().name;
                const lastName = doc.data().lastname;
                const DocRefe = doc.id;
                console.log('DocRef', DocRefe);
                console.log('docData', doc.data());

                const directionsGuiasCollection = {
                    receiver_addresses: {
                        name,
                        codigo_postal: CP,
                        Colonia: location,
                        ciudad_estado: country,
                        calle_numero: streetNumero,
                        Referencias_lugar: refPlace,
                        Telefono: phone,
                        ID: user.uid,
                    },
                };

                const directionsGuiasCollectionAdd = db
                    .collection('guia')
                    .doc(DocRefe)
                    .update(directionsGuiasCollection);

                directionsGuiasCollectionAdd
                    .then(function(docRef) {
                        console.log('Se cumplio! Document written with ID: ', docRef.id);
                    })
                    .catch(function(error) {
                        console.error('Error adding document: ', error);
                    });
            });
        });
        onSave();
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
                        className="rainbow-p-around_medium"
                        style={{ width: '70%' }}
                        onChange={e => setName(e.target.value)}
                    />
                    <Input
                        id="cp"
                        label="C.P."
                        name="cp"
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
                        className="rainbow-p-around_medium"
                        style={{ flex: '1 1' }}
                        onChange={e => setLocation(e.target.value)}
                    />
                    <Input
                        id="ciudad"
                        label="Ciudad y Estado"
                        name="ciudad"
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
                        className="rainbow-p-around_medium"
                        style={{ flex: '1 1' }}
                        onChange={e => setStreetNumber(e.target.value)}
                    />
                    <Input
                        id="referencia"
                        label="Referencias del Lugar"
                        name="referencia"
                        className="rainbow-p-around_medium"
                        style={{ flex: '1 1' }}
                        onChange={e => setrefPlace(e.target.value)}
                    />
                </div>
                <div className="rainbow-align-content_center rainbow-flex_wrap">
                    <Input
                        id="telefono"
                        label="Telefono"
                        name="telefono"
                        className="rainbow-p-around_medium"
                        style={{ width: '50%' }}
                        onChange={e => setPhone(e.target.value)}
                    />
                    <div style={{ flex: '1 1', textAlign: 'right' }}>
                        <CheckboxToggle id="guardar" label="Guardar" />
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
