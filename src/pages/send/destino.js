import React, { useState, useEffect } from 'react';
import { Input, CheckboxToggle, Button, Picklist, Option } from 'react-rainbow-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { StyledLeftPane, StyledRightPane, StyledPaneContainer, StyledRadioGroup } from './styled';
import * as firebase from 'firebase';
import { useFirebaseApp, useUser } from 'reactfire';

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

const AddressRadioOption = ({ directions }) => {
    const {
        neighborhood,
        place_reference,
        phone,
        street_number,
        country,
        state,
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
            <p>
                {country}, {state}
            </p>
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

    const [error, setError] = useState(false);
    const [errorName, setErrorName] = useState(false);
    const [errorCP, setErrorCP] = useState(false);
    const [errorStreetNumber, setErrorStreetNumber] = useState(false);
    const [errorNeighborhood, setErrorNeighborhood] = useState(false);
    const [errorCountry, setErrorCountry] = useState(false);
    const [errorState, setErrorState] = useState(false);
    const [errorNumber, setErrorNumber] = useState(false);
    const [errorPlaceRef, setErrorPlaceRef] = useState(false);
    const [errorPhone, setErrorPhone] = useState(false);
    const [errorCredits, setErrorCredits] = useState(false);
    const [filter, setFilter] = useState('');

    const [name, setName] = useState('');
    const [CP, setCP] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
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

    const options = directionDataa
        .filter(directions => {
            if (filter === null) {
                return directions;
            } else if (
                directions.name.includes(filter) ||
                directions.street_number.includes(filter)
            ) {
                return directions;
            }
        })
        .map(directions => {
            return {
                value: directions.id + '',
                label: <AddressRadioOption key={directions.id} directions={directions} />,
            };
        });

    const search = e => {
        let keyword = e.target.value;
        setFilter(keyword);
    };

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
                        setState({ value: doc.data().state, label: states[doc.data().state] });
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
        if (name.trim() === '') {
            setErrorName(true);
            setError(true);
            return;
        } else {
            setErrorName(false);
            setError(true);
        }
        if (CP.trim() === '') {
            setErrorCP(true);
            setError(true);
            return;
        } else {
            setErrorCP(false);
        }
        if (streetNumber.trim() === '') {
            setErrorStreetNumber(true);
            setError(true);
            return;
        } else {
            setErrorStreetNumber(false);
        }
        if (neighborhood.trim() === '') {
            setErrorNeighborhood(true);
            setError(true);
            return;
        } else {
            setErrorNeighborhood(false);
        }
        if (country.trim() === '') {
            setErrorCountry(true);
            setError(true);
            return;
        } else {
            setErrorCountry(false);
        }
        if (state === '') {
            setError(true);
            setErrorState(true);
            return;
        } else {
            setErrorState(false);
        }
        if (placeRef.trim() === '') {
            setError(true);
            setErrorPlaceRef(true);
            return;
        } else {
            setErrorPlaceRef(false);
        }
        if (phone.trim() === '') {
            setErrorPhone(true);
            setError(true);
            return;
        } else {
            setErrorPhone(false);
        }

        const directionData = {
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
        };

        const directionGuiaData = {
            receiver_addresses: {
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
            },
        };
        const duplicateName = directionDataa.map((searchName, idx) => {
            return searchName.name;
        });

        onSave(directionData, directionGuiaData, checkBox, duplicateName, name);
    };

    return (
        <StyledPaneContainer>
            <StyledLeftPane>
                <h4>Mis direcciones</h4>
                <Input
                    value={filter}
                    placeholder="Buscar"
                    iconPosition="right"
                    icon={<FontAwesomeIcon icon={faSearch} />}
                    onChange={e => search(e)}
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
                        className={`rainbow-p-around_medium ${errorName ? 'empty-space' : ''}`}
                        style={{ width: '70%' }}
                        onChange={e => setName(e.target.value)}
                    />
                    <Input
                        id="cp"
                        label="C.P."
                        name="cp"
                        value={CP}
                        className={`rainbow-p-around_medium ${errorCP ? 'empty-space' : ''}`}
                        style={{ width: '30%' }}
                        onChange={e => setCP(e.target.value)}
                    />
                </div>
                <div className="rainbow-align-content_center rainbow-flex_wrap">
                    <Input
                        id="domicilio"
                        label="Nombre de la calle, número exterior e interior"
                        name="domicilio"
                        value={streetNumber}
                        className={`rainbow-p-around_medium ${
                            errorStreetNumber ? 'empty-space' : ''
                        }`}
                        style={{ flex: '1 1' }}
                        onChange={e => setStreetNumber(e.target.value)}
                    />
                    <Input
                        id="colonia"
                        label="Colonia"
                        name="colonia"
                        value={neighborhood}
                        className={`rainbow-p-around_medium ${
                            errorNeighborhood ? 'empty-space' : ''
                        }`}
                        style={{ flex: '1 1' }}
                        onChange={e => setNeighborhood(e.target.value)}
                    />
                </div>
                <div className="rainbow-align-content_center rainbow-flex_wrap">
                    <Input
                        id="ciudad"
                        label="Ciudad"
                        name="ciudad"
                        value={country}
                        className={`rainbow-p-around_medium ${errorCountry ? 'empty-space' : ''}`}
                        style={{ flex: '1 1' }}
                        onChange={e => setCountry(e.target.value)}
                    />
                    <Picklist
                        id="estado"
                        label="Estado"
                        name="estado"
                        value={state}
                        className={`rainbow-p-around_medium ${errorState ? 'empty-space' : ''}`}
                        style={{ flex: '1 1' }}
                        onChange={value => setState(value)}
                        required
                    >
                        <StatePicklistOptions />
                    </Picklist>
                </div>
                <div className="rainbow-align-content_center rainbow-flex_wrap">
                    <Input
                        id="referencia"
                        label="Referencias del Lugar"
                        name="referencia"
                        value={placeRef}
                        className={`rainbow-p-around_medium ${errorPlaceRef ? 'empty-space' : ''}`}
                        style={{ flex: '2 2' }}
                        onChange={e => setPlaceRef(e.target.value)}
                    />
                    <Input
                        id="telefono"
                        label="Telefono"
                        name="telefono"
                        value={phone}
                        className={`rainbow-p-around_medium ${errorPhone ? 'empty-space' : ''}`}
                        style={{ flex: '2 2' }}
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
                {error && <div className="alert-error pl-4">Completar los campos marcados</div>}
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
