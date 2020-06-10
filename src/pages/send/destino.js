import React, { useState, useEffect } from 'react';
import { Input, CheckboxToggle, Button } from 'react-rainbow-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { StyledLeftPane, StyledRightPane, StyledPaneContainer, StyledRadioGroup } from './styled';
import * as firebase from 'firebase';
import { useFirebaseApp, useUser } from 'reactfire';

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

export const DestinoComponent = ({ onSave }) => {
    const [value, setValue] = useState(null);

    // const options = addresses.map((val, idx) => {
    //     console.log(idx);

    //     return {
    //         value: idx + '',
    //         label: <AddressRadioOption data={val} />,
    //     };
    // });
    const [directionData, setDirectionData] = useState([]);

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

    const [checkBox, setCheckBox] = useState(true);

    useEffect(() => {
        const reloadDirectios = () => {
            db.collection('receiver_addresses')
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
        console.log(directions.id);
        return {
            label: (
                <AddressRadioOption
                    key={directions.id}
                    directions={directions}
                    value={directions}
                />
            ),
        };
    });

    const registerDirecction = () => {
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
        const directionData = {
            name,
            codigo_postal: CP,
            Colonia: location,
            ciudad_estado: country,
            calle_numero: streetNumero,
            Referencias_lugar: refPlace,
            Telefono: phone,
            ID: user.uid,
        };

        const directionGuiaData = {
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
        onSave(directionData, directionGuiaData, checkBox);
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
