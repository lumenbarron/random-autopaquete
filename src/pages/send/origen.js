import React, { useState, useEffect, useRef } from 'react';
import { Input, CheckboxToggle, Button, Picklist, Option } from 'react-rainbow-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useFirebaseApp, useUser } from 'reactfire';
import { StyledLeftPane, StyledRightPane, StyledPaneContainer, StyledRadioGroup } from './styled';
import { log } from 'firebase-functions/lib/logger';

const cpRegex = RegExp(/^[0-9]{5}$/);
const phoneRegex = RegExp(/^[0-9]{10}$/);

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
        Referencias_lugar,
        Telefono,
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
            <p>Tel {Telefono}</p>
        </>
    );
};

export const OrigenComponent = ({ onSave, idGuiaGlobal }) => {
    const firebase = useFirebaseApp();
    const db = firebase.firestore();
    const user = useUser();
    const creationDate = new Date();

    const [error, setError] = useState(false);

    const [errorName, setErrorName] = useState(false);
    const [errorNameDuplicate, setErrorNameDuplicate] = useState(false);
    const [errorCP, setErrorCP] = useState(false);
    const [errorStreetNumber, setErrorStreetNumber] = useState(false);
    const [errorNeighborhood, setErrorNeighborhood] = useState(false);
    const [errorCountry, setErrorCountry] = useState(false);
    const [errorState, setErrorState] = useState(false);
    const [errorNumber, setErrorNumber] = useState(false);
    const [errorPlaceRef, setErrorPlaceRef] = useState(false);
    const [errorPhone, setErrorPhone] = useState(false);
    const [errorCredits, setErrorCredits] = useState(false);

    const [directionData, setDirectionData] = useState([]);

    const [value, setValue] = useState();

    const [filter, setFilter] = useState('');

    const [name, setName] = useState('');
    const [CP, setCP] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState] = useState({ label: '', value: '' });
    const [streetNumber, setStreetNumber] = useState('');
    const [placeRef, setPlaceRef] = useState('');
    const [phone, setPhone] = useState('');

    const [checkBox, setCheckBox] = useState(true);

    const [userName, setUserName] = useState('');
    const [status, setStatus] = useState();
    const [registerSAT, setRegisterSAT] = useState('');

    let idGuia;
    let pickedDirection;

    //Se busca los datos de envío (si hay algun envío efectuandose)
    useEffect(() => {
        if (user) {
            if (idGuiaGlobal) {
                db.collection('guia')
                    .doc(idGuiaGlobal)
                    .get()
                    .then(function(doc) {
                        if (doc.exists) {
                            setName(doc.data().sender_addresses.name);
                            setCP(doc.data().sender_addresses.codigo_postal);
                            setNeighborhood(doc.data().sender_addresses.neighborhood);
                            setCountry(doc.data().sender_addresses.country);
                            setState({
                                value: doc.data().sender_addresses.state,
                                label: states[doc.data().sender_addresses.state],
                            });
                            setStreetNumber(doc.data().sender_addresses.street_number);
                            setPlaceRef(doc.data().sender_addresses.place_reference);
                            setPhone(doc.data().sender_addresses.phone);
                            setCheckBox(false);
                        } else {
                            console.log('No such document!');
                        }
                    });
            }
        }
    }, [idGuiaGlobal]);

    useEffect(() => {
        if (user) {
            const reloadDirectios = () => {
                db.collection('sender_addresses')
                    .where('ID', '==', user.uid)
                    .onSnapshot(handleDirections);
            };
            reloadDirectios();
        }
    }, []);

    useEffect(() => {
        if (CP.length === 5) {
            fetch(`https://api-sepomex.hckdrk.mx/query/info_cp/${CP}?type=simplified`)
                .then(response => {
                    if (!response.ok) {
                        console.log('CP no validado');
                        return {};
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

    function handleDirections(snapshot) {
        const directionData = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data(),
            };
        });
        setDirectionData(directionData);
        console.log('directionData', directionData);
    }

    const options = directionData
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

    //Se obtienen las direcciones guardadas
    useEffect(() => {
        if (value) {
            const docRef = db.collection('sender_addresses').doc(value);
            //Obteniendo la direccion seleccionada
            let getOptions = {
                source: 'cache',
            };
            docRef
                .get(getOptions)
                .then(function(doc) {
                    // Document was found in the cache. If no cached document exists,
                    // an error will be returned to the 'catch' block below.
                    pickedDirection = doc.data();
                    console.log('Cached document data:', pickedDirection);
                })
                .catch(function(error) {
                    console.log('Error getting cached document:', error);
                });
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

    //Se obtiene el nombre del usuario
    useEffect(() => {
        if (user) {
            db.collection('profiles')
                .where('ID', '==', user.uid)
                .get()
                .then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        console.log('primer data', doc.data());
                        setUserName(doc.data().name);
                        setStatus(doc.data().status);
                        if (doc.data().persona === 'Física') {
                            setRegisterSAT(doc.data().nombre_fiscal);
                        } else if (doc.data().persona === 'Moral') {
                            setRegisterSAT(doc.data().razon_social);
                        } else {
                            setRegisterSAT('');
                        }
                    });
                })
                .catch(function(error) {
                    console.log('Error getting documents: ', error);
                });
        }
    }, []);

    const registerDirecction = () => {
        //Se validan todos los inputs uno por uno
        if (name.trim() === '') {
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
        if (state.value.trim() === '') {
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
        if (phone.trim() === '' || !phoneRegex.test(phone)) {
            setErrorPhone(true);
            setError(true);
            return;
        } else {
            setErrorPhone(false);
        }
        if (status !== 'Aprobado') {
            setErrorCredits(true);
            return;
        }
        //Si el usuario quiere guardar la dirección se guarda en la colleccion de sender_addresses
        if (checkBox) {
            const duplicateName = directionData.map((searchName, idx) => {
                return searchName.name;
            });
            if (duplicateName.includes(name)) {
                setErrorNameDuplicate(true);
                setError(false);
                return;
            }
            setErrorNameDuplicate(false);
            setError(false);

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
        }

        const directionsGuiasCollectionAdd = db.collection('guia').add({
            ID: user.uid,
            name: userName,
            razon_social: registerSAT,
            creation_date: creationDate,
            status: 'incomplete',
            sender_addresses: {
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
            receiver_addresses: {
                name: '',
                codigo_postal: '',
                neighborhood: '',
                country: '',
                state: '',
                street_number: '',
                place_reference: '',
                phone: '',
                ID: '',
                creation_date: '',
            },
            package: {
                name: '',
                height: '',
                width: '',
                depth: '',
                weight: '',
                content_description: '',
                quantity: '',
                content_value: '',
                creation_date: '',
            },
        });

        const searchDuplicate = db.collection('sender_addresses').get();

        directionsGuiasCollectionAdd
            .then(function(docRef) {
                idGuia = docRef.id;
                console.log('Se crea y se guarda el id de la guía', idGuia);
                onSave({ idGuia });
            })
            .catch(function(error) {
                console.error('Error adding document: ', error);
            });
    };

    const search = e => {
        let keyword = e.target.value;
        setFilter(keyword);
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
                <h4>Dirección de origen</h4>
                <div className="rainbow-align-content_center rainbow-flex_wrap">
                    <Input
                        id="nombre"
                        label="Nombre"
                        type="email"
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
                {errorNameDuplicate && (
                    <div className="w-75 pl-4">
                        <span className="alert-error">El nombre ya se encuentra registrado</span>
                    </div>
                )}
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

                {errorCredits && (
                    <div className="alert-error pl-4">
                        Es necesario tener un estatus aprobatorio para relizar envíos
                    </div>
                )}
                {error && <div className="alert-error pl-4">Corregir los campos marcados</div>}

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
