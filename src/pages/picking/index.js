import React, { useState, useRef, useEffect } from 'react';
import { useFirebaseApp, useUser } from 'reactfire';
import {
    Input,
    CheckboxToggle,
    Button,
    Picklist,
    Option,
    TimePicker,
    DatePicker,
    TableWithBrowserPagination,
    ActivityTimeline,
    Avatar,
    TimelineMarker,
} from 'react-rainbow-components';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowRight, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
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
const numberRegex = RegExp(/^[0-9]+$/);
const phoneRegex = RegExp(/^[0-9]{10}$/);
const addressRegex = RegExp(/^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/);
const numberWithDecimalRegex = RegExp(/^\d+\.?\d*$/);

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

const styleText = { textAlign: 'center' };

const PickingPage = () => {
    const firebase = useFirebaseApp();
    const db = firebase.firestore();
    const user = useUser();
    let creationDate = new Date();
    let monthInitial = creationDate.getMonth();
    //let monthInitial = (creationDate.getMonth() + 1).toString();
    let dayInitial = creationDate.getDate();
    let nextDay = creationDate.getDate() + 1;
    let yearInitial = creationDate.getFullYear();
    let initialHour = new Date().getHours() + 1;
    if (initialHour > 14) {
        dayInitial = dayInitial + 1;
        // console.log('tomorrow', yearInitial , monthInitial , nextDay);
        creationDate = new Date(yearInitial, monthInitial, nextDay);
        // console.log(creationDate)
        nextDay = nextDay + 1;
        //console.log(nextDay);
        initialHour = 10;
    }
    // console.log('min date ', yearInitial, monthInitial, dayInitial );
    // console.log('max date', yearInitial, monthInitial, nextDay)
    let minDate = new Date(yearInitial, monthInitial, dayInitial);
    let maxDate = new Date(yearInitial, monthInitial, nextDay);
    // console.log(minDate, maxDate);
    const [error, setError] = useState(false);

    const [errorGuide, setErrorGuide] = useState(false);
    const [errorName, setErrorName] = useState(false);
    const [errorNameDuplicate, setErrorNameDuplicate] = useState(false);
    const [errorCP, setErrorCP] = useState(false);
    const [errorStreetName, setErrorStreetName] = useState(false);
    const [errorStreetNumber, setErrorStreetNumber] = useState(false);
    const [errorNeighborhood, setErrorNeighborhood] = useState(false);
    const [errorPlaceRef, setErrorPlaceRef] = useState(false);
    const [errorPhone, setErrorPhone] = useState(false);
    const [errorCredits, setErrorCredits] = useState(false);
    const [errorHeight, setErrorHeight] = useState(false);
    const [errorWidth, setErrorWidth] = useState(false);
    const [errorDepth, setErrorDepth] = useState(false);
    const [errorQuantity, setErrorQuantity] = useState(false);
    const [errorWeightTotal, setErrorWeightTotal] = useState(false);

    const [directionData, setDirectionData] = useState([]);

    const [value, setValue] = useState();
    // const idPickup = useRef(null);
    const idGuide = useRef('');
    const typeSupplier = useRef('');
    const typeCity = useRef('');
    const neighborhoodSel = useRef();
    const errorRepeat = useRef(false);
    const errorRepeatGuide = useRef(false);

    const [filter, setFilter] = useState('');
    const [name, setName] = useState('');
    const [CP, setCP] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [neighborhoodSelect, setNeighborhoodSelect] = useState();
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
    const [selectDate, setSelectDate] = useState({ date: creationDate });
    const [startHour, setStartHour] = useState({ time: initialHour + ':00' });
    const [endHour, setEndHour] = useState({ time: '19:00' });
    const [checkBox, setCheckBox] = useState(true);
    const [available, setAvailable] = useState(false);
    const [pickups, setPickups] = useState([]);
    const [tableData, setTableData] = useState();
    const tokenProd = process.env.REACT_APP_REDPACK_PROD;
    let pickedDirection;
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

    const getIdGuia = e => {
        e.preventDefault();
        setGuide(e.target.value);
        console.log('selectSupplier', selectSupplier);
        idGuide.current = e.target.value;
        console.log(idGuide.current);
        let dataGuia = [];
        if (idGuide.current == '' || !idGuide.current) {
            swal.fire(
                '¡Oh no!',
                'Parece que no hay alguna guía con ese número, podrías revisar',
                'error',
            );
            setErrorGuide(true);
        } else {
            db.collection('guia')
                .where('rastreo', 'array-contains', idGuide.current)
                .get()
                .then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        console.log(doc.data());
                        typeCity.current = doc.data().sender_addresses.country;
                        typeSupplier.current = doc.data().supplierData.cargos.shippingInfo[0];
                        setAvailable(true);
                        setName(doc.data().sender_addresses.name);
                        setCP(doc.data().sender_addresses.codigo_postal);
                        setNeighborhood(doc.data().sender_addresses.neighborhood);
                        setStreetName(doc.data().sender_addresses.street_name);
                        setStreetNumber(doc.data().sender_addresses.street_number);
                        setPlaceRef(doc.data().sender_addresses.place_reference);
                        setPhone(doc.data().sender_addresses.phone);
                        setState({
                            value: doc.data().sender_addresses.state,
                            label: states[doc.data().sender_addresses.state],
                        });
                        setCountry(doc.data().sender_addresses.country);
                        setSelectSupplier(doc.data().supplierData.cargos.shippingInfo[0]);
                        // getDirections(doc.data().sender_addresses.country);
                        setCheckBox(false);
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
    // const getDirections = city => {
    //     let dataAddress = [];
    //     let dataAddressFilter = [];
    //     if (user) {
    //         const reloadDirectios = () => {
    //             db.collection('pickup_addresses')
    //                 .where('ID', '==', user.uid)
    //                 .onSnapshot(function(querySnapshot) {
    //                     querySnapshot.forEach(doc => {
    //                         dataAddress.push({
    //                             id: doc.id,
    //                             city: doc.data().city,
    //                             ...doc.data(),
    //                         });
    //                     });
    //                     //Filtrando Direcciones
    //                     dataAddressFilter = dataAddress.filter(item => item.city.includes(city));
    //                     // setDirectionData(dataAddressFilter);
    //                 });
    //         };
    //         reloadDirectios();
    //     }
    // };

    //verificacion de CP
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
    //                     console.log(data.response);
    //                     // console.log(typeCity.current, 'ciudad guardada');
    //                     // setCountry(data.response.municipio);
    //                     if (data.response.municipio !== typeCity.current) {
    //                         swal.fire({
    //                             title: '!Lo siento!',
    //                             text: 'El código postal, no es de esa ciudad, favor de verificar.',
    //                             icon: 'error',
    //                             confirmButtonText: 'Ok',
    //                         });
    //                         setCP('');
    //                     }
    //                 }
    //             });
    //     }
    // }, [CP]);

    //Se obtienen las direcciones guardadas
    // useEffect(() => {
    //     console.log('use effect');
    //     if (value) {
    //         const docRef = db.collection('pickup_addresses').doc(value);
    //         //Obteniendo la direccion seleccionada
    //         let getOptions = {
    //             source: 'cache',
    //         };
    //         docRef
    //             .get(getOptions)
    //             .then(function(doc) {
    //                 // Document was found in the cache. If no cached document exists,
    //                 // an error will be returned to the 'catch' block below.
    //                 pickedDirection = doc.data();
    //                 //console.log('Cached document data:', pickedDirection);
    //             })
    //             .catch(function(error) {
    //                 console.log('Error getting cached document:', error);
    //             });
    //         docRef
    //             .get()
    //             .then(function(doc) {
    //                 if (doc.exists) {
    //                     setName(doc.data().name);
    //                     setCP(doc.data().codigo_postal);
    //                     setNeighborhood(doc.data().neighborhood);
    //                     setStreetName(doc.data().street_name);
    //                     setStreetNumber(doc.data().street_number);
    //                     setPlaceRef(doc.data().place_reference);
    //                     setPhone(doc.data().phone);
    //                     setCheckBox(false);
    //                 } else {
    //                     console.log('No such document!');
    //                 }
    //             })
    //             .catch(function(error) {
    //                 console.log('Error getting document:', error);
    //             });
    //     }
    // }, [value]);

    //Obteniendo las recolecciones
    useEffect(() => {
        if (user) {
            const reloadDirectios = () => {
                db.collection('pickups')
                    .where('ID', '==', user.uid)
                    .orderBy('pickup_date', 'desc')
                    .onSnapshot(handleDirections);
            };
            reloadDirectios();
        }
    }, []);

    function handleDirections(snapshot) {
        let allPickups = [];
        snapshot.docs.forEach(doc => {
            allPickups.push({
                id: doc.id,
                ...doc.data(),
            });
        });
        setPickups(allPickups);
        setDirectionData(allPickups);
    }

    // useEffect(() => {
    //     setTableData(
    //         pickups.map(pick => {
    //             return {
    //                 id: pick.id,
    //                 date: pick.pickup_date.slice(0, 10),
    //                 order: pick.pickup_id,
    //                 origen: pick.name,
    //                 guide: pick.guide,
    //                 supplier: pick.shipping_company,
    //             };
    //         }),
    //         console.log(pickups),
    //     );
    // }, [pickups]);

    const options = directionData
        .filter(directions => {
            if (filter === null) {
                return directions;
            } else if (directions.name.includes(filter)) {
                return directions;
            }
        })
        .map(directions => {
            // console.log(directions);
            const { id, pickup_date, pickup_id, shipping_company, name } = directions;
            return (
                <TimelineMarker
                    key={id}
                    name={name}
                    label={`Orden: ${pickup_id} , ${shipping_company}`}
                    icon={<FontAwesomeIcon icon={faCheckCircle} />}
                    datetime={pickup_date}
                    description={name}
                />
            );
        });

    const addPicking = () => {
        //console.log('all pickups', pickups, 'cp', CP, 'guia', idGuide.current);
        let date = selectDate.date;
        console.log('date', date);
        let month = (date.getMonth() + 1).toString();
        let day = date.getDate();
        let year = date.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }
        let pickupDate = year + '-' + month + '-' + day;

        //Se validan todos los inputs uno por uno
        if (name.trim() === '' || !addressRegex.test(name)) {
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
        if (neighborhood.trim() === '' || !addressRegex.test(neighborhood)) {
            setErrorNeighborhood(true);
            setError(true);
            return;
        } else {
            setErrorNeighborhood(false);
        }

        if (placeRef.trim() === '') {
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
        if (
            (height.trim() === '' && typeSupplier.current === 'REDPACK') ||
            (!numberRegex.test(height) && typeSupplier.current === 'REDPACK') ||
            (height <= 0 && typeSupplier.current === 'REDPACK')
        ) {
            setErrorHeight(true);
            setError(true);
            return;
        } else {
            setErrorHeight(false);
        }
        if (
            (width.trim() === '' && typeSupplier.current === 'REDPACK') ||
            (!numberRegex.test(width) && typeSupplier.current === 'REDPACK') ||
            (width <= 0 && typeSupplier.current === 'REDPACK')
        ) {
            setErrorWidth(true);
            setError(true);
            return;
        } else {
            setErrorWidth(false);
        }
        if (
            (depth.trim() === '' && typeSupplier.current === 'REDPACK') ||
            (!numberRegex.test(depth) && typeSupplier.current === 'REDPACK') ||
            (depth <= 0 && typeSupplier.current === 'REDPACK')
        ) {
            setErrorDepth(true);
            setError(true);
            return;
        } else {
            setErrorDepth(false);
        }
        if (quantity.trim() === '' || !numberWithDecimalRegex.test(quantity) || quantity <= 0) {
            setErrorQuantity(true);
            setError(true);
            return;
        } else {
            setErrorQuantity(false);
        }
        if (
            weightTotal.trim() === '' ||
            !numberWithDecimalRegex.test(weightTotal) ||
            weightTotal <= 0
        ) {
            setErrorWeightTotal(true);
            setError(true);
            return;
        } else {
            setErrorWeightTotal(false);
        }

        pickups.forEach(doc => {
            console.log(doc.CP, doc.pickup_date, doc.shipping_company);
            if (
                doc.CP === CP &&
                doc.pickup_date === pickupDate &&
                doc.shipping_company === typeSupplier.current
            ) {
                console.log('mismo cp, mismo dia, misma paqueteria');
                // swal.fire({
                //     title: '!Lo siento!',
                //     text:
                //         'Estas haciendo una recolección para el mismo día, paquetería y CP de alguna ya programada',
                //     icon: 'error',
                //     confirmButtonText: 'Ok',
                // });
                errorRepeat.current = true;
            } else {
                errorRepeat.current = false;
                setError(false);
                return;
            }
            if (doc.guide === idGuide.current) {
                console.log('misma guia');
                errorRepeatGuide.current = true;
                // swal.fire({
                //     title: '!Lo siento!',
                //     text: 'Esta guía ya tiene una recolección programada, favor de verificar',
                //     icon: 'error',
                //     confirmButtonText: 'Ok',
                // });
                setErrorGuide(true);
                setError(true);
                return;
            } else {
                errorRepeatGuide.current = false;
                setErrorGuide(false);
                setError(false);
                return;
            }
        });

        if (errorRepeat.current) {
            console.log('una recolección para el mismo día');
            swal.fire({
                title: '!Lo siento!',
                text:
                    'Estas haciendo una recolección para el mismo día, paquetería y CP de alguna ya programada',
                icon: 'error',
                confirmButtonText: 'Ok',
            });
            setError(true);
            return;
        } else {
            errorRepeat.current = false;
            setError(false);
        }
        if (errorRepeatGuide.current) {
            console.log('recolección programada');
            swal.fire({
                title: '!Lo siento!',
                text: 'Esta guía ya tiene una recolección programada, favor de verificar',
                icon: 'error',
                confirmButtonText: 'Ok',
            });
            setErrorGuide(true);
            setError(true);
            return;
        } else {
            errorRepeatGuide.current = false;
            setErrorGuide(false);
            setError(false);
        }
        //Si el usuario quiere guardar la dirección se guarda en la colleccion de pickups_addresses
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

            const directionsCollectionAdd = db.collection('pickup_addresses').add({
                ID: user.uid,
                city: typeCity.current,
                name,
                codigo_postal: CP,
                neighborhood,
                state: state.value,
                street_name: streetName,
                street_number: streetNumber,
                place_reference: placeRef,
                phone,
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

        //Si el proveedor es Redpack se mandan medidas
        console.log('supplier', typeSupplier.current);
        let packSize;
        if (typeSupplier.current === 'REDPACK') {
            packSize = height + 'x' + width + 'x' + depth;
        } else {
            packSize = '-';
        }
        console.log(packSize, 'packSize');

        //Peticion de recoleccion a la API
        let myHeaders = new Headers();
        myHeaders.append('Authorization', tokenProd);
        myHeaders.append('Content-Type', 'application/json');
        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                sender: {
                    contact_name: name,
                    company_name: name,
                    street: streetName,
                    city: typeCity.current,
                    zip_code: CP,
                    neighborhood: neighborhood,
                    country: 'MX',
                    state: state.value,
                    street_number: streetNumber,
                    place_reference: placeRef,
                    phone: phone,
                },
                packages_size: packSize,
                total_packages: quantity,
                total_weight: weightTotal,
                shipping_company: selectSupplier,
                shipping_id: idGuide.current.slice(0, 8),
                pickup_date: pickupDate,
                pickup_time: startHour.time,
                company_close_time: endHour.time,
            }),
            redirect: 'follow',
        };
        const urlRequest = `https://autopaquete.simplestcode.com/api/pickup-shipping/`;
        console.log('url', urlRequest);
        fetch(urlRequest, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result);
                if (result.data.error) {
                    swal.fire({
                        title: '!Lo siento!',
                        text: 'Esta guía ya tiene una recolección programada, favor de verificar',
                        icon: 'error',
                        confirmButtonText: 'Ok',
                    });
                } else if (result.data) {
                    console.log('si hay data');
                    const directionsPickupAdd = db.collection('pickups').add({
                        ID: user.uid,
                        pickup_date: pickupDate,
                        name,
                        guide: idGuide.current,
                        pickup_id: result.data.pickup_id,
                        shipping_company: selectSupplier,
                        CP,
                        streetName,
                        streetNumber,
                        neighborhood,
                        placeRef,
                        phone,
                        quantity,
                        weightTotal,
                        packSize,
                    });
                    directionsPickupAdd
                        .then(function(docRef) {
                            swal.fire('Programada', '', 'success');
                            console.log('recolección exitosa ', docRef.id);
                        })
                        .catch(function(error) {
                            console.error('Error adding document: ', error);
                        });

                    idGuide.current = '';
                    typeCity.current = '';
                    typeSupplier.current = '';
                    setGuide('');
                    setName('');
                    setSelectSupplier('');
                    setCP('');
                    setNeighborhood('');
                    setStreetName('');
                    setStreetNumber('');
                    setCountry('');
                    setState({ label: '', value: '' });
                    setPlaceRef('');
                    setPhone('');
                    setCheckBox(true);
                    setHeight('');
                    setWidth('');
                    setDepth('');
                    setQuantity('');
                    setWeightTotal('');
                    setAvailable(false);
                } else {
                    console.log('lo sentimos ');
                    swal.fire({
                        title: '!Lo siento!',
                        text:
                            'Podrías revisar el día, la hora o contactar a tu asesor para mayor ayuda',
                        icon: 'error',
                        confirmButtonText: 'Ok',
                    });
                }
            })
            .catch(error => {
                console.log('error', error);
                console.log('lo sentimos ');
                swal.fire({
                    title: '!Lo siento!',
                    text:
                        'Podrías revisar el día, la hora o contactar a tu asesor para mayor ayuda',
                    icon: 'error',
                    confirmButtonText: 'Ok',
                });
            });
    };

    // const search = e => {
    //     let keyword = e.target.value;
    //     setFilter(keyword);
    // };

    return (
        <StyledSendPage>
            <Row className="pb-4 pl-3">
                <h1>Recolecciones</h1>
            </Row>
            <StyledPaneContainer>
                <StyledRightPane>
                    <h4>Datos de la guía</h4>
                    <div className="rainbow-align-content_center rainbow-flex_wrap mb-3">
                        <div className="flex-col">
                            <Input
                                id="guia"
                                placeholder="Numero de Guia"
                                label="Numero de Guia"
                                className={`rainbow-p-around_medium ${
                                    errorGuide ? 'empty-space' : ''
                                }`}
                                required
                                onChange={e => getIdGuia(e)}
                                value={guide}
                            />
                            <p className>(primeros 8 dígitos para Redpack)</p>
                        </div>
                        <Input
                            readOnly
                            style={{ width: '50%' }}
                            value={selectSupplier}
                            label="Paquetería"
                            onChange={value => setSelectSupplier(value)}
                            className="rainbow-p-around_medium rainbow-m_auto"
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
                            className={`rainbow-p-around_medium ${errorName ? 'empty-space' : ''}`}
                            style={{ width: '70%' }}
                            onChange={e => setName(e.target.value)}
                        />
                        <Input
                            id="cp"
                            label="C.P."
                            disabled={available ? false : true}
                            name="cp"
                            value={CP}
                            className={`rainbow-p-around_medium ${errorCP ? 'empty-space' : ''}`}
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
                    <div className="rainbow-align-content_center rainbow-flex_wrap">
                        <Input
                            id="domicilio-name"
                            label="Nombre de la calle"
                            disabled={available ? false : true}
                            name="domicilio"
                            value={streetName}
                            className={`rainbow-p-around_medium ${
                                errorStreetName ? 'empty-space' : ''
                            }`}
                            style={{ width: '40%' }}
                            onChange={e => setStreetName(e.target.value)}
                        />
                        <Input
                            id="domicilio-number"
                            label="Número"
                            disabled={available ? false : true}
                            name="domicilio"
                            value={streetNumber}
                            className={`rainbow-p-around_medium ${
                                errorStreetNumber ? 'empty-space' : ''
                            }`}
                            style={{ width: '20%' }}
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
                            style={{ width: '40%' }}
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
                    <div className="rainbow-align-content_center rainbow-flex_wrap mb-3">
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
                            className={`rainbow-p-around_medium ${errorPhone ? 'empty-space' : ''}`}
                            style={{ flex: '2 2' }}
                            onChange={e => setPhone(e.target.value)}
                        />
                        {/* <div style={{ flex: '1 1', textAlign: 'right' }}>
                            <CheckboxToggle
                                id="guardar"
                                label="Guardar"
                                value={checkBox}
                                onChange={e => setCheckBox(e.target.checked)}
                            />
                        </div> */}
                    </div>
                    {errorCredits && (
                        <div className="alert-error pl-4">
                            Es necesario tener un estatus aprobatorio para relizar envíos
                        </div>
                    )}
                    {error && <div className="alert-error pl-4">Corregir los campos marcados</div>}
                    <h4>Información del paquete</h4>
                    {selectSupplier === 'REDPACK' && (
                        <div className="rainbow-align-content_center rainbow-flex_wrap">
                            <Row className="flex-row">
                                <Col className="p-0">
                                    <Input
                                        id="height"
                                        label="Largo"
                                        name="height"
                                        value={height}
                                        className={`rainbow-p-around_medium ${
                                            errorHeight ? 'empty-space' : ''
                                        }`}
                                        onChange={e => setHeight(e.target.value)}
                                    />
                                </Col>
                                <Col className="p-0">
                                    <Input
                                        id="width"
                                        name="width"
                                        label="Ancho"
                                        value={width}
                                        className={`rainbow-p-around_medium ${
                                            errorWidth ? 'empty-space' : ''
                                        }`}
                                        className="rainbow-p-around_medium"
                                        onChange={e => setWidth(e.target.value)}
                                    />
                                </Col>
                                <Col className="p-0">
                                    <Input
                                        id="depth"
                                        name="depth"
                                        label="Alto"
                                        value={depth}
                                        className={`rainbow-p-around_medium ${
                                            errorDepth ? 'empty-space' : ''
                                        }`}
                                        onChange={e => setDepth(e.target.value)}
                                    />
                                </Col>
                            </Row>
                        </div>
                    )}
                    <div className="rainbow-align-content_center rainbow-flex_wrap">
                        <Input
                            id="cantidad"
                            label="Cantidad total"
                            name="cantidad"
                            value={quantity}
                            disabled={available ? false : true}
                            className={`rainbow-p-around_medium ${
                                errorQuantity ? 'empty-space' : ''
                            }`}
                            style={{ width: '30%' }}
                            onChange={e => setQuantity(e.target.value)}
                        />
                        <Input
                            id="weightT"
                            label="Peso total"
                            name="weightT"
                            value={weightTotal}
                            disabled={available ? false : true}
                            className={`rainbow-p-around_medium ${
                                errorWeightTotal ? 'empty-space' : ''
                            }`}
                            style={{ width: '30%' }}
                            onChange={e => setWeightTotal(e.target.value)}
                        />
                        <DatePicker
                            formatStyle="large"
                            label="Fecha de recolección"
                            value={selectDate.date}
                            minDate={minDate}
                            maxDate={maxDate}
                            className="rainbow-p-around_medium"
                            style={{ width: '40%' }}
                            onChange={value => setSelectDate({ date: value })}
                        />
                    </div>
                    <div className="rainbow-align-content_center rainbow-flex_wrap">
                        {/* <h5>Horario de Recolección</h5> */}
                        <div className="flex-row">
                            <TimePicker
                                value={startHour.time}
                                label="Desde"
                                onChange={value => setStartHour({ time: value })}
                                className="rainbow-p-around_medium rainbow-m_auto"
                                hour24
                            />
                            <TimePicker
                                value={endHour.time}
                                label="Hasta"
                                onChange={value => setEndHour({ time: value })}
                                className="rainbow-p-around_medium rainbow-m_auto"
                                hour24
                            />
                        </div>
                    </div>
                    {error && <div className="alert-error pl-4">Corregir los campos marcados</div>}
                    <div className="rainbow-align-content_center rainbow-flex_wrap">
                        <Button
                            variant="brand"
                            className="rainbow-m-around_medium"
                            style={{ width: '100%' }}
                            disabled={available ? false : true}
                            onClick={() => addPicking()}
                        >
                            Programar recolección
                        </Button>
                    </div>
                </StyledRightPane>
                <StyledLeftPane>
                    <h4 className="mb-4">Mis recolecciones</h4>
                    <div className="timeline">
                        <ActivityTimeline>{options}</ActivityTimeline>
                    </div>
                </StyledLeftPane>
            </StyledPaneContainer>
            <Row className="justify-content-md-center mt-4 ">
                <p className="p-text" style={styleText}>
                    Toma en cuenta que la hora de inicio máxima para la recolección el mismo día es
                    a las 2:00 pm ( varia en cada ciudad), después de este horario se programará
                    para el día siguiente
                </p>
                <p className="p-text" style={styleText}>
                    Las recolecciones en sábado tienen un costo extra de $220 SÓLO en Fedex
                </p>
            </Row>
        </StyledSendPage>
    );
};

export default PickingPage;
