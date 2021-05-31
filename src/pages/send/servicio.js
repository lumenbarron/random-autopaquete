import React, { useState, useEffect, useRef } from 'react';
import PropTypes, { element } from 'prop-types';
import { Card, Button, Spinner } from 'react-rainbow-components';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useUser, useFirebaseApp } from 'reactfire';
import formatMoney from 'accounting-js/lib/formatMoney';
import toFixed from 'accounting-js/lib/toFixed';
import axios from 'axios';
import {
    StyledPaneContainer,
    StyledDirectiosDetails,
    StyledDetails,
    StyledError,
    DownloadContainer,
} from './styled';
import { Row } from 'react-bootstrap';

const PriceContainer = styled.div`
    display: flex;
    margin-bottom: 0.5rem;
    flex-direction: row;
    width: 50%;
    min-width: 170px;
    font-size: 0.75rem;
    color: #000;
`;

const PriceLabel = styled.div`
    display: flex;
    flex-basis: 100%;
    font-weight: bold;
`;

const PriceNumber = styled.div`
    text-align: right;
`;

export const ServicioComponent = ({ onSave, idGuiaGlobal }) => {
    const [hasActivatedSuppliers, setHasActivatedSuppliers] = useState(null);
    const [supplierAvailability, setSupplierAvailability] = useState(false);
    const [supplierAvailabilityGeneral, setSupplierAvailabilityGeneral] = useState(false);
    const [supplierAvailabilityDelivery, setSupplierAvailabilityDelivery] = useState(false);
    const [supplierExtraWeight, setSupplierExtraWeight] = useState(true);

    const [supplierCostFedexDiaS, setSupplierCostFedexDiaS] = useState(false);
    const [supplierCostFedexEcon, setSupplierCostFedexEcon] = useState(false);

    const [supplierCostEstafetaDiaS, setSupplierCostEstafetaDiaS] = useState(false);
    const [supplierCostEstafetaEcon, setSupplierCostEstafetaEcon] = useState(false);

    const [supplierCostRedpackEx, setSupplierCostRedpackEx] = useState(false);
    const [supplierCostRedpackEco, setSupplierCostRedpackEco] = useState(false);

    const [supplierCostAutoencargosEcon, setSupplierCostAutoencargosEcon] = useState(false);

    const user = useUser();
    const firebase = useFirebaseApp();
    const db = firebase.firestore();
    const history = useHistory();

    // Sender states
    const [nameSender, setNameSender] = useState();
    const [CPSender, setCPSender] = useState('');
    const getCPSender = useRef('');
    const cpsAvailabilityAutoencargos = useRef(false);
    const cpsAvailabilityZEAutoencargos = useRef(false);
    const [neighborhoodSender, setNeighborhoodSender] = useState('');
    const [countrySender, setCountrySender] = useState('');
    const [streetNumberSender, setStreetNumberSender] = useState('');
    const [streetNameSender, setStreetNameSender] = useState('');
    const [phoneSender, setPhoneSender] = useState('');
    // Receiver states
    const [nameReceiver, setNameReceiver] = useState();
    const [CPReceiver, setCPReceiver] = useState('');
    const getCPReceiver = useRef('');
    const [neighborhoodReceiver, setNeighborhoodReceiver] = useState('');
    const [countryReceiver, setCountryReceiver] = useState('');
    const [streetNumberReceiver, setStreetNumberReceiver] = useState('');
    const [streetNameReceiver, setStreetNameReceiver] = useState('');
    const [phoneReceiver, setPhoneReceiver] = useState('');
    // Package information
    const [namePackage, setNamePackage] = useState('');
    const [height, setHeight] = useState('');
    const [width, setWidth] = useState('');
    const [depth, setDepth] = useState('');
    const [weight, setWeight] = useState('');
    const [realWeight, setRealWeight] = useState('');
    const [finalWeight, setFinalWeight] = useState('');
    const getFinalWeight = useRef('');
    const [quantity, setQuantity] = useState('');
    const [contentValue, setContentValue] = useState('');
    const [error, setError] = useState(false);
    const [defaultSupplier, setDefaultSupplier] = useState();

    const [profileDoc, setProfileDoc] = useState(false);

    let dataShipping = useRef();
    let delivery_company = useRef();
    const allRatesData = useRef([]);
    let supplierExtendedArea = {};
    let supplierExtendedAreaUs = {};
    let supplierAvailabilityGeneralUs = [];
    let supplierDelivery = {};
    let supplierShippingName = {};
    let supplerFedex = false;
    let supplierRedpack = false;
    let supplierEstafeta = false;
    const tokenSand = process.env.REACT_APP_REDPACK_SAND;
    const tokenProd = process.env.REACT_APP_REDPACK_PROD;
    const sepomex = process.env.REACT_APP_SEPOMEX;

    let OtherCpsZMG = [
        '44009',
        '44228',
        '44229',
        '44638',
        '44639',
        '44659',
        '45013',
        '45206',
        '45207',
        '45414',
        '45416',
        '45419',
        '45640',
        '45643',
        '45645',
        '45647',
    ];

    let notCoverCpsZMG = [
        '45220',
        '45221',
        '45226',
        '45242',
        '45245',
        '45415',
        '45424',
        '45426',
        '45427',
        '45428',
        '45429',
        '45626',
        '45627',
    ];

    let extendedAreaAE = ['45646', '45200', '45650', '45654', '45655', '45656', '45680'];

    const registerService = (supplier, type, { id, precio, ...cargos }) => {
        const precioNeto = precio * 1.16;
        db.collection('profiles')
            .where('ID', '==', user.uid)
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    if (parseFloat(precioNeto) > parseFloat(doc.data().saldo)) {
                        setError(true);
                    } else {
                        const newBalance = Math.round(
                            parseFloat(doc.data().saldo) - parseFloat(precioNeto),
                        );
                        if (newBalance < 0) {
                            return false;
                        }
                        addSupplier(supplier, type, { id, precioNeto, ...cargos });
                    }
                    if (supplier === 'autoencargos') {
                        addRastreoAuto(idGuiaGlobal);
                    }
                });
            })
            .catch(function(error) {
                console.log('Error getting documents: ', error);
            });
    };

    const addSupplier = (supplier, type, { id, precioNeto, ...cargos }) => {
        db.collection('profiles')
            .where('ID', '==', user.uid)
            .get()
            .then(profile => {
                profile.docs[0].ref
                    .collection('rate')
                    .doc(id)
                    .get()
                    .then(doc => {
                        setError(false);
                        const tarifa = doc.data();
                        // console.log(tarifa);
                        const supplierData = {
                            ID: user.uid,
                            Supplier: `${supplier}${type}`,
                            Supplier_cost: toFixed(precioNeto, 2),
                            tarifa,
                            cargos,
                            FinalWeight: getFinalWeight.current,
                        };
                        // console.log(supplierData);
                        onSave(supplierData);
                    });
            });
    };

    const saveService = (supplier, type, { id, precio, ...cargos }) => {
        const precioNeto = precio * 1.16;
        let supplierData;

        db.collection('profiles')
            .where('ID', '==', user.uid)
            .get()
            .then(profile => {
                profile.docs[0].ref
                    .collection('rate')
                    .doc(id)
                    .get()
                    .then(doc => {
                        setError(false);
                        const tarifa = doc.data();
                        supplierData = {
                            ID: user.uid,
                            Supplier: `${supplier}${type}`,
                            Supplier_cost: toFixed(precioNeto, 2),
                            tarifa,
                            cargos,
                            FinalWeight: getFinalWeight.current,
                        };
                        console.log(supplierData);

                        db.collection('guia')
                            .doc(idGuiaGlobal)
                            .update({ status: 'orden', supplierData })
                            .then(() => {
                                console.log('Document written with ID: ');
                                console.log(idGuiaGlobal, 'idGuiaGlobal');
                                history.push('/mi-cuenta/ordenes');
                            });
                    });
            });
    };

    const addRastreoAuto = idGuiaGlobal => {
        let guiaAutoencargos = Math.floor(Math.random() * 1000000).toString();
        db.collection('guia')
            .doc(idGuiaGlobal)
            .update({ rastreo: [guiaAutoencargos] });
    };

    useEffect(() => {
        //Asignando los valores desde el doc guia del firestore
        db.collection('guia')
            .doc(idGuiaGlobal)
            .onSnapshot(function getGuia(doc) {
                //console.log('Document data 1:', doc.data());
                // Get snapshot sender information
                setNameSender(doc.data().sender_addresses.name);
                setCPSender(doc.data().sender_addresses.codigo_postal);
                getCPSender.current = doc.data().sender_addresses.codigo_postal;
                setNeighborhoodSender(doc.data().sender_addresses.neighborhood);
                setCountrySender(doc.data().sender_addresses.country);
                setStreetNameSender(doc.data().sender_addresses.street_name);
                setStreetNumberSender(doc.data().sender_addresses.street_number);
                setPhoneSender(doc.data().sender_addresses.phone);
                // Get snapshot to receive Receiver information
                setNameReceiver(doc.data().receiver_addresses.name);
                setCPReceiver(doc.data().receiver_addresses.codigo_postal);
                getCPReceiver.current = doc.data().receiver_addresses.codigo_postal;
                setNeighborhoodReceiver(doc.data().receiver_addresses.neighborhood);
                setCountryReceiver(doc.data().receiver_addresses.country);
                setStreetNameReceiver(doc.data().receiver_addresses.street_name);
                setStreetNumberReceiver(doc.data().receiver_addresses.street_number);
                setPhoneReceiver(doc.data().receiver_addresses.phone);
                // Get snapshot to receive package information
                if (doc.data().package) {
                    setNamePackage(doc.data().package.name);
                    setHeight(doc.data().package.height);
                    setWidth(doc.data().package.width);
                    setDepth(doc.data().package.depth);
                    setWeight(doc.data().package.weight);
                    setRealWeight(doc.data().package.realWeight);
                    setQuantity(doc.data().package.quantity);
                    setContentValue(doc.data().package.content_value);
                    setDefaultSupplier(doc.data().package.defaultSupplier);
                }
            });
    }, []);

    useEffect(() => {
        //Si el código postal coincide con los códigos postales de Autoencargos se agrega al supplierAvailability
        // console.log('corroborando codigo para autoencargos, segundo use effect');
        Promise.all([
            fetch(
                `https://api-sepomex.hckdrk.mx/query/search_cp_advanced/Jalisco?municipio=Guadalajara&token=${sepomex}`,
            ),
            fetch(
                `https://api-sepomex.hckdrk.mx/query/search_cp_advanced/Jalisco?municipio=Zapopan&token=${sepomex}`,
            ),
            fetch(
                `https://api-sepomex.hckdrk.mx/query/search_cp_advanced/Jalisco?municipio=Tonalá&token=${sepomex}`,
            ),
            fetch(
                `https://api-sepomex.hckdrk.mx/query/search_cp_advanced/Jalisco?municipio=San Pedro Tlaquepaque&token=${sepomex}`,
            ),
        ])
            .then(([res1, res2, res3, res4]) =>
                Promise.all([res1.json(), res2.json(), res3.json(), res4.json()]),
            )
            .then(result => {
                let resultZMG = result.map(element => element.response.cp).flat();
                let allZMG = [...resultZMG, ...OtherCpsZMG];
                let allCpsZMG = allZMG.filter(item => {
                    return !notCoverCpsZMG.includes(item);
                });
                // console.log( getCPReceiver.current ,CPReceiver)
                let cpSender = allCpsZMG.includes(getCPSender.current);
                let cpReceiver = allCpsZMG.includes(getCPReceiver.current);
                let cpSenderExt = extendedAreaAE.includes(getCPSender.current);
                let cpReceiverExt = extendedAreaAE.includes(getCPReceiver.current);

                //console.log(cpReceiverExt, cpSenderExt, cpReceiver, cpSender);
                if (
                    (cpReceiverExt === true && cpSender === true) ||
                    (cpReceiver === true && cpSenderExt === true) ||
                    (cpReceiverExt === true && cpSenderExt === true)
                ) {
                    console.log('codigos postales ZE ZMG');
                    cpsAvailabilityAutoencargos.current = true;
                    cpsAvailabilityZEAutoencargos.current = true;
                } else if (cpReceiver === true && cpSender === true) {
                    console.log('codigos postales ZMG');
                    cpsAvailabilityAutoencargos.current = true;
                    cpsAvailabilityZEAutoencargos.current = false;
                } else {
                    console.log('codigos no postales ZMG');
                    cpsAvailabilityAutoencargos.current = false;
                }
            })
            .catch(err => console.log('error', err));
    }, []);

    useEffect(() => {
        //Se extraen los provedores de la colecccion rate del perfil del usuario
        const getRates = async () => {
            await db
                .collection('profiles')
                .where('ID', '==', user.uid)
                .get()
                .then(profile => {
                    setProfileDoc(profile.docs[0]);
                    profile.docs[0].ref.collection('rate').onSnapshot(querySnapshot => {
                        querySnapshot.forEach(doc => {
                            //allRates asigna todos las tairfas que tiene el usario
                            allRatesData.current.push(doc.data());
                        });
                        setHasActivatedSuppliers(querySnapshot.size > 0);
                    });
                });
        };
        getRates();
    }, [user]);

    useEffect(() => {
        if (defaultSupplier || defaultSupplier === '') {
            console.log('defaultSupplier', defaultSupplier);
            getDataGuia(defaultSupplier);
        }
    }, [defaultSupplier]);

    const getDataGuia = async supplier => {
        await db
            .collection('guia')
            .doc(idGuiaGlobal)
            .get()
            .then(function(doc) {
                if (doc.exists) {
                    //console.log('Document data:', doc.data());
                    dataShipping.current = JSON.stringify({
                        sender: {
                            contact_name: doc.data().sender_addresses.name,
                            company_name: doc.data().sender_addresses.name,
                            street: doc.data().sender_addresses.street_name,
                            zip_code: doc.data().sender_addresses.codigo_postal,
                            neighborhood: doc.data().sender_addresses.neighborhood,
                            city: doc.data().sender_addresses.country,
                            country: 'MX',
                            state: doc.data().sender_addresses.state,
                            street_number: doc.data().sender_addresses.street_number,
                            place_reference: doc.data().sender_addresses.place_reference,
                            phone: doc.data().sender_addresses.phone,
                        },
                        receiver: {
                            contact_name: doc.data().receiver_addresses.name,
                            company_name: doc.data().receiver_addresses.name,
                            street: doc.data().receiver_addresses.street_name,
                            zip_code: doc.data().receiver_addresses.codigo_postal,
                            neighborhood: doc.data().receiver_addresses.neighborhood,
                            city: doc.data().receiver_addresses.country,
                            country: 'MX',
                            state: doc.data().receiver_addresses.state,
                            street_number: doc.data().receiver_addresses.street_number,
                            place_reference: doc.data().receiver_addresses.place_reference,
                            phone: doc.data().receiver_addresses.phone,
                        },
                        packages: [
                            {
                                name:
                                    doc.data().package.name != ''
                                        ? doc.data().package.name
                                        : 'estandar',
                                height:
                                    doc.data().package.height != '' ? doc.data().package.height : 1,
                                width:
                                    doc.data().package.width != '' ? doc.data().package.width : 1,
                                depth:
                                    doc.data().package.depth != '' ? doc.data().package.depth : 1,
                                weight:
                                    doc.data().package.weight != '' ? doc.data().package.weight : 1,
                                content_description:
                                    doc.data().package.content_description != ''
                                        ? doc.data().package.content_description
                                        : 's-d',
                                quantity:
                                    doc.data().package.quantity != ''
                                        ? doc.data().package.quantity
                                        : 1,
                            },
                        ],
                    });
                    fetchApiFedex(dataShipping.current, supplier);
                } else {
                    console.log('Error getting document:', error);
                }
            });
    };

    const fetchApiFedex = (data, supplier) => {
        //console.log('peticion a la API estafeta');
        user.getIdToken().then(idToken => {
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'json';
            xhr.contentType = 'application/json';
            xhr.open('POST', '/guia/cotizar');
            //xhr.open(
            //'POST',
            //'https://cors-anywhere.herokuapp.com/https://us-central1-autopaquete-92c1b.cloudfunctions.net/cotizarGuia',
            //);
            xhr.setRequestHeader('Authorization', `Bearer ${idToken}`);
            xhr.send(JSON.stringify({ guiaId: idGuiaGlobal }));
            xhr.onreadystatechange = () => {
                // console.log('la wea weona', xhr.readyState);
                if (xhr.readyState === 4) {
                    console.log(xhr.response);
                    supplierExtendedAreaUs = xhr.response;
                    //supplierAvailabilityGeneralUs = xhr.response;
                    fetchGuia(data, supplier);
                }
            };
        });
    };

    const fetchGuia = async (data, supplier) => {
        let suppliersGeneral;
        let myHeaders = new Headers();
        myHeaders.append('Authorization', tokenProd);
        myHeaders.append('Content-Type', 'application/json');
        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: data,
            redirect: 'follow',
        };
        console.log(supplier);

        if (supplier === 'autoencargos') {
            supplier = 'fedex';
        }

        const urlRequest = `https://autopaquete.simplestcode.com/api/do-shipping-quote/${supplier}`;
        console.log('url', urlRequest);

        fetch(urlRequest, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result);
                if (result.length >= 1) {
                    suppliersGeneral = result;
                    if (
                        cpsAvailabilityAutoencargos.current === true &&
                        cpsAvailabilityZEAutoencargos.current === false
                    ) {
                        console.log('aqui si hay autoencargos');
                        let autoencargos = {
                            shipping_company: 'AUTOENCARGOS',
                            shipping_cost: 90.0,
                            shipping_service: {
                                name: 'AUTOENCARGOS',
                                description: 'ESTANDAR',
                                id: 5,
                            },
                            extended_area: false,
                            extended_area_estimate_cost: {},
                        };
                        suppliersGeneral.push(autoencargos);
                    }
                    if (
                        cpsAvailabilityAutoencargos.current === true &&
                        cpsAvailabilityZEAutoencargos.current === true
                    ) {
                        console.log('aqui si hay autoencargos con zona extendida');
                        let autoencargos = {
                            shipping_company: 'AUTOENCARGOS',
                            shipping_cost: 90.0,
                            shipping_service: {
                                name: 'AUTOENCARGOS',
                                description: 'ESTANDAR',
                                id: 5,
                            },
                            extended_area: true,
                            extended_area_estimate_cost: {},
                        };
                        suppliersGeneral.push(autoencargos);
                    } else {
                        //console.log('aqui no hay autoencargos');
                    }
                    //Se hace un nuevo array con la respuesta de la API para ver si hay zona extendida
                    suppliersGeneral.forEach(element => {
                        supplierExtendedArea[element.shipping_service.name] = true;
                        if (element.extended_area === true) {
                            supplierExtendedArea[element.shipping_service.name] = {
                                zonaExtendida: element.extended_area,
                            };
                        }
                    });
                    setSupplierAvailability({ ...supplierExtendedArea, ...supplierExtendedAreaUs });

                    //Se hace un array para ver el tipo de delivery
                    suppliersGeneral.forEach(element => {
                        if (element.delivery_type !== undefined) {
                            supplierDelivery[element.shipping_service.name] = [
                                element.delivery_type,
                            ];
                        }
                    });
                    console.log('delivey', supplierDelivery);
                    setSupplierAvailabilityDelivery(supplierDelivery);

                    suppliersGeneral.forEach(element => {
                        supplierShippingName[element.shipping_service.name] = [
                            element.shipping_company,
                            element.shipping_service.name,
                            element.shipping_service.description,
                            element.shipping_service.id,
                        ];
                    });
                    setSupplierAvailabilityGeneral(supplierShippingName);
                }
            })
            .catch(error => console.log('error', error));
    };

    useEffect(() => {
        if (weight === '') return;
        if (!supplierAvailability || !profileDoc) return;

        //Validaciones del peso
        let pricedWeight = Math.ceil(weight);
        //Si el peso es mayor a uno, se le asigna su peso, en otro caso se le asigna 1
        pricedWeight = pricedWeight > 1 ? pricedWeight : 1;
        const volumetricWeight = Math.ceil((height * width * depth) / 5000);

        if (volumetricWeight > weight) {
            // console.log('el peso volumetrico es mayor que el peso declarado');
            pricedWeight = volumetricWeight;
            // console.log('pricedWeight', pricedWeight);
            setFinalWeight(pricedWeight);
            getFinalWeight.current = pricedWeight;
        } else {
            setFinalWeight(pricedWeight);
            getFinalWeight.current = pricedWeight;
            // console.log('pricedWeight', pricedWeight);
        }

        //Validaciones de valor asegurado
        const getInsurancePrice = company => {
            if (contentValue === '') return 0;
            const baseValue = parseInt(contentValue, 10) * 0.02;
            // console.log('valor asegurado ', baseValue);
            const extraValue = 40;
            if (company === 'autoencargos' && baseValue > 0) {
                return Math.max(baseValue, 20);
            } else if (company !== 'autoencargos' && baseValue > 0) {
                return Math.max(baseValue, 20) + extraValue;
            }
            return 0;
        };

        //Validaciones de zona extendida
        let extendedAreaEstafetaDiaS = 0;
        let extendedAreaEstafetaEco = 0;
        let extendedAreaFedexDiaS = 0;
        let extendedAreaFedexEco = 0;
        let extendedAreaRedpackExp = 0;
        let extendedAreaRedpackEco = 0;
        let extendedAreaAutoencargos = 0;

        if (typeof supplierAvailability.NACIONALDIASIGUIENTE !== 'undefined') {
            extendedAreaFedexDiaS =
                typeof supplierAvailability.NACIONALDIASIGUIENTE.zonaExtendida !== 'undefined'
                    ? 150
                    : 0;
        } else {
            // console.log('no zona extendida extendedAreaFedexDiaS');
        }
        if (typeof supplierAvailability.NACIONALECONOMICO !== 'undefined') {
            extendedAreaFedexEco =
                typeof supplierAvailability.NACIONALECONOMICO.zonaExtendida !== 'undefined'
                    ? 150
                    : 0;
        } else {
            // console.log('no zona extendida extendedAreaFedexEco');
        }
        if (typeof supplierAvailability.EXPRESS !== 'undefined') {
            extendedAreaRedpackExp =
                typeof supplierAvailability.EXPRESS.zonaExtendida !== 'undefined' ? 130 : 0;
        } else {
            // console.log('no zona extendida extendedAreaRedpackExp');
        }
        if (typeof supplierAvailability.ECOEXPRESS !== 'undefined') {
            extendedAreaRedpackEco =
                typeof supplierAvailability.ECOEXPRESS.zonaExtendida !== 'undefined' ? 130 : 0;
        } else {
            // console.log('no zona extendida extendedAreaRedpackEco');
        }
        if (typeof supplierAvailability.estafetaEconomico !== 'undefined') {
            extendedAreaEstafetaEco =
                typeof supplierAvailability.estafetaEconomico.zonaExtendida !== 'undefined'
                    ? 110
                    : 0;
        } else {
            //console.log('no zona extendida extendedAreaEstafetaEco');
        }
        if (typeof supplierAvailability.estafetaDiaSiguiente !== 'undefined') {
            extendedAreaEstafetaDiaS =
                typeof supplierAvailability.estafetaDiaSiguiente.zonaExtendida !== 'undefined'
                    ? 110
                    : 0;
        } else {
            //console.log('no zona extendida extendedAreaEstafetaDiaS');
        }
        if (typeof supplierAvailability.AUTOENCARGOS !== 'undefined') {
            extendedAreaAutoencargos =
                typeof supplierAvailability.AUTOENCARGOS.zonaExtendida !== 'undefined' ? 40 : 0;
        } else {
            // console.log('no zona extendida extendedAreaRedpackEco');
        }

        let getFinalPriceEstafetaDiaS = { finalPrice: 0, supplier: 'estafetaDiaSiguiente' };
        let getFinalPriceEstafetaEco = { finalPrice: 0, supplier: 'estafetaEconomico' };
        let getFinalPriceFedexDiaS = { finalPrice: 0, supplier: 'fedexDiaSiguiente' };
        let getFinalPriceFedexEco = { finalPrice: 0, supplier: 'fedexEconomico' };
        let getFinalPriceRedExp = { finalPrice: 0, supplier: 'redpackExpress' };
        let getFinalPriceRedEco = { finalPrice: 0, supplier: 'redpackEcoExpress' };
        let getFinalPriceAuto = { finalPrice: 0, supplier: 'autoencargos' };

        profileDoc.ref
            .collection('rate')
            .orderBy('max', 'desc')
            .onSnapshot(querySnapshot => {
                const segundaMejorTarifa = {};
                const kgsExtraTarifas = {};
                let precioTotal;
                querySnapshot.forEach(doc => {
                    // console.log(doc.data());
                    const { entrega, precio, max, min, kgExtra } = doc.data();

                    // Encontramos si hay tarifas que apliquen directo al paquete
                    if (
                        !kgExtra &&
                        parseInt(min, 10) <= parseInt(pricedWeight, 10) &&
                        parseInt(max, 10) >= parseInt(pricedWeight, 10)
                    ) {
                        // console.log('Encontramos si hay tarifas que apliquen directo al paquete');
                        if (entrega === 'estafetaDiaSiguiente') {
                            getFinalPriceEstafetaDiaS.finalPrice = parseInt(precio, 10);
                        }
                        if (entrega === 'estafetaEconomico') {
                            getFinalPriceEstafetaEco.finalPrice = parseInt(precio, 10);
                        }
                        if (entrega === 'fedexDiaSiguiente') {
                            getFinalPriceFedexDiaS.finalPrice = parseInt(precio, 10);
                        }
                        if (entrega === 'fedexEconomico') {
                            getFinalPriceFedexEco.finalPrice = parseInt(precio, 10);
                        }
                        if (entrega === 'redpackExpress') {
                            getFinalPriceRedExp.finalPrice = parseInt(precio, 10);
                        }
                        if (entrega === 'redpackEcoExpress') {
                            getFinalPriceRedEco.finalPrice = parseInt(precio, 10);
                        }
                        if (entrega === 'autoencargos') {
                            getFinalPriceAuto.finalPrice = parseInt(precio, 10);
                        }

                        let cargoExtraHeight;
                        if (parseInt(height, 10) > 100 && entrega === 'redpackEcoExpress') {
                            cargoExtraHeight = 210;
                        } else if (parseInt(height, 10) > 120 && entrega === 'fedexDiaSiguiente') {
                            cargoExtraHeight = 280;
                        } else if (parseInt(height, 10) > 120 && entrega === 'fedexEconomico') {
                            cargoExtraHeight = 110;
                        } else {
                            cargoExtraHeight = 0;
                        }

                        if (entrega === 'estafetaDiaSiguiente')
                            setSupplierCostEstafetaDiaS({
                                id: doc.id,
                                precio:
                                    getFinalPriceEstafetaDiaS.finalPrice +
                                    getInsurancePrice('estafetaDiaSiguiente') +
                                    extendedAreaEstafetaDiaS +
                                    cargoExtraHeight,
                                delivery: '',
                                cargoExtraHeight: cargoExtraHeight,
                                guia: getFinalPriceEstafetaDiaS.finalPrice,
                                zonaExt: extendedAreaEstafetaDiaS != 0 ? 110 : false,
                                shippingInfo: !supplierAvailabilityGeneral.ESTAFETADIASIGUIENTE
                                    ? false
                                    : supplierAvailabilityGeneral.ESTAFETADIASIGUIENTE,
                                insurance: getInsurancePrice('estafetaDiaSiguiente'),
                            });
                        if (entrega === 'estafetaEconomico')
                            setSupplierCostEstafetaEcon({
                                id: doc.id,
                                precio:
                                    getFinalPriceEstafetaEco.finalPrice +
                                    getInsurancePrice('estafetaEconomico') +
                                    extendedAreaEstafetaEco +
                                    cargoExtraHeight,
                                delivery: '',
                                cargoExtraHeight: cargoExtraHeight,
                                guia: getFinalPriceEstafetaEco.finalPrice,
                                zonaExt: extendedAreaEstafetaEco != 0 ? 110 : false,
                                shippingInfo: !supplierAvailabilityGeneral.ESTAFETATERRESTRECONSUMO
                                    ? false
                                    : supplierAvailabilityGeneral.ESTAFETATERRESTRECONSUMO,
                                insurance: getInsurancePrice('estafetaEconomico'),
                            });
                        if (entrega === 'fedexDiaSiguiente')
                            setSupplierCostFedexDiaS({
                                id: doc.id,
                                precio:
                                    getFinalPriceFedexDiaS.finalPrice +
                                    getInsurancePrice('fedexDiaSiguiente') +
                                    extendedAreaFedexDiaS +
                                    cargoExtraHeight,
                                delivery: '',
                                cargoExtraHeight: cargoExtraHeight,
                                guia: getFinalPriceFedexDiaS.finalPrice,
                                zonaExt: extendedAreaFedexDiaS != 0 ? 150 : false,
                                shippingInfo: !supplierAvailabilityGeneral.NACIONALDIASIGUIENTE
                                    ? false
                                    : supplierAvailabilityGeneral.NACIONALDIASIGUIENTE,
                                insurance: getInsurancePrice('fedexDiaSiguiente'),
                            });
                        if (entrega === 'fedexEconomico')
                            setSupplierCostFedexEcon({
                                id: doc.id,
                                precio:
                                    getFinalPriceFedexEco.finalPrice +
                                    getInsurancePrice('fedexEconomico') +
                                    extendedAreaFedexEco +
                                    cargoExtraHeight,
                                delivery: '',
                                cargoExtraHeight: cargoExtraHeight,
                                guia: getFinalPriceFedexEco.finalPrice,
                                zonaExt: extendedAreaFedexEco != 0 ? 150 : false,
                                shippingInfo: !supplierAvailabilityGeneral.NACIONALECONOMICO
                                    ? false
                                    : supplierAvailabilityGeneral.NACIONALECONOMICO,
                                insurance: getInsurancePrice('fedexEconomico'),
                            });
                        if (entrega === 'redpackExpress')
                            setSupplierCostRedpackEx({
                                id: doc.id,
                                precio:
                                    getFinalPriceRedExp.finalPrice +
                                    getInsurancePrice('redpackExpress') +
                                    extendedAreaRedpackExp +
                                    cargoExtraHeight,
                                delivery:
                                    !supplierAvailabilityDelivery.EXPRESS != 'NORMAL'
                                        ? supplierAvailabilityDelivery.EXPRESS
                                        : '',
                                cargoExtraHeight: cargoExtraHeight,
                                guia: getFinalPriceRedExp.finalPrice,
                                zonaExt: extendedAreaRedpackExp != 0 ? 130 : false,
                                shippingInfo: !supplierAvailabilityGeneral.EXPRESS
                                    ? false
                                    : supplierAvailabilityGeneral.EXPRESS,
                                insurance: getInsurancePrice('redpackExpress'),
                            });
                        if (entrega === 'redpackEcoExpress')
                            setSupplierCostRedpackEco({
                                id: doc.id,
                                precio:
                                    getFinalPriceRedEco.finalPrice +
                                    getInsurancePrice('redpackEcoExpress') +
                                    extendedAreaRedpackEco +
                                    cargoExtraHeight,
                                delivery:
                                    supplierAvailabilityDelivery.ECOEXPRESS != 'NORMAL'
                                        ? supplierAvailabilityDelivery.ECOEXPRESS
                                        : '',
                                cargoExtraHeight: cargoExtraHeight,
                                guia: getFinalPriceRedEco.finalPrice,
                                zonaExt: extendedAreaRedpackEco != 0 ? 130 : false,
                                shippingInfo: !supplierAvailabilityGeneral.ECOEXPRESS
                                    ? false
                                    : supplierAvailabilityGeneral.ECOEXPRESS,
                                insurance: getInsurancePrice('redpackEcoExpress'),
                            });
                        if (entrega === 'autoencargos')
                            setSupplierCostAutoencargosEcon({
                                id: doc.id,
                                precio:
                                    getFinalPriceAuto.finalPrice +
                                    getInsurancePrice('autoencargos') +
                                    extendedAreaAutoencargos +
                                    cargoExtraHeight,
                                delivery: '',
                                cargoExtraHeight: 0,
                                guia: getFinalPriceAuto.finalPrice,
                                zonaExt: extendedAreaAutoencargos != 0 ? 40 : false,
                                shippingInfo: !supplierAvailabilityGeneral.AUTOENCARGOS
                                    ? false
                                    : supplierAvailabilityGeneral.AUTOENCARGOS,
                                insurance: getInsurancePrice('autoencargos'),
                            });
                        return;
                    }
                    if (parseInt(pricedWeight, 10) > parseInt(max, 10) && !kgExtra) {
                        // console.log('entrando a kilos extra');
                        // console.log('precioTotal', precioTotal, 'entrega', entrega);
                        let diferencia =
                            (parseInt(pricedWeight, 10) - parseInt(max, 10)) * quantity;
                        if (
                            !segundaMejorTarifa[entrega] ||
                            segundaMejorTarifa[entrega].diferencia > diferencia
                        ) {
                            precioTotal = parseInt(precio, 10);

                            if (getFinalPriceFedexDiaS.supplier === entrega) {
                                // console.log('es el mismo proveedor fedex DS');
                                if (getFinalPriceFedexDiaS.finalPrice > precioTotal) {
                                    // console.log('la tarifa directa es mas alta fedex DS');
                                    precioTotal = getFinalPriceFedexDiaS.finalPrice;
                                    diferencia = 0;
                                } else {
                                    precioTotal = precioTotal;
                                    diferencia = diferencia;
                                }
                            }

                            if (getFinalPriceFedexEco.supplier === entrega) {
                                // console.log('es el mismo proveedor fedex eco');
                                if (getFinalPriceFedexEco.finalPrice > precioTotal) {
                                    // console.log('la tarifa directa es mas alta fedex eco');
                                    precioTotal = getFinalPriceFedexEco.finalPrice;
                                    diferencia = 0;
                                } else {
                                    precioTotal = precioTotal;
                                    diferencia = diferencia;
                                }
                            }

                            if (getFinalPriceEstafetaDiaS.supplier === entrega) {
                                // console.log('es el mismo proveedor Estafeta DS');
                                if (getFinalPriceEstafetaDiaS.finalPrice > precioTotal) {
                                    // console.log('la tarifa directa es mas alta Estafeta DS');
                                    precioTotal = getFinalPriceEstafetaDiaS.finalPrice;
                                    diferencia = 0;
                                } else {
                                    precioTotal = precioTotal;
                                    diferencia = diferencia;
                                }
                            }

                            if (getFinalPriceEstafetaEco.supplier === entrega) {
                                // console.log('es el mismo proveedor Estafeta eco');
                                if (getFinalPriceEstafetaEco.finalPrice > precioTotal) {
                                    // console.log('la tarifa directa es mas alta Estafeta eco');
                                    precioTotal = getFinalPriceEstafetaEco.finalPrice;
                                    diferencia = 0;
                                } else {
                                    precioTotal = precioTotal;
                                    diferencia = diferencia;
                                }
                            }

                            if (getFinalPriceRedExp.supplier === entrega) {
                                // console.log('es el mismo proveedor redpack exp');
                                if (getFinalPriceRedExp.finalPrice > precioTotal) {
                                    // console.log('la tarifa directa es mas alta redpack exp');
                                    precioTotal = getFinalPriceRedExp.finalPrice;
                                    diferencia = 0;
                                } else {
                                    precioTotal = precioTotal;
                                    diferencia = diferencia;
                                }
                            }

                            if (getFinalPriceRedEco.supplier === entrega) {
                                // console.log('es el mismo proveedor redpack eco');
                                if (getFinalPriceRedEco.finalPrice > precioTotal) {
                                    // console.log('la tarifa directa es mas alta redpack eco');
                                    precioTotal = getFinalPriceRedEco.finalPrice;
                                    diferencia = 0;
                                } else {
                                    precioTotal = precioTotal;
                                    diferencia = diferencia;
                                }
                            }

                            if (getFinalPriceAuto.supplier === entrega) {
                                // console.log('es el mismo proveedor auto');
                                if (getFinalPriceAuto.finalPrice > precioTotal) {
                                    // console.log('la tarifa directa es mas alta auto');
                                    precioTotal = getFinalPriceAuto.finalPrice;
                                    diferencia = 0;
                                } else {
                                    precioTotal = precioTotal;
                                    diferencia = diferencia;
                                }
                            }

                            // console.log(
                            //     'precioTotal de entrega',
                            //     precioTotal,
                            //     'diferencia',
                            //     diferencia,
                            // );
                            segundaMejorTarifa[entrega] = {
                                id: doc.id,
                                guia: precioTotal,
                                diferencia,
                            };
                            return;
                        }
                    }

                    //Anotamos los cargos de kg extra, por si los necesitamos
                    if (kgExtra) {
                        kgsExtraTarifas[entrega.slice(0, entrega.indexOf('Extra'))] = parseInt(
                            kgExtra,
                            10,
                        );
                        // console.log('tiene tarifa de kilos extra', kgsExtraTarifas);
                        return;
                    }

                    // Si el peso es menor al mínimo de kgs de la tarifa, no aplica
                    if (parseInt(pricedWeight, 10) < parseInt(min, 10)) {
                        // console.log('el peso es menor al mínimo de kgs de la tarifa, no aplica');
                        return;
                    }
                });
                Object.keys(segundaMejorTarifa).forEach(entrega => {
                    // console.log('entrando a los objects keys');
                    const tarifa = segundaMejorTarifa[entrega];
                    let cargoExtra;
                    let cargoExtraHeight;
                    const { guia } = tarifa;
                    const kilosExtra = tarifa.diferencia * kgsExtraTarifas[entrega];
                    //console.log('peso', weight, 'peso real', realWeight);
                    if (
                        (realWeight > 30 && entrega === 'fedexDiaSiguiente') ||
                        (realWeight > 30 && entrega === 'fedexEconomico')
                    ) {
                        cargoExtra = 110;
                    } else {
                        cargoExtra = 0;
                    }

                    if (
                        (parseInt(height, 10) > 100 && entrega === 'redpackEcoExpress') ||
                        (parseInt(height, 10) > 100 && entrega === 'redpackExpress')
                    ) {
                        cargoExtraHeight = 210;
                    } else if (parseInt(height, 10) > 120 && entrega === 'fedexDiaSiguiente') {
                        cargoExtraHeight = 280;
                    } else if (parseInt(height, 10) > 120 && entrega === 'fedexEconomico') {
                        cargoExtraHeight = 110;
                    } else {
                        cargoExtraHeight = 0;
                    }

                    const precio = tarifa.guia + kilosExtra + cargoExtra;
                    // console.log(
                    //     'precio final',
                    //     precio,
                    //     tarifa.guia,
                    //     kilosExtra,
                    //     cargoExtra,
                    //     cargoExtraHeight,
                    // );
                    if (entrega === 'estafetaDiaSiguiente')
                        setSupplierCostEstafetaDiaS({
                            id: tarifa.id,
                            precio:
                                precio +
                                getInsurancePrice('estafetaDiaSiguiente') +
                                extendedAreaEstafetaDiaS +
                                cargoExtraHeight,

                            delivery: '',
                            kilosExtra,
                            cargoExtraHeight,
                            cargoExtra,
                            guia,
                            zonaExt: extendedAreaEstafetaDiaS != 0 ? 110 : false,
                            shippingInfo: !supplierAvailabilityGeneral.ESTAFETADIASIGUIENTE
                                ? false
                                : supplierAvailabilityGeneral.ESTAFETADIASIGUIENTE,
                            insurance: getInsurancePrice('estafetaDiaSiguiente'),
                        });
                    if (entrega === 'estafetaEconomico')
                        setSupplierCostEstafetaEcon({
                            id: tarifa.id,
                            precio:
                                precio +
                                getInsurancePrice('estafetaEconomico') +
                                extendedAreaEstafetaEco +
                                cargoExtraHeight,
                            delivery: '',
                            kilosExtra,
                            cargoExtraHeight,
                            cargoExtra,
                            guia,
                            zonaExt: extendedAreaEstafetaEco != 0 ? 110 : false,
                            shippingInfo: !supplierAvailabilityGeneral.ESTAFETATERRESTRECONSUMO
                                ? false
                                : supplierAvailabilityGeneral.ESTAFETATERRESTRECONSUMO,
                            insurance: getInsurancePrice('estafetaEconomico'),
                        });
                    if (entrega === 'fedexDiaSiguiente')
                        setSupplierCostFedexDiaS({
                            id: tarifa.id,
                            precio:
                                precio +
                                getInsurancePrice('fedexDiaSiguiente') +
                                extendedAreaFedexDiaS +
                                cargoExtraHeight,
                            delivery: '',
                            kilosExtra,
                            cargoExtraHeight,
                            cargoExtra,
                            guia,
                            zonaExt: extendedAreaFedexDiaS != 0 ? 150 : false,
                            shippingInfo: !supplierAvailabilityGeneral.NACIONALDIASIGUIENTE
                                ? false
                                : supplierAvailabilityGeneral.NACIONALDIASIGUIENTE,
                            insurance: getInsurancePrice('fedexDiaSiguiente'),
                        });
                    if (entrega === 'fedexEconomico')
                        setSupplierCostFedexEcon({
                            id: tarifa.id,
                            precio:
                                precio +
                                getInsurancePrice('fedexEconomico') +
                                extendedAreaFedexEco +
                                cargoExtraHeight,
                            delivery: '',
                            kilosExtra,
                            cargoExtraHeight,
                            cargoExtra,
                            guia,
                            zonaExt: extendedAreaFedexEco != 0 ? 150 : false,
                            shippingInfo: !supplierAvailabilityGeneral.NACIONALECONOMICO
                                ? false
                                : supplierAvailabilityGeneral.NACIONALECONOMICO,
                            insurance: getInsurancePrice('fedexEconomico'),
                        });
                    if (entrega === 'redpackExpress')
                        setSupplierCostRedpackEx({
                            id: tarifa.id,
                            precio:
                                precio +
                                getInsurancePrice('redpackExpress') +
                                extendedAreaRedpackExp +
                                cargoExtraHeight,
                            delivery:
                                supplierAvailabilityDelivery.EXPRESS != 'NORMAL'
                                    ? supplierAvailabilityDelivery.EXPRESS
                                    : '',
                            kilosExtra,
                            cargoExtraHeight: cargoExtraHeight,
                            cargoExtra,
                            guia,
                            zonaExt: extendedAreaRedpackExp != 0 ? 130 : false,
                            shippingInfo: !supplierAvailabilityGeneral.EXPRESS
                                ? false
                                : supplierAvailabilityGeneral.EXPRESS,
                            insurance: getInsurancePrice('redpackExpress'),
                        });
                    if (entrega === 'redpackEcoExpress')
                        setSupplierCostRedpackEco({
                            id: tarifa.id,
                            precio:
                                precio +
                                getInsurancePrice('redpackEcoExpress') +
                                extendedAreaRedpackEco +
                                cargoExtraHeight,
                            delivery:
                                supplierAvailabilityDelivery.ECOEXPRESS != 'NORMAL'
                                    ? supplierAvailabilityDelivery.ECOEXPRESS
                                    : '',
                            kilosExtra,
                            cargoExtraHeight: cargoExtraHeight,
                            cargoExtra,
                            guia,
                            zonaExt: extendedAreaRedpackEco != 0 ? 130 : false,
                            shippingInfo: !supplierAvailabilityGeneral.ECOEXPRESS
                                ? false
                                : supplierAvailabilityGeneral.ECOEXPRESS,
                            insurance: getInsurancePrice('redpackEcoExpress'),
                        });
                    if (entrega === 'autoencargos')
                        setSupplierCostAutoencargosEcon({
                            id: tarifa.id,
                            precio:
                                precio +
                                getInsurancePrice('autoencargos') +
                                extendedAreaAutoencargos +
                                cargoExtraHeight,
                            delivery: '',
                            kilosExtra,
                            cargoExtraHeight: 0,
                            cargoExtra,
                            guia,
                            zonaExt: extendedAreaAutoencargos != 0 ? 40 : false,
                            shippingInfo: !supplierAvailabilityGeneral.AUTOENCARGOS
                                ? false
                                : supplierAvailabilityGeneral.AUTOENCARGOS,
                            insurance: getInsurancePrice('autoencargos'),
                        });
                });
            });
    }, [
        weight,
        quantity,
        contentValue,
        supplierAvailability,
        supplierAvailabilityGeneral,
        profileDoc,
    ]);

    const supplierCard = (proveedor, tipoEnvio, entrega, costos) => (
        <Card className="rainbow-flex rainbow-flex_column rainbow-align_center rainbow-justify_space-around rainbow-p-around_large rainbow-m-around_small">
            {proveedor === 'fedex' && tipoEnvio === 'DiaSiguiente' && (
                <img src="/assets/fedex-express.png" style={{ maxWidth: 180 }} alt="Fedex" />
            )}
            {proveedor === 'fedex' && tipoEnvio === 'Economico' && (
                <img src="/assets/fedex-eco.png" style={{ maxWidth: 180 }} alt="Fedex" />
            )}
            {proveedor === 'redpack' && tipoEnvio === 'Express' && (
                <img src="/assets/redpack-express.png" style={{ maxWidth: 180 }} alt="Redpack" />
            )}
            {proveedor === 'redpack' && tipoEnvio === 'EcoExpress' && (
                <img src="/assets/redpack-eco.png" style={{ maxWidth: 180 }} alt="Redpack" />
            )}
            {proveedor === 'estafeta' && tipoEnvio === 'DiaSiguiente' && (
                <img src="/assets/estafeta-express.png" style={{ maxWidth: 180 }} alt="estafeta" />
            )}
            {proveedor === 'estafeta' && tipoEnvio === 'Economico' && (
                <img src="/assets/estafeta-eco.png" style={{ maxWidth: 180 }} alt="estafeta" />
            )}
            {proveedor === 'autoencargos' && tipoEnvio === 'Economico' && (
                <img src="/assets/autoencar.png" style={{ maxWidth: 180 }} alt="Autoencargos" />
            )}
            <h6
                style={{
                    color: 'gray',
                    fontWeight: 'bold',
                    marginTop: '2rem',
                    marginBottom: '0.5rem',
                }}
            >
                Entrega Estimada
            </h6>
            <p>{entrega}</p>
            {/* {console.log(costos)} */}
            {costos.delivery !== '' && (
                <>
                    <h6
                        style={{
                            color: 'red',
                            fontWeight: 'bold',
                            marginTop: '1rem',
                            marginBottom: '0.5rem',
                        }}
                    >
                        Tipo de Entrega
                    </h6>
                    <p style={{ color: 'red' }}>{costos.delivery}</p>
                </>
            )}
            <h6
                style={{
                    color: 'gray',
                    fontWeight: 'bold',
                    marginTop: '0.5rem',
                    marginBottom: '0.5rem',
                }}
            >
                Detalles
            </h6>
            <PriceContainer>
                <PriceLabel>Tarifa Base:</PriceLabel>
                <PriceNumber>{formatMoney(costos.guia)}</PriceNumber>
            </PriceContainer>
            {costos && (
                <>
                    {costos.kilosExtra > 0 && (
                        <PriceContainer>
                            <PriceLabel>Kg adicionales:</PriceLabel>
                            <PriceNumber>{formatMoney(costos.kilosExtra)}</PriceNumber>
                        </PriceContainer>
                    )}
                    {costos.insurance > 0 && (
                        <PriceContainer>
                            <PriceLabel>Cargo por Seguro:</PriceLabel>
                            <PriceNumber>{formatMoney(costos.insurance)}</PriceNumber>
                        </PriceContainer>
                    )}
                    {costos.cargoExtraHeight >= 110 && (
                        <PriceContainer>
                            <PriceLabel>Cargo por extra largo:</PriceLabel>
                            <PriceNumber>{formatMoney(costos.cargoExtraHeight)}</PriceNumber>
                        </PriceContainer>
                    )}
                    {costos.cargoExtra === 110 && (
                        <PriceContainer>
                            <PriceLabel>Cargo por más de 30 kg:</PriceLabel>
                            <PriceNumber>{formatMoney(costos.cargoExtra)}</PriceNumber>
                        </PriceContainer>
                    )}

                    {costos.zonaExt && (
                        <PriceContainer>
                            <PriceLabel>Zona Extendida:</PriceLabel>
                            <PriceNumber>{formatMoney(costos.zonaExt)}</PriceNumber>
                        </PriceContainer>
                    )}
                    <br />
                    <PriceContainer>
                        <PriceLabel>Subtotal:</PriceLabel>
                        <PriceNumber>{formatMoney(costos.precio)}</PriceNumber>
                    </PriceContainer>
                    <PriceContainer>
                        <PriceLabel>IVA:</PriceLabel>
                        <PriceNumber>{formatMoney(costos.precio * 0.16)}</PriceNumber>
                    </PriceContainer>
                    <h3> {formatMoney(costos.precio * 1.16)} </h3>
                    <Button
                        label="Guardar"
                        /* variant="brand" */
                        className="save-button mb-3"
                        onClick={() => saveService(proveedor, tipoEnvio, costos)}
                    />
                    <Button
                        label="Crear"
                        variant="brand"
                        onClick={() => registerService(proveedor, tipoEnvio, costos)}
                    />
                </>
            )}
        </Card>
    );
    return (
        <>
            <StyledDirectiosDetails style={{ justifyContent: 'center' }}>
                <StyledDetails>
                    <span>
                        <b>{nameSender}</b>
                    </span>
                    <p>{streetNameSender}</p>
                    <p>{streetNumberSender}</p>
                    <p>{neighborhoodSender}</p>
                    <p>{countrySender}</p>
                    <p>{CPSender}</p>
                    <p>{phoneSender}</p>
                </StyledDetails>
                <StyledDetails>
                    <span>
                        <b>{nameReceiver}</b>
                    </span>
                    <p>{streetNameReceiver}</p>
                    <p>{streetNumberReceiver}</p>
                    <p>{neighborhoodReceiver}</p>
                    <p>{countryReceiver}</p>
                    <p>{CPReceiver}</p>
                    <p>{phoneReceiver}</p>
                </StyledDetails>
                <StyledDetails>
                    <span>
                        <b>{namePackage}</b>
                    </span>
                    <p>Cantidad: {quantity} pzas.</p>
                    <p>Peso Físico: {realWeight} kgs</p>
                    <p>
                        Dimensiones: {height}x{width}x{depth} cm
                    </p>
                    <p>Peso Final: {finalWeight} kgs</p>
                    {contentValue !== '' && <p>Valor asegurado: ${contentValue}</p>}
                </StyledDetails>
            </StyledDirectiosDetails>
            <StyledError>
                {error && (
                    <div className="alert-error">
                        <h2>No tienes el saldo suficiente</h2>
                    </div>
                )}
            </StyledError>
            {hasActivatedSuppliers === false && (
                <h1>Ningún servicio activado, contacte a un administrador</h1>
            )}
            {supplierExtraWeight === false && (
                <h1>
                    No tienes tarifa de kilos extra para ese provedor, por favor contacte a un
                    administrador
                </h1>
            )}
            {hasActivatedSuppliers && !supplierAvailability && (
                <div className="rainbow-p-vertical_xx-large">
                    <h1>Obteniendo precios...</h1>
                    <div className="rainbow-position_relative rainbow-m-vertical_xx-large rainbow-p-vertical_xx-large">
                        <Spinner size="large" variant="brand" />
                    </div>
                </div>
            )}
            {hasActivatedSuppliers && supplierAvailability && (
                <>
                    <StyledPaneContainer style={{ justifyContent: 'center' }}>
                        {supplierAvailability.ESTAFETADIASIGUIENTE &&
                            supplierCostEstafetaDiaS.guia &&
                            supplierCard(
                                'estafeta',
                                'DiaSiguiente',
                                '3 a 5 días hábiles',
                                supplierCostEstafetaDiaS,
                            )}
                        {supplierAvailability.ESTAFETATERRESTRECONSUMO &&
                            supplierCostEstafetaEcon.guia &&
                            supplierCard(
                                'estafeta',
                                'Economico',
                                '3 a 5 días hábiles',
                                supplierCostEstafetaEcon,
                            )}
                        {supplierAvailability.NACIONALDIASIGUIENTE &&
                            supplierCostFedexDiaS.guia &&
                            supplierCard(
                                'fedex',
                                'DiaSiguiente',
                                '1 a 3 días hábiles',
                                supplierCostFedexDiaS,
                            )}
                        {supplierAvailability.NACIONALECONOMICO &&
                            supplierCostFedexEcon.guia &&
                            supplierCard(
                                'fedex',
                                'Economico',
                                '3 a 5 días hábiles',
                                supplierCostFedexEcon,
                            )}
                        {supplierAvailability.EXPRESS &&
                            supplierCostRedpackEx.guia &&
                            supplierCard(
                                'redpack',
                                'Express',
                                '1 a 3 días hábiles',
                                supplierCostRedpackEx,
                            )}
                        {supplierAvailability.ECOEXPRESS &&
                            supplierCostRedpackEco.guia &&
                            supplierCard(
                                'redpack',
                                'EcoExpress',
                                '3 a 5 días hábiles',
                                supplierCostRedpackEco,
                            )}
                        {supplierAvailability.AUTOENCARGOS &&
                            supplierCostAutoencargosEcon.guia &&
                            supplierCard(
                                'autoencargos',
                                'Economico',
                                '1 a 2 días hábiles',
                                supplierCostAutoencargosEcon,
                            )}
                    </StyledPaneContainer>
                    <DownloadContainer>
                        <Row className="justify-content-md-center mt-4">
                            <Link
                                className="link-package"
                                to="/mi-cuenta/recargos"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <p>
                                    ¿ Tienes duda de algun cargo extra ?
                                    <b>Consulta nuestra sección de recargos adicionales</b>
                                </p>
                            </Link>
                            <Link to="/mi-cuenta">Volver al Inicio</Link>
                        </Row>
                    </DownloadContainer>
                    {!(
                        (supplierAvailability.ESTAFETADIASIGUIENTE != 'undefined' &&
                            supplierCostEstafetaDiaS.guia) ||
                        (supplierAvailability.ESTAFETATERRESTRECONSUMO != 'undefined' &&
                            supplierCostEstafetaEcon.guia) ||
                        (supplierAvailability.NACIONALDIASIGUIENTE != 'undefined' &&
                            supplierCostFedexDiaS.guia) ||
                        (supplierAvailability.NACIONALECONOMICO != 'undefined' &&
                            supplierCostFedexEcon.guia) ||
                        (supplierAvailability.EXPRESS != 'undefined' &&
                            supplierCostRedpackEx.guia) ||
                        (supplierAvailability.ECOEXPRESS != 'undefined' &&
                            supplierCostRedpackEco.guia) ||
                        (supplierAvailability.AUTOENCARGOS != 'undefined' &&
                            supplierCostAutoencargosEcon.guia)
                    ) && <h1> ¡Oh no! Ha ocurrido un error, favor de contactar a tu asesor.</h1>}
                </>
            )}
        </>
    );
};

ServicioComponent.propTypes = {
    onSave: PropTypes.func.isRequired,
    idGuiaGlobal: PropTypes.string.isRequired,
};
