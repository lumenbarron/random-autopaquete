import React, { useState, useEffect, useRef } from 'react';
import { Input, CheckboxToggle, Button, Picklist, Option } from 'react-rainbow-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useFirebaseApp, useUser } from 'reactfire';
import { StyledLeftPane, StyledRightPane, StyledPaneContainer, StyledRadioGroup } from './styled';
import { log } from 'firebase-functions/lib/logger';
import swal from 'sweetalert2';
import { element, func } from 'prop-types';

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
        Referencias_lugar,
        Telefono,
        street_number,
        street_name,
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
            <p>{street_name}</p>
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
    const [errorStreetName, setErrorStreetName] = useState(false);
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
    const [streetName, setStreetName] = useState('');
    const [placeRef, setPlaceRef] = useState('');
    const [phone, setPhone] = useState('');

    const [checkBox, setCheckBox] = useState(true);

    const [userName, setUserName] = useState('');
    const [status, setStatus] = useState();
    const [registerSAT, setRegisterSAT] = useState('');
    const tokenProd = process.env.REACT_APP_REDPACK_PROD;
    let idGuia;
    let pickedDirection;

    // useEffect( () =>{

    //     let data = JSON.stringify({
    //         sender: {
    //             contact_name: 'name',
    //             company_name: 'name',
    //             street: 'street_name',
    //             zip_code: '45010',
    //             neighborhood: 'neighborhood',
    //             city: 'Zapopan',
    //             country: 'MX',
    //             state: 'Jalisco',
    //             street_number: '1',
    //             place_reference: 'place_reference',
    //             phone: 'phone',
    //         },
    //         receiver: {
    //             contact_name: 'name',
    //             company_name: 'name',
    //             street: 'street_name',
    //             zip_code: '45040',
    //             neighborhood: 'neighborhood',
    //             city: 'Guadalajara',
    //             country: 'MX',
    //             state: 'Jalisco',
    //             street_number: '1',
    //             place_reference: 'place_reference',
    //             phone: 'phone',
    //         },
    //         packages: [
    //             {
    //                 name:'estandar',
    //                 height: 1,
    //                 width: 1,
    //                 depth: 1,
    //                 weight: 1,
    //                 content_description:'s-d',
    //                 quantity: 1,
    //             },
    //         ],
    //         shipping_company: 'PAKKE',
    //         shipping_service: {
    //             name: 'ESTAFETATERRESTRECONSUMO',
    //             description: 'ESTAFETAECONOMICO',
    //             id: 4,
    //         },
    //         shipping_secure: false,
    //         shipping_secure_data: {
    //             notes: 'cosas',
    //             amount: 0,
    //         },
    //     });
    //     let myHeaders = new Headers();
    //     myHeaders.append('Authorization', tokenProd);
    //     myHeaders.append('Content-Type', 'application/json');
    //     let requestOptions = {
    //         method: 'POST',
    //         headers: myHeaders,
    //         body: data,
    //         redirect: 'follow',
    //     };

    //     async function fetchData () {
    //         console.log('generando guia');
    //         //const urlRequest = `https://autopaquete.simplestcode.com/api/do-shipping-quote/`;
    //         const urlRequest = `https://autopaquete.simplestcode.com/api/do-shipping/`;
    //         await fetch(urlRequest, requestOptions)
    //         .then(response => response.json())
    //         // await Promise.all([
    //         //     fetch('https://autopaquete.simplestcode.com/api/do-shipping-quote/pakke', requestOptions),
    //         //     fetch('https://autopaquete.simplestcode.com/api/do-shipping-quote/fedex', requestOptions),
    //         //     fetch('https://autopaquete.simplestcode.com/api/do-shipping-quote/redpack', requestOptions ),

    //         // ])
    //         // .then(([res1, res2, res3]) =>
    //         // Promise.all([(res1.json(),res2.json(),res3.json())]),
    //         // )
    //         // .then(async ([res1, res2, res3]) => {
    //         //     const result1 = await res1.json();
    //         //     const result2 = await res2.json();
    //         //     const result3 = await res3.json();
    //         //    console.log(result1,result2 ,result3);
    //         // return [result1.concat(result2 ,result3)]
    //         // })

    //         .then(result => {
    //             console.log(result)
    //             // console.log(result.length);
    //         })
    //         .catch(err => console.log('error', err));
    //     };
    //     fetchData();
    // }, []);

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
                            setStreetName(doc.data().sender_addresses.street_name);
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

    // useEffect(() => {
    //     if (CP.length === 5) {
    //         fetch(`https://api-sepomex.hckdrk.mx/query/info_cp/${CP}?type=simplified`)
    //             .then(response => {
    //                 if (!response.ok) {
    //                     console.log('CP no validado');
    //                     setTimeout(() => {
    //                         swal.fire({
    //                             title: '!Lo siento!',
    //                             text: 'Código Postal no válido, favor de verificar.',
    //                             icon: 'error',
    //                             confirmButtonText: 'Ok',
    //                         });
    //                         setCP('');
    //                     }, 1000);
    //                 }
    //                 return response.json();
    //             })
    //             .then(data => {
    //                 if (data.response) {
    //                     const { municipio, estado } = data.response;
    //                     setCountry(municipio);
    //                     const stateKey = Object.keys(states).find(key => states[key] === estado);
    //                     setState({ label: states[stateKey], value: stateKey });
    //                 }
    //             });
    //     }
    // }, [CP]);

    function handleDirections(snapshot) {
        const directionData = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data(),
            };
        });
        setDirectionData(directionData);
        //console.log('sender_addresses', directionData);
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
                    //console.log('Cached document data:', pickedDirection);
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

    //Se obtiene el nombre del usuario
    useEffect(() => {
        if (user) {
            db.collection('profiles')
                .where('ID', '==', user.uid)
                .get()
                .then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        // console.log('primer data', doc.data(), doc.id);
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
        let fullStreet = streetName.concat(' ', streetNumber);
        // console.log('fullStreet', fullStreet, fullStreet.length)
        //Se validan todos los inputs uno por uno
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
        if (
            streetNumber.trim() === '' ||
            streetNumber.length > 10 ||
            !addressRegex.test(streetNumber)
        ) {
            swal.fire({
                title: '!Lo siento!',
                text:
                    'El texto puede ser hasta 10 letras y números,sin acentos, carácteres especiales (. , & / ñ) o espacio al final; favor de verificar.',
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
        if (state.value.trim() === '') {
            setError(true);
            setErrorState(true);
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
            setError(true);
            setErrorPlaceRef(true);
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
                street_name: streetName,
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
                street_name: streetName,
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
                street_name: '',
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
                {errorCP && (
                    <div className="alert-error pl-4">CP no validado, favor de verificarlo</div>
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
