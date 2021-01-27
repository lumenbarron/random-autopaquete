import React, { useState, useRef, useEffect } from 'react';
import { useFirebaseApp, useUser } from 'reactfire';
import {
    Input,
    CheckboxToggle,
    Button,
    Picklist,
    Option,
    Select,
    Column,
    TimePicker,
    Badge,
    DatePicker,
    TableWithBrowserPagination,
} from 'react-rainbow-components';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Row, Col } from 'react-bootstrap';
import {
    StyledLeftPane,
    StyledRightPane,
    StyledPaneContainer,
    StyledRadioGroup,
    StyledSendPage,
} from './styled';
import { log } from 'firebase-functions/lib/logger';
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

let idPickup;

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

    idPickup = directions.id;

    return (
        <>
            <span>
                <b>{name}</b>
            </span>
            <p>{street_number}</p>
            <p>{neighborhood}</p>
            <p>{state}</p>
            <p>{country}</p>
            <p>C.P. {codigo_postal}</p>
            <p>Tel {Telefono}</p>
        </>
    );
};

const containerStyles = { height: 200 };

const StyledTable = styled(TableWithBrowserPagination)`
    td[data-label='Guía'] {
        > div {
            line-height: 1.2rem;
            > span {
                white-space: break-spaces;
                font-size: 12px;
            }
        }
    }
`;

const PickingPage = () => {
    const firebase = useFirebaseApp();
    const db = firebase.firestore();
    const user = useUser();
    // const creationDate = new Date();
    // console.log('creationDate', creationDate);

    const [error, setError] = useState(false);

    const [errorName, setErrorName] = useState(false);
    const [errorNameDuplicate, setErrorNameDuplicate] = useState(false);
    const [errorCP, setErrorCP] = useState(false);
    const [errorStreetName, setErrorStreetName] = useState(false);
    const [errorStreetNumber, setErrorStreetNumber] = useState(false);
    const [errorNeighborhood, setErrorNeighborhood] = useState(false);
    const [errorCountry, setErrorCountry] = useState(false);
    const [errorState, setErrorState] = useState(false);
    const [errorNumber, setErrorNumber] = useState(false);
    const [errorPlaceRef, setErrorPlaceRef] = useState(false);
    const [errorPhone, setErrorPhone] = useState(false);
    const [errorCredits, setErrorCredits] = useState(false);
    const [errorHeight, setErrorHeight] = useState(false);
    const [errorWidth, setErrorWidth] = useState(false);
    const [errorDepth, setErrorDepth] = useState(false);

    const [directionData, setDirectionData] = useState([]);

    const [value, setValue] = useState();
    const idPickup = useRef(null);
    const idGuide = useRef('');
    const typeSupplier = useRef('');
    const typeCity = useRef('');

    const [filter, setFilter] = useState('');
    const [name, setName] = useState('');
    const [CP, setCP] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState] = useState({ label: '', value: '' });
    const [streetName, setStreetName] = useState('');
    const [streetNumber, setStreetNumber] = useState('');
    const [placeRef, setPlaceRef] = useState('');
    const [phone, setPhone] = useState('');
    const [guide, setGuide] = useState('');
    const [selectSupplier, setSelectSupplier] = useState(null);
    const [quantity, setQuantity] = useState('');
    const [weightTotal, setWeightTotal] = useState('');
    const [height, setHeight] = useState('');
    const [width, setWidth] = useState('');
    const [depth, setDepth] = useState('');
    const [selectDate, setSelectDate] = useState({ date: new Date() });
    const [startHour, setStartHour] = useState({ time: '16:32' });
    const [endHour, setEndHour] = useState({ time: '16:32' });
    const [checkBox, setCheckBox] = useState(true);
    const [available, setAvailable] = useState(false);
    const [userName, setUserName] = useState('');
    const [status, setStatus] = useState();
    const [registerSAT, setRegisterSAT] = useState('');
    const tokenProd = process.env.REACT_APP_REDPACK_PROD;
    let idGuia;
    let pickedDirection;

    let allSuppliers = [
        {
            value: 'paquetería',
            label: 'paquetería',
        },
        {
            value: 'FEDEX',
            label: 'Fedex',
        },
        {
            value: 'REDPACK',
            label: 'Redpack',
        },
    ];

    //Tracking
    //     useEffect(() => {
    //     let myHeaders = new Headers();
    //     myHeaders.append('Authorization', tokenProd);
    //     myHeaders.append('Content-Type', 'application/json');
    //     let requestOptions = {
    //         method: 'POST',
    //         headers: myHeaders,
    //         body: JSON.stringify({ shipping_id: 772672190862 }),
    //         redirect: 'follow',
    //     };
    //     const urlRequest = `https://autopaquete.simplestcode.com/api/tracking-shipping/fedex`;
    //     console.log('url', urlRequest);
    //     fetch(urlRequest, requestOptions)
    //         .then(response => response.json())
    //         .then(result => console.log(result))
    //         .catch(error => console.log('error', error));
    // }, []);

    //Response Redpack
    //     data: {
    //     packages: [{status: "SALIDA DE OFICINA", location: "MOSTRADOR PATRIA GDL", date: "2021-01-25T12:56:13-06:00", notes: "DESC:MOSTRADOR PATRIA CTO:3182909 MOV: 1 LOC:MGD03"}],
    // shipping_id: "82696397"
    // }

    //Response Fedex
    // data: {
    //     shipping_id: "783003405501",
    //     packages: [{
    //         date: "2021-01-25T00:00:00"
    // location: " "
    // notes: "Se creó la etiqueta de envíos. Se actualizará el estado cuando se inicie el envío."
    // status: "Información del envío enviada a FedEx" , "entregado", "Recogido"
    //     }]
    // }

    //PickUp

    //     useEffect(() => {
    // let myHeaders = new Headers();
    // myHeaders.append('Authorization', 'Token 358d5793ff5972a4365f8f608da9910afcfd231b');
    // myHeaders.append('Content-Type', 'application/json');
    // let requestOptions = {
    //     method: 'POST',
    //     headers: myHeaders,
    //              body: JSON.stringify({
    //                 "sender":{"contact_name":"CHISTIAN ALEJANDRO AMEZCUA",
    //                 "company_name":"CHISTIAN ALEJANDRO AMEZCUA",
    //                 "street":"JOSE MARIA MERCADO",
    //                 "city":"Guadalajara",
    //                 "zip_code":"44360",
    //                 "neighborhood":"SAN JUAN DE DIOS",
    //                 "country":"MX",
    //                 "state":"JALISCO",
    //                 "street_number":"24",
    //                 "place_reference":"GIGANTES Y OBREGON",
    //                 "phone":"3312364881"},
    //                 "total_packages": 20,
    //                 "total_weight": 300,
    //                 "shipping_company": "FEDEX",
    //                 "shipping_id": 83952839,
    //                 "pickup_date": "2021-01-27",
    //                 "pickup_time": "14:00",
    //                 "company_close_time": "18:00"
    // }),
    // body: JSON.stringify({
    //     "sender":{"contact_name":"RAVISA HAUS",
    //     "company_name":"RAVISA HAUS",
    //     "street":"LATERAL BLVD BERNARDO QUINTANA",
    //     "city":"Querétaro",
    //     "zip_code":"45010",
    //     "neighborhood":"SAN PABLO",
    //     "country":"MX",
    //     "state":"Querétaro",
    //     "street_number":"5112",
    //     "place_reference":".",
    //     "phone":"4422429001"},
    //     "packages_size" : "60x30x30",
    //     "total_packages": 1,
    //     "total_weight": 11,
    //     "shipping_company": "REDPACK",
    //     "shipping_id": 95385018,
    //     "pickup_date": "2021-01-27",
    //     "pickup_time": "14:00",
    //     "company_close_time": "18:00"
    // }),
    //             redirect: 'follow',
    //         };
    //         const urlRequest = `https://autopaquete.simplestcode.com/api/pickup-shipping/`;
    //         console.log('url', urlRequest);
    //         fetch(urlRequest, requestOptions)
    //             .then(response => response.json())
    //             .then(result => console.log(result))
    //             .catch(error => console.log('error', error));
    //     }, []);

    //Response Redpack
    // pickup_data:
    // calle: "una calle"
    // ciudad: "Zapopan"
    // codigoPostal: 28175
    // colonia_Asentamiento: "Tuzania"
    // contacto: "Lucy"
    // email: "17:00:00"
    // estado: "Jalisco"
    // nombre_Compania: "lucy prueba"
    // numeroExterior: "986"
    // numeroInterior: ""
    // pais: "MX"
    // telefonos: [{…}]
    // pickup_date: "2021-01-26T17:00:00"
    // pickup_id: "10562124"
    // shipping_id: "82696379"

    //Response Fedex
    // pickup_date: "2021-01-26T17:00:00"
    // pickup_id: "1056"
    //calle

    const getSupplier = supplier => {
        console.log('selectSupplier', supplier);
        console.log('guia', idGuide.current);
        typeSupplier.current = supplier;
        setSelectSupplier(supplier);
        if (idGuide.current != '') {
            getIdGuia(idGuide.current);
        }
    };

    const getIdGuia = trackingNumber => {
        console.log('selectSupplier', typeSupplier.current);
        console.log(trackingNumber);
        idGuide.current = trackingNumber;
        let dataGuia = [];
        if (trackingNumber == '' || !trackingNumber) {
            swal.fire(
                '¡Oh no!',
                'Parece que no hay alguna guía con ese número, podrías revisar',
                'error',
            );
        } else {
            db.collection('guia')
                .where('rastreo', 'array-contains', trackingNumber)
                .get()
                .then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        console.log(doc.data());
                        console.log(doc.data().supplierData.cargos.shippingInfo[0]);
                        let supplierType = doc.data().supplierData.cargos.shippingInfo[0];
                        if (supplierType === typeSupplier.current) {
                            setAvailable(true);
                            setState({
                                value: doc.data().sender_addresses.state,
                                label: states[doc.data().sender_addresses.state],
                            });
                            typeCity.current = doc.data().sender_addresses.country;
                            setCountry(doc.data().sender_addresses.country);
                            getDirections(doc.data().sender_addresses.country);
                        } else {
                            setAvailable(false);
                            swal.fire(
                                '¡Oh no!',
                                'Parece que esta guía no corresponde a la paquetería seleccionada',
                                'error',
                            );
                        }
                    });
                })
                .catch(function(error) {
                    swal.fire(
                        '¡Oh no!',
                        'Parece que no hay alguna guía con ese número, podrías revisar',
                        'error',
                    );
                    console.log('Error getting documents: ', error);
                });
        }
    };

    //Obteniendo las direcciones de pickup
    const getDirections = city => {
        console.log('id del user', user.uid, 'city', city);
        let dataAddress = [];
        let dataAddressFilter = [];
        if (user) {
            const reloadDirectios = () => {
                db.collection('pickup_addresses')
                    .where('ID', '==', user.uid)
                    .onSnapshot(function(querySnapshot) {
                        querySnapshot.forEach(doc => {
                            dataAddress.push({
                                id: doc.id,
                                city: doc.data().city,
                                ...doc.data(),
                            });
                        });
                        console.log(dataAddress);
                        //Filtrando Direcciones
                        dataAddressFilter = dataAddress.filter(item => item.city.includes(city));
                        setDirectionData(dataAddressFilter);
                        console.log('pickup_addresses filtered', dataAddressFilter);
                    });
            };
            reloadDirectios();
        }
    };

    // useEffect(() => {
    //     console.log('pickup id addres', idPickup.current);
    //     if (user) {
    //         if(idPickup.current) {
    //             db.collection('pickup_addresses')
    //                 .doc(idPickup.current)
    //                 .get()
    //                 .then(function(doc) {
    //                     if (doc.exists) {
    //                         setName(doc.data().name);
    //                         setCP(doc.data().codigo_postal);
    //                         setNeighborhood(doc.data().neighborhood);
    //                         setState({
    //                             value: doc.data().state,
    //                             label: states[doc.data().state],
    //                         });
    //                         setStreetNumber(doc.data().street_number);
    //                         setPlaceRef(doc.data().place_reference);
    //                         setPhone(doc.data().phone);
    //                         setCheckBox(false);
    //                     } else {
    //                         console.log('No such document!');
    //                     }
    //                 });
    //             }
    //     }
    // }, [idGuiaGlobal]);

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
                        console.log(data.response);
                        console.log(typeCity.current, 'ciudad guarada');
                        if (data.response.ciudad !== typeCity.current) {
                            // setTimeout(() => {
                            swal.fire({
                                title: '!Lo siento!',
                                text: 'El código postal, no es de esa ciudad, favor de verificar.',
                                icon: 'error',
                                confirmButtonText: 'Ok',
                            });
                            setCP('');
                            // }, 1000);
                        }
                    }
                });
        }
    }, [CP]);

    // const saveServiceData = supplierData => {
    //     // TODO: Guardar la elección de paquetería en un State, para usarla cuando se creará la guía
    //     console.log('supplierData', supplierData);
    //     let costGuia = supplierData.Supplier_cost;
    //     console.log('costGuia', costGuia);
    //     const directionsGuiasCollectionAdd = db
    //         .collection('guia')
    //         .doc(idGuiaGlobal.current)
    //         .update({ status: 'completed', supplierData });

    //     if (supplierData.Supplier === 'autoencargosEconomico') {
    //         console.log('autoencargos pdf');
    //         console.log(idGuiaGlobal.current);
    //         newBalance(costGuia);
    //         setguiaReady(true);
    //         setCurrentStepName('descarga');
    //     } else {
    //         setCurrentStepName('descarga');
    //         let myHeaders = new Headers();
    //         myHeaders.append('Authorization', tokenProd);
    //         myHeaders.append('Content-Type', 'application/json');
    //         console.log('obteniendo los valores de firestore');
    //         //Asignando los valores desde el doc guia del firestore
    //         db.collection('guia')
    //             .doc(idGuiaGlobal.current)
    //             .get()
    //             .then(function(doc) {
    //                 if (doc.exists) {
    //                     console.log('Document data:', doc.data());
    //                     let data = JSON.stringify({
    //                         sender: {
    //                             contact_name: doc.data().sender_addresses.name,
    //                             company_name: doc.data().sender_addresses.name,
    //                             street: doc.data().sender_addresses.street_number,
    //                             zip_code: doc.data().sender_addresses.codigo_postal,
    //                             neighborhood: doc.data().sender_addresses.neighborhood,
    //                             city: doc.data().sender_addresses.country,
    //                             country: 'MX',
    //                             state: doc.data().sender_addresses.state,
    //                             street_number: '-',
    //                             place_reference: doc.data().sender_addresses.place_reference,
    //                             phone: doc.data().sender_addresses.phone,
    //                         },
    //                         receiver: {
    //                             contact_name: doc.data().receiver_addresses.name,
    //                             company_name: doc.data().receiver_addresses.name,
    //                             street: doc.data().receiver_addresses.street_number,
    //                             zip_code: doc.data().receiver_addresses.codigo_postal,
    //                             neighborhood: doc.data().receiver_addresses.neighborhood,
    //                             city: doc.data().receiver_addresses.country,
    //                             country: 'MX',
    //                             state: doc.data().receiver_addresses.state,
    //                             street_number: '-',
    //                             place_reference: doc.data().receiver_addresses.place_reference,
    //                             phone: doc.data().receiver_addresses.phone,
    //                         },
    //                         packages: [
    //                             {
    //                                 name: doc.data().package.name,
    //                                 height: doc.data().package.height,
    //                                 width: doc.data().package.width,
    //                                 depth: doc.data().package.depth,
    //                                 weight: doc.data().package.weight,
    //                                 content_description: doc.data().package.content_description,
    //                                 quantity: doc.data().package.quantity,
    //                             },
    //                         ],
    //                         shipping_company: doc.data().supplierData.cargos.shippingInfo[0],
    //                         shipping_service: {
    //                             name: doc.data().supplierData.cargos.shippingInfo[1],
    //                             description: doc.data().supplierData.cargos.shippingInfo[2],
    //                             id: doc.data().supplierData.cargos.shippingInfo[3],
    //                         },
    //                         shipping_secure:
    //                             doc.data().supplierData.cargos.insurance === 0 ? false : true,
    //                         shipping_secure_data: {
    //                             notes: doc.data().package.content_description,
    //                             amount: doc.data().supplierData.cargos.insurance,
    //                         },
    //                     });
    //                     console.log('data 2', data);
    //                     let requestOptions = {
    //                         method: 'POST',
    //                         headers: myHeaders,
    //                         body: data,
    //                         redirect: 'follow',
    //                     };
    //                     fetch(
    //                         'https://autopaquete.simplestcode.com/api/do-shipping/',
    //                         requestOptions,
    //                     )
    //                         .then(response => response.json())
    //                         .then(result => {
    //                             console.log(result);
    //                             let responseFetch = Object.keys(result);
    //                             if (responseFetch.length === 0) {
    //                                 setEmptyResult(true);
    //                             } else {
    //                                 console.log(result.pdf_b64);
    //                                 console.log(result.id_shipping);
    //                                 db.collection('guia')
    //                                     .doc(idGuiaGlobal.current)
    //                                     .update({
    //                                         label: result.pdf_b64,
    //                                         rastreo: result.id_shipping,
    //                                     });
    //                                 // setCurrentStepName('descarga');
    //                                 newBalance(costGuia);
    //                                 setguiaReady(true);
    //                             }
    //                         })
    //                         .catch(error => console.log('error', error));
    //                 }
    //             });
    //     }
    // };

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
        console.log('use effect');
        if (value) {
            const docRef = db.collection('pickup_addresses').doc(value);
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

    // useEffect(() => {
    //     if (user) {
    //         db.collection('profiles')
    //             .where('ID', '==', user.uid)
    //             .get()
    //             .then(function(querySnapshot) {
    //                 querySnapshot.forEach(function(doc) {
    //                     console.log('primer data', doc.data(), doc.id);
    //                     setUserName(doc.data().name);
    //                     setStatus(doc.data().status);
    //                     if (doc.data().persona === 'Física') {
    //                         setRegisterSAT(doc.data().nombre_fiscal);
    //                     } else if (doc.data().persona === 'Moral') {
    //                         setRegisterSAT(doc.data().razon_social);
    //                     } else {
    //                         setRegisterSAT('');
    //                     }
    //                 });
    //             })
    //             .catch(function(error) {
    //                 console.log('Error getting documents: ', error);
    //             });
    //     }
    // }, []);

    // const addPicking = () => {
    //     //Se validan todos los inputs uno por uno
    //     if (name.trim() === '' || !addressRegex.test(name) || name.length > 35) {
    //         swal.fire({
    //             title: '!Lo siento!',
    //             text:
    //                 'El texto puede ser hasta 35 letras y números, sin acentos, carácteres especiales (. , & / ñ) o espacio al final; favor de verificar.',
    //             icon: 'error',
    //             confirmButtonText: 'Ok',
    //         });
    //         setErrorName(true);
    //         setError(true);
    //         return;
    //     } else {
    //         setErrorName(false);
    //     }
    //     if (CP.trim() === '' || !cpRegex.test(CP)) {
    //         setErrorCP(true);
    //         setError(true);
    //         return;
    //     } else {
    //         setErrorCP(false);
    //     }
    //     if (
    //         streetNumber.trim() === '' ||
    //         !addressRegex.test(streetNumber) ||
    //         streetNumber.length > 35
    //     ) {
    //         swal.fire({
    //             title: '!Lo siento!',
    //             text:
    //                 'El texto puede ser hasta 35 letras y números, sin acentos, carácteres especiales (. , & / ñ) o espacio al final; favor de verificar.',
    //             icon: 'error',
    //             confirmButtonText: 'Ok',
    //         });
    //         setErrorStreetNumber(true);
    //         setError(true);
    //         return;
    //     } else {
    //         setErrorStreetNumber(false);
    //     }
    //     if (
    //         neighborhood.trim() === '' ||
    //         !addressRegex.test(neighborhood) ||
    //         neighborhood.length > 35
    //     ) {
    //         swal.fire({
    //             title: '!Lo siento!',
    //             text:
    //                 'El texto puede ser hasta 35 letras y números, sin acentos, carácteres especiales (. , & / ñ) o espacio al final; favor de verificar.',
    //             icon: 'error',
    //             confirmButtonText: 'Ok',
    //         });
    //         setErrorNeighborhood(true);
    //         setError(true);
    //         return;
    //     } else {
    //         setErrorNeighborhood(false);
    //     }
    //     if (country.trim() === '') {
    //         setErrorCountry(true);
    //         setError(true);
    //         return;
    //     } else {
    //         setErrorCountry(false);
    //     }
    //     if (state.value.trim() === '') {
    //         setError(true);
    //         setErrorState(true);
    //         return;
    //     } else {
    //         setErrorState(false);
    //     }
    //     if (placeRef.trim() === '' || placeRef.length > 20) {
    //         swal.fire({
    //             title: '!Lo siento!',
    //             text: 'El texto puede ser hasta 20 letras y números, favor de verificar.',
    //             icon: 'error',
    //             confirmButtonText: 'Ok',
    //         });
    //         setError(true);
    //         setErrorPlaceRef(true);
    //         return;
    //     } else {
    //         setErrorPlaceRef(false);
    //     }
    //     if (phone.trim() === '' || !phoneRegex.test(phone)) {
    //         swal.fire({
    //             title: '!Lo siento!',
    //             text: 'El teléfono debe ser de 10 números,favor de verificar.',
    //             icon: 'error',
    //             confirmButtonText: 'Ok',
    //         });
    //         setErrorPhone(true);
    //         setError(true);
    //         return;
    //     } else {
    //         setErrorPhone(false);
    //     }
    //     if (status !== 'Aprobado') {
    //         setErrorCredits(true);
    //         return;
    //     }
    //     //Si el usuario quiere guardar la dirección se guarda en la colleccion de sender_addresses
    //     if (checkBox) {
    //         const duplicateName = directionData.map((searchName, idx) => {
    //             return searchName.name;
    //         });
    //         if (duplicateName.includes(name)) {
    //             setErrorNameDuplicate(true);
    //             setError(false);
    //             return;
    //         }
    //         setErrorNameDuplicate(false);
    //         setError(false);

    //         const directionsCollectionAdd = db.collection('sender_addresses').add({
    //             name,
    //             codigo_postal: CP,
    //             neighborhood,
    //             country,
    //             state: state.value,
    //             street_number: streetNumber,
    //             place_reference: placeRef,
    //             phone,
    //             ID: user.uid,
    //             creation_date: creationDate.toLocaleDateString(),
    //         });

    //         directionsCollectionAdd
    //             .then(function(docRef) {
    //                 console.log('Document written with ID (origen): ', docRef.id);
    //             })
    //             .catch(function(error) {
    //                 console.error('Error adding document: ', error);
    //             });
    //     }

    //     const directionsGuiasCollectionAdd = db.collection('guia').add({
    //         ID: user.uid,
    //         name: userName,
    //         razon_social: registerSAT,
    //         creation_date: creationDate,
    //         status: 'incomplete',
    //         sender_addresses: {
    //             name,
    //             codigo_postal: CP,
    //             neighborhood,
    //             country,
    //             state: state.value,
    //             street_number: streetNumber,
    //             place_reference: placeRef,
    //             phone,
    //             ID: user.uid,
    //             creation_date: creationDate.toLocaleDateString(),
    //         },
    //         receiver_addresses: {
    //             name: '',
    //             codigo_postal: '',
    //             neighborhood: '',
    //             country: '',
    //             state: '',
    //             street_number: '',
    //             place_reference: '',
    //             phone: '',
    //             ID: '',
    //             creation_date: '',
    //         },
    //         package: {
    //             name: '',
    //             height: '',
    //             width: '',
    //             depth: '',
    //             weight: '',
    //             content_description: '',
    //             quantity: '',
    //             content_value: '',
    //             creation_date: '',
    //         },
    //     });

    //     const searchDuplicate = db.collection('sender_addresses').get();

    //     directionsGuiasCollectionAdd
    //         .then(function(docRef) {
    //             idGuia = docRef.id;
    //             console.log('Se crea y se guarda el id de la guía', idGuia);
    //             onSave({ idGuia });
    //         })
    //         .catch(function(error) {
    //             console.error('Error adding document: ', error);
    //         });
    // };

    const search = e => {
        let keyword = e.target.value;
        setFilter(keyword);
    };

    const tableData = [
        {
            id: 1,
            date: '25/01/2021',
            order: '1234567',
            origen: 'mi casa',
        },
    ];

    return (
        <StyledSendPage>
            <Row className="pb-4 pl-3">
                <h1>Recolecciones</h1>
            </Row>
            <StyledPaneContainer>
                <StyledLeftPane>
                    <h4>Mis direcciones</h4>
                    <Input
                        value={filter}
                        placeholder="Buscar por nombre o calle"
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
                    <h4>Mis recolecciones</h4>
                    <div className="rainbow-flex_wrap">
                        <div style={containerStyles}>
                            <StyledTable
                                data={tableData}
                                pageSize={10}
                                keyField="id"
                                // style={containerTableStyles}
                                emptyTitle="Oh no!"
                                emptyDescription="No hay ningun registro actualmente..."
                                className="direction-table"
                            >
                                <Column header="Fecha" field="date" defaultWidth={105} />
                                <Column
                                    header="No. de Recolección"
                                    field="order"
                                    defaultWidth={85}
                                />
                                <Column header="Origen" field="origen" />
                            </StyledTable>
                        </div>
                    </div>
                </StyledRightPane>
            </StyledPaneContainer>

            <StyledPaneContainer>
                <StyledRightPane>
                    <Row className="">
                        <Col className=" col-12 col-xl-6 boder-right">
                            <h4>Datos de la guía</h4>
                            <div className="rainbow-align-content_center rainbow-flex_wrap">
                                <Select
                                    options={allSuppliers}
                                    id="example-select-2"
                                    style={{ width: '50%' }}
                                    value={selectSupplier}
                                    label="Selecciona la paquetería"
                                    required
                                    onChange={ev => getSupplier(ev.target.value)}
                                    className="rainbow-p-around_medium rainbow-m_auto"
                                />
                                <Input
                                    id="guia"
                                    placeholder="Numero de Guia"
                                    label="Numero de Guia"
                                    disabled={
                                        selectSupplier === 'FEDEX' || selectSupplier === 'REDPACK'
                                            ? false
                                            : true
                                    }
                                    className="rainbow-p-around_medium rainbow-m_auto"
                                    required
                                    // style={{ flex: '1 1' }}
                                    style={{ width: '50%' }}
                                    // value={guide}
                                    onChange={ev => getIdGuia(ev.target.value)}
                                />
                            </div>
                            <h4>Dirección de recolección</h4>
                            <div className="rainbow-align-content_center rainbow-flex_wrap">
                                <Input
                                    id="nombre"
                                    label="Nombre del contacto"
                                    disabled={available ? false : true}
                                    name="nombre"
                                    value={name}
                                    className={`rainbow-p-around_medium ${
                                        errorName ? 'empty-space' : ''
                                    }`}
                                    style={{ width: '70%' }}
                                    onChange={e => setName(e.target.value)}
                                />

                                <Input
                                    id="cp"
                                    label="C.P."
                                    disabled={available ? false : true}
                                    name="cp"
                                    value={CP}
                                    className={`rainbow-p-around_medium ${
                                        errorCP ? 'empty-space' : ''
                                    }`}
                                    style={{ width: '30%' }}
                                    onChange={e => setCP(e.target.value)}
                                />
                            </div>
                            {errorNameDuplicate && (
                                <div className="w-75 pl-4">
                                    <span className="alert-error">
                                        El nombre ya se encuentra registrado
                                    </span>
                                </div>
                            )}
                            {errorCP && (
                                <div className="alert-error pl-4">
                                    CP no validado, favor de verificarlo
                                </div>
                            )}
                            <div className="rainbow-align-content_center rainbow-flex_wrap">
                                <Input
                                    id="domicilio"
                                    label="Nombre de la calle"
                                    disabled={available ? false : true}
                                    name="domicilio"
                                    value={streetName}
                                    className={`rainbow-p-around_medium ${
                                        errorStreetName ? 'empty-space' : ''
                                    }`}
                                    style={{ flex: '1 1' }}
                                    onChange={e => setStreetName(e.target.value)}
                                />
                                <Input
                                    id="domicilio"
                                    label="Número exterior e interior"
                                    disabled={available ? false : true}
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
                                    disabled={available ? false : true}
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
                                    readOnly
                                    label="Ciudad"
                                    name="ciudad"
                                    value={country}
                                    className="rainbow-p-around_medium"
                                    style={{ flex: '1 1' }}
                                    onChange={e => setCountry(e.target.value)}
                                />
                                <Picklist
                                    id="estado"
                                    readOnly
                                    label="Estado"
                                    name="estado"
                                    value={state}
                                    className="rainbow-p-around_medium"
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
                                    disabled={available ? false : true}
                                    name="referencia"
                                    value={placeRef}
                                    className={`rainbow-p-around_medium ${
                                        errorPlaceRef ? 'empty-space' : ''
                                    }`}
                                    style={{ flex: '2 2' }}
                                    onChange={e => setPlaceRef(e.target.value)}
                                />
                                <Input
                                    id="telefono"
                                    label="Telefono"
                                    disabled={available ? false : true}
                                    name="telefono"
                                    value={phone}
                                    className={`rainbow-p-around_medium ${
                                        errorPhone ? 'empty-space' : ''
                                    }`}
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
                            {error && (
                                <div className="alert-error pl-4">Corregir los campos marcados</div>
                            )}
                        </Col>
                        <Col className="col-12 col-xl-6 col-margin">
                            <h4>Información del paquete</h4>
                            {selectSupplier === 'REDPACK' && (
                                <div className="rainbow-align-content_center rainbow-flex_wrap">
                                    <Row className="">
                                        <Col className="">
                                            <Input
                                                id="height"
                                                label="Largo"
                                                name="height"
                                                value={height}
                                                //className={`rainbow-p-around_medium ${errorHeight ? 'empty-space' : ''}`}
                                                className="rainbow-p-around_medium"
                                                // style={{ width: '70%' }}
                                                // style={{ width: '30%' }}
                                                onChange={e => setHeight(e.target.value)}
                                            />
                                        </Col>
                                        <Col className="">
                                            <Input
                                                id="width"
                                                name="width"
                                                label="Ancho"
                                                value={width}
                                                // className={`rainbow-p-around_medium ${
                                                //     errorWidth ? 'empty-space' : ''
                                                // }`}
                                                className="rainbow-p-around_medium"
                                                onChange={e => setWidth(e.target.value)}
                                            />
                                        </Col>
                                        <Col className="">
                                            <Input
                                                id="depth"
                                                name="depth"
                                                label="Alto"
                                                value={depth}
                                                className="rainbow-p-around_medium"
                                                // className={`rainbow-p-around_medium ${
                                                //     errorDepth ? 'empty-space' : ''
                                                // }`}
                                                // style={{ width: '30%' }}
                                                onChange={e => setDepth(e.target.value)}
                                            />
                                        </Col>
                                    </Row>
                                </div>
                            )}

                            <div className="rainbow-align-content_center rainbow-flex_wrap">
                                <Row className="">
                                    <Col className="">
                                        <Input
                                            id="cantidad"
                                            label="Cantidad total"
                                            name="cantidad"
                                            value={quantity}
                                            //className={`rainbow-p-around_medium ${errorQuantity ? 'empty-space' : ''}`}
                                            className="rainbow-p-around_medium"
                                            // style={{ width: '70%' }}
                                            // style={{ width: '30%' }}
                                            onChange={e => setQuantity(e.target.value)}
                                        />
                                    </Col>
                                    <Col className="">
                                        <Input
                                            id="weightT"
                                            label="Peso total"
                                            name="weightT"
                                            value={weightTotal}
                                            //className={`rainbow-p-around_medium ${errorWeightTotal ? 'empty-space' : ''}`}
                                            className="rainbow-p-around_medium"
                                            // style={{ width: '30%' }}
                                            onChange={e => setWeightTotal(e.target.value)}
                                        />
                                    </Col>
                                    <Col className="">
                                        <DatePicker
                                            formatStyle="large"
                                            label="Fecha de recolección"
                                            value={selectDate.date}
                                            // style={{ width: '30%' }}
                                            className="rainbow-p-around_medium"
                                            //onChange={value => searchByDate(value)}
                                        />
                                    </Col>
                                </Row>
                            </div>
                            {/* {errorNameDuplicate && (
                        <div className="w-75 pl-4">
                            <span className="alert-error">El nombre ya se encuentra registrado</span>
                        </div>
                    )}
                    {errorCP && (
                        <div className="alert-error pl-4">CP no validado, favor de verificarlo</div>
                    )} */}
                            <div
                                className="rainbow-align-content_center rainbow-flex_wrap flex-col"
                                style={{}}
                            >
                                <h5>Horario de Recolección</h5>
                                <div className="flex-row">
                                    <TimePicker
                                        value={startHour.time}
                                        label="Desde"
                                        onChange={value => setStartHour({ time: startHour })}
                                        // style={containerStyles}
                                        className="rainbow-p-around_medium rainbow-m_auto"
                                        hour24
                                    />
                                    <TimePicker
                                        value={endHour.time}
                                        label="Hasta"
                                        onChange={value => setEndHour({ time: endHour })}
                                        // style={containerStyles}
                                        className="rainbow-p-around_medium rainbow-m_auto"
                                        hour24
                                    />
                                </div>
                            </div>
                            {/* <div className="rainbow-align-content_center rainbow-flex_wrap">
                                <Input
                                    id="referencia"
                                    label="Observaciones"
                                    name="referencia"
                                    value={placeRef}
                                    className={`rainbow-p-around_medium ${errorPlaceRef ? 'empty-space' : ''}`}
                                    style={{ flex: '2 2' }}
                                    onChange={e => setPlaceRef(e.target.value)}
                                />
                            </div> */}
                            <div className="rainbow-align-content_center rainbow-flex_wrap">
                                <Button
                                    variant="brand"
                                    className="rainbow-m-around_medium"
                                    style={{ width: '100%' }}
                                    //onClick={() => addPicking()}
                                >
                                    Programar recolección
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </StyledRightPane>
            </StyledPaneContainer>
        </StyledSendPage>
    );
};

export default PickingPage;
