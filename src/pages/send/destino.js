import React, { useState, useEffect } from 'react';
import { Input, CheckboxToggle, Button, Picklist, Option } from 'react-rainbow-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { StyledLeftPane, StyledRightPane, StyledPaneContainer, StyledRadioGroup } from './styled';
import * as firebase from 'firebase';
import { useFirebaseApp, useUser } from 'reactfire';
import swal from 'sweetalert2';

const cpRegex = RegExp(/^[0-9]{5}$/);
const phoneRegex = RegExp(/^[0-9]{10}$/);
const addressRegex = RegExp(/^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/);

const states = {
    AG: 'Aguascalientes',
    BC: 'Baja California',
    BS: 'Baja California Sur',
    CM: 'Campeche',
    CS: 'Chiapas',
    CH: 'Chihuahua',
    CO: 'Coahuila de Zaragoza',
    CL: 'Colima',
    DF: 'Ciudad de México',
    DG: 'Durango',
    GT: 'Guanajuato',
    GR: 'Guerrero',
    HG: 'Hidalgo',
    JA: 'Jalisco',
    EM: 'México',
    MI: 'Michoacán de Ocampo',
    MO: 'Morelos',
    NA: 'Nayarit',
    NL: 'Nuevo León',
    OA: 'Oaxaca',
    PU: 'Puebla',
    QE: 'Querétaro',
    QR: 'Quintana Roo',
    SL: 'San Luis Potosí',
    SI: 'Sinaloa',
    SO: 'Sonora',
    TB: 'Tabasco',
    TM: 'Tamaulipas',
    TL: 'Tlaxcala',
    VE: 'Veracruz de Ignacio de la Llave',
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

export const DestinoComponent = ({ onSave, idGuiaGlobal }) => {
    const [value, setValue] = useState(null);
    const [directionDataa, setDirectionDataa] = useState([]);

    const firebase = useFirebaseApp();
    const db = firebase.firestore();
    const user = useUser();

    const [error, setError] = useState(false);
    const [errorNameDuplicate, setErrorNameDuplicate] = useState(false);
    const [errorName, setErrorName] = useState(false);
    const [errorCP, setErrorCP] = useState(false);
    const [errorStreetNumber, setErrorStreetNumber] = useState(false);
    const [errorStreetName, setErrorStreetName] = useState(false);
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
    const [streetName, setStreetName] = useState('');
    const [placeRef, setPlaceRef] = useState('');
    const [phone, setPhone] = useState('');

    const [checkBox, setCheckBox] = useState(true);

    const creationDate = new Date();
    console.log('Destino', idGuiaGlobal);

    //Se busca los datos de envío (si hay algun envío efectuandose)
    useEffect(() => {
        if (user) {
            if (idGuiaGlobal) {
                db.collection('guia')
                    .doc(idGuiaGlobal)
                    .get()
                    .then(function(doc) {
                        if (doc.exists) {
                            setName(doc.data().receiver_addresses.name);
                            setCP(doc.data().receiver_addresses.codigo_postal);
                            setNeighborhood(doc.data().receiver_addresses.neighborhood);
                            setCountry(doc.data().receiver_addresses.country);
                            setState({
                                value: doc.data().receiver_addresses.state,
                                label: states[doc.data().receiver_addresses.state],
                            });
                            setStreetName(doc.data().receiver_addresses.street_name);
                            setStreetNumber(doc.data().receiver_addresses.street_number);
                            setPlaceRef(doc.data().receiver_addresses.place_reference);
                            setPhone(doc.data().receiver_addresses.phone);
                            setCheckBox(false);
                        } else {
                            console.log('No such document!');
                        }
                    });
            }
        }
    }, [idGuiaGlobal]);

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
        // console.log('receiver_addresses', directionDataa);
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
        if (CP.length === 5) {
            fetch(`https://api-sepomex.hckdrk.mx/query/info_cp/${CP}?type=simplified`)
                .then(response => {
                    if (!response.ok) {
                        console.log('CP no validado');
                        setTimeout(() => {
                            swal.fire({
                                title: '!Lo siento!',
                                text: 'Código Postal no válido, favor de verificar.',
                                icon: 'error',
                                confirmButtonText: 'Ok',
                            });
                            setCP('');
                        }, 1000);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.response) {
                        const { municipio, estado } = data.response;
                        setCountry(municipio);
                        const stateKey = Object.keys(states).find(key => states[key] === estado);
                        setState({ label: states[stateKey], value: stateKey });
                    }
                });
        }
    }, [CP]);

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
                        setStreetName(doc.data().street_name);
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
        let fullStreet = streetName.concat(' ', streetNumber);

        if (name.trim() === '' || !addressRegex.test(name) || name.length > 35) {
            swal.fire({
                title: '!Lo siento!',
                text:
                    'El texto puede ser hasta 35 letras y números, sin acentos, carácteres especiales (. , & / ñ) o espacio al final; favor de verificar.',
                icon: 'error',
                confirmButtonText: 'Ok',
            });
            setErrorName(true);
            setError(true);
            return;
        } else {
            setErrorName(false);
        }
        if (CP.trim() === '' || !cpRegex.test(CP)) {
            setErrorCP(true);
            setError(true);
            return;
        } else {
            setErrorCP(false);
        }
        if (streetName.trim() === '' || !addressRegex.test(streetName)) {
            swal.fire({
                title: '!Lo siento!',
                text:
                    'El texto tiene que ser sin acentos, carácteres especiales (. , & / ñ) o espacio al final; favor de verificar.',
                icon: 'error',
                confirmButtonText: 'Ok',
            });
            setErrorStreetName(true);
            setError(true);
            return;
        } else {
            setErrorStreetName(false);
        }
        if (streetNumber.trim() === '' || !addressRegex.test(streetNumber)) {
            swal.fire({
                title: '!Lo siento!',
                text:
                    'El texto tiene que ser sin acentos, carácteres especiales (. , & / ñ) o espacio al final; favor de verificar.',
                icon: 'error',
                confirmButtonText: 'Ok',
            });
            setErrorStreetNumber(true);
            setError(true);
            return;
        } else {
            setErrorStreetNumber(false);
        }
        if (fullStreet.length > 35) {
            swal.fire({
                title: '!Lo siento!',
                text:
                    'El texto puede ser hasta 35 letras y números, sin acentos, carácteres especiales (. , & / ñ) o espacio al final; favor de verificar.',
                icon: 'error',
                confirmButtonText: 'Ok',
            });
            setErrorStreetName(true);
            setError(true);
            return;
        } else {
            setErrorStreetName(false);
        }
        if (
            neighborhood.trim() === '' ||
            !addressRegex.test(neighborhood) ||
            neighborhood.length > 35
        ) {
            swal.fire({
                title: '!Lo siento!',
                text:
                    'El texto puede ser hasta 35 letras y números, sin acentos, carácteres especiales (. , & / ñ) o espacio al final; favor de verificar.',
                icon: 'error',
                confirmButtonText: 'Ok',
            });
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
            setErrorState(true);
            setError(true);
            return;
        } else {
            setErrorState(false);
        }
        if (placeRef.trim() === '' || placeRef.length > 20) {
            swal.fire({
                title: '!Lo siento!',
                text: 'El texto puede ser hasta 20 letras y números, favor de verificar.',
                icon: 'error',
                confirmButtonText: 'Ok',
            });
            setErrorPlaceRef(true);
            setError(true);
            return;
        } else {
            setErrorPlaceRef(false);
        }
        if (phone.trim() === '' || !phoneRegex.test(phone)) {
            swal.fire({
                title: '!Lo siento!',
                text: 'El teléfono debe ser de 10 números,favor de verificar.',
                icon: 'error',
                confirmButtonText: 'Ok',
            });
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
            street_name: streetName,
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
                street_name: streetName,
                street_number: streetNumber,
                place_reference: placeRef,
                phone,
                ID: user.uid,
                creation_date: creationDate.toLocaleDateString(),
            },
        };

        if (checkBox) {
            const duplicateName = directionDataa.map((searchName, idx) => {
                return searchName.name;
            });
            if (duplicateName.includes(name)) {
                setErrorNameDuplicate(true);
                setError(false);
                return;
            }
        }
        setErrorNameDuplicate(false);

        onSave(directionData, directionGuiaData, checkBox);
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
                    {errorName && (
                        <div className="w-75 pl-4">
                            <span className="alert-error">Favor de corregir el nombre</span>
                        </div>
                    )}
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
                {errorNameDuplicate && (
                    <div className="w-75 pl-4">
                        <span className="alert-error">El nombre ya se encuentra registrado</span>
                    </div>
                )}
                <div className="rainbow-align-content_center rainbow-flex_wrap">
                    <Input
                        id="domicilio"
                        label="Nombre de la calle"
                        name="domicilio"
                        value={streetName}
                        className={`rainbow-p-around_medium ${
                            errorStreetName ? 'empty-space' : ''
                        }`}
                        style={{ flex: '1 1' }}
                        onChange={e => setStreetName(e.target.value)}
                    />
                    <Input
                        id="num-domicilio"
                        label="Número"
                        name="num-domicilio"
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
                {error && <div className="alert-error pl-4">Corregir los campos marcados</div>}
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
