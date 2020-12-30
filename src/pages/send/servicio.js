import React, { useState, useEffect, useRef } from 'react';
import PropTypes, { element } from 'prop-types';
import { Card, Button, Spinner } from 'react-rainbow-components';
import styled from 'styled-components';
import { useUser, useFirebaseApp } from 'reactfire';
import formatMoney from 'accounting-js/lib/formatMoney';
import toFixed from 'accounting-js/lib/toFixed';
import axios from 'axios';

import { StyledPaneContainer, StyledDirectiosDetails, StyledDetails, StyledError } from './styled';

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
    const [supplierExtraWeight, setSupplierExtraWeight] = useState(true);

    const [supplierCostFedexDiaS, setSupplierCostFedexDiaS] = useState(false);
    const [supplierCostFedexEcon, setSupplierCostFedexEcon] = useState(false);

    const [supplierCostRedpackEx, setSupplierCostRedpackEx] = useState(false);
    const [supplierCostRedpackEco, setSupplierCostRedpackEco] = useState(false);

    const [supplierCostAutoencargosEcon, setSupplierCostAutoencargosEcon] = useState(false);

    const user = useUser();
    const firebase = useFirebaseApp();
    const db = firebase.firestore();

    // Sender states
    const [nameSender, setNameSender] = useState();
    const [CPSender, setCPSender] = useState('');
    const getCPSender = useRef('');
    const cpsAvailabilityAutoencargos = useRef(false);
    const [neighborhoodSender, setNeighborhoodSender] = useState('');
    const [countrySender, setCountrySender] = useState('');
    const [streetNumberSender, setStreetNumberSender] = useState('');
    const [phoneSender, setPhoneSender] = useState('');
    // Receiver states
    const [nameReceiver, setNameReceiver] = useState();
    const [CPReceiver, setCPReceiver] = useState('');
    const getCPReceiver = useRef('');
    const [neighborhoodReceiver, setNeighborhoodReceiver] = useState('');
    const [countryReceiver, setCountryReceiver] = useState('');
    const [streetNumberReceiver, setStreetNumberReceiver] = useState('');
    const [phoneReceiver, setPhoneReceiver] = useState('');
    // Package information
    const [namePackage, setNamePackage] = useState('');
    const [height, setHeight] = useState('');
    const [width, setWidth] = useState('');
    const [depth, setDepth] = useState('');
    const [weight, setWeight] = useState('');
    const [finalWeight, setFinalWeight] = useState('');
    const getFinalWeight = useRef('');
    const [quantity, setQuantity] = useState('');
    const [contentValue, setContentValue] = useState('');
    const [error, setError] = useState(false);
    const getFinalPrice = useRef('');

    const [profileDoc, setProfileDoc] = useState(false);

    let dataShipping = useRef();
    let delivery_company = useRef();
    const allRatesData = useRef([]);
    let supplierExtendedArea = {};
    let supplierShippingName = {};
    let supplerFedex = false;
    let supplierRedpack = false;
    const tokenSand = process.env.REACT_APP_REDPACK_SAND;
    const tokenProd = process.env.REACT_APP_REDPACK_PROD;

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
        '45200',
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

    const registerService = (supplier, type, { id, precio, ...cargos }) => {
        const precioNeto = precio * 1.16;
        console.log('supplier', supplier);
        console.log('cargos', cargos);
        db.collection('profiles')
            .where('ID', '==', user.uid)
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    console.log(doc.id, ' => ', doc.data());
                    // console.log(idGuiaGlobal, 'idGuiaGlobal');
                    if (parseFloat(precioNeto) > parseFloat(doc.data().saldo)) {
                        setError(true);
                    } else {
                        const newBalance = Math.round(
                            parseFloat(doc.data().saldo) - parseFloat(precioNeto),
                        );
                        if (newBalance < 0) {
                            return false;
                        }
                        console.log('precioNeto', precioNeto);
                        console.log('newBalance', newBalance);
                        console.log('restando el saldo');
                        db.collection('profiles')
                            .doc(doc.id)
                            .update({ saldo: newBalance })
                            .then(() => {
                                console.log('get it');
                                addSupplier(supplier, type, { id, precioNeto, ...cargos });
                            });
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
                        const supplierData = {
                            ID: user.uid,
                            Supplier: `${supplier}${type}`,
                            Supplier_cost: toFixed(precioNeto, 2),
                            tarifa,
                            cargos,
                            FinalWeight: getFinalWeight.current,
                        };
                        console.log(supplierData);
                        onSave(supplierData);
                    });
            });
    };

    const addRastreoAuto = idGuiaGlobal => {
        let guiaAutoencargos = Math.floor(Math.random() * 1000000).toString();
        db.collection('guia')
            .doc(idGuiaGlobal)
            .update({ rastreo: guiaAutoencargos });
    };

    useEffect(() => {
        console.log('obteniendo los valores, primer use effect');
        //Asignando los valores desde el doc guia del firestore
        db.collection('guia')
            .doc(idGuiaGlobal)
            .onSnapshot(function getGuia(doc) {
                // console.log("Document data 1:", doc.data())
                // Get snapshot sender information
                setNameSender(doc.data().sender_addresses.name);
                setCPSender(doc.data().sender_addresses.codigo_postal);
                getCPSender.current = doc.data().sender_addresses.codigo_postal;
                setNeighborhoodSender(doc.data().sender_addresses.neighborhood);
                setCountrySender(doc.data().sender_addresses.country);
                setStreetNumberSender(doc.data().sender_addresses.street_number);
                setPhoneSender(doc.data().sender_addresses.phone);
                // Get snapshot to receive Receiver information
                setNameReceiver(doc.data().receiver_addresses.name);
                setCPReceiver(doc.data().receiver_addresses.codigo_postal);
                getCPReceiver.current = doc.data().receiver_addresses.codigo_postal;
                setNeighborhoodReceiver(doc.data().receiver_addresses.neighborhood);
                setCountryReceiver(doc.data().receiver_addresses.country);
                setStreetNumberReceiver(doc.data().receiver_addresses.street_number);
                setPhoneReceiver(doc.data().receiver_addresses.phone);
                // Get snapshot to receive package information
                if (doc.data().package) {
                    setNamePackage(doc.data().package.name);
                    setHeight(doc.data().package.height);
                    setWidth(doc.data().package.width);
                    setDepth(doc.data().package.depth);
                    setWeight(doc.data().package.weight);
                    setQuantity(doc.data().package.quantity);
                    setContentValue(doc.data().package.content_value);
                }
            });
    }, []);

    useEffect(() => {
        //Si el código postal coincide con los códigos postales de Autoencargos se agrega al supplierAvailability
        console.log('corroborando codigo para autoencargos, segundo use effect');
        Promise.all([
            fetch(
                'https://api-sepomex.hckdrk.mx/query/search_cp_advanced/Jalisco?municipio=Guadalajara',
            ),
            fetch(
                'https://api-sepomex.hckdrk.mx/query/search_cp_advanced/Jalisco?municipio=Zapopan',
            ),
            fetch(
                'https://api-sepomex.hckdrk.mx/query/search_cp_advanced/Jalisco?municipio=Tonalá',
            ),
            fetch(
                'https://api-sepomex.hckdrk.mx/query/search_cp_advanced/Jalisco?municipio=San Pedro Tlaquepaque',
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
                let cpReceiver = allCpsZMG.includes(getCPReceiver.current);
                let cpSender = allCpsZMG.includes(getCPSender.current);
                if (cpReceiver === true && cpSender === true) {
                    console.log('codigos postales ZMG');
                    cpsAvailabilityAutoencargos.current = true;
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
                            //console.log(doc.id, " => ", doc.data());
                            //allRates asigna todos las tairfas que tiene el usario
                            allRatesData.current.push(doc.data());
                        });
                        //setHasActivatedSuppliers asigna a hasActivatedSuppliers el numero de doc de rate para que se muestren los provedores
                        setHasActivatedSuppliers(querySnapshot.size > 0);
                        console.log(
                            'numero de tarifas que tiene este usuario :',
                            querySnapshot.size,
                        );
                        console.log('todas las tarifas del cliente', allRatesData.current);
                        //Se verifica que si las tarifas tienen el proveedor asignado
                        allRatesData.current.forEach(supplier => {
                            if (
                                supplier.entrega === 'fedexDiaSiguiente' ||
                                supplier.entrega === 'fedexEconomico'
                            ) {
                                // console.log('si hay fedex');
                                supplerFedex = true;
                            } else if (
                                supplier.entrega === 'redpackExpress' ||
                                supplier.entrega === 'redpackEcoExpress'
                            ) {
                                // console.log('si hay redpack');
                                supplierRedpack = true;
                            }
                        });

                        if (!supplerFedex && supplierRedpack) {
                            delivery_company.current = 'redpack';
                        } else if (supplerFedex && !supplierRedpack) {
                            delivery_company.current = 'fedex';
                        } else {
                            delivery_company.current = '';
                        }
                        // console.log('delivery_company.current', delivery_company.current);
                        getDataGuia(delivery_company.current);
                    });
                });
        };
        getRates();
    }, [user]);

    const getDataGuia = async delivery => {
        console.log('asignando los valores');
        await db
            .collection('guia')
            .doc(idGuiaGlobal)
            .get()
            .then(function(doc) {
                if (doc.exists) {
                    console.log('Document data:', doc.data());
                    dataShipping.current = JSON.stringify({
                        sender: {
                            contact_name: doc.data().sender_addresses.name,
                            company_name: doc.data().sender_addresses.name,
                            street: doc.data().sender_addresses.street_number,
                            zip_code: doc.data().sender_addresses.codigo_postal,
                            neighborhood: doc.data().sender_addresses.neighborhood,
                            city: doc.data().sender_addresses.country,
                            country: 'MX',
                            state: doc.data().sender_addresses.state,
                            street_number: 'sn',
                            place_reference: doc.data().sender_addresses.place_reference,
                            phone: doc.data().sender_addresses.phone,
                        },
                        receiver: {
                            contact_name: doc.data().receiver_addresses.name,
                            company_name: doc.data().receiver_addresses.name,
                            street: doc.data().receiver_addresses.street_number,
                            zip_code: doc.data().receiver_addresses.codigo_postal,
                            neighborhood: doc.data().receiver_addresses.neighborhood,
                            city: doc.data().receiver_addresses.country,
                            country: 'MX',
                            state: doc.data().receiver_addresses.state,
                            street_number: 'sn',
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

                    console.log(allRatesData.current.length, 'allRatesData');
                    fetchGuia(dataShipping.current, delivery);
                } else {
                    console.log('Error getting document:', error);
                }
            });
    };

    async function getFetch(data) {
        await Promise.all([fetchGuia(data, 'redpack'), fetchGuia(data, 'fedex')]);
    }

    const fetchGuia = async (data, delivery) => {
        // console.log('data 2', data);
        // console.log('delivery', delivery);
        console.log('haciendo la peticion al broker');

        let myHeaders = new Headers();
        myHeaders.append('Authorization', tokenProd);
        myHeaders.append('Content-Type', 'application/json');
        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: data,
            redirect: 'follow',
        };

        // await Promise.all([
        //     fetch('https://autopaquete.simplestcode.com/api/do-shipping-quote/redpack', requestOptions ),
        //     fetch('https://autopaquete.simplestcode.com/api/do-shipping-quote/fedex', requestOptions)
        // ])
        // .then(([res1, res2]) =>
        //     Promise.all([res1.json(), res2.json()]),
        // )
        const urlRequest = `https://autopaquete.simplestcode.com/api/do-shipping-quote/${delivery}`;
        console.log('url', urlRequest);

        fetch(urlRequest, requestOptions)
            .then(response => response.json())
            .then(result => {
                // console.log(result, result.length)
                if (result.length >= 1) {
                    console.log('numero de provedores disponibles', result.length);
                    //Asigna a supplierAvailability el objeto de respuesta de la funcion cotizar guia
                    let suppliersGeneral = result;
                    console.log('suppliersGeneral', suppliersGeneral);
                    if (cpsAvailabilityAutoencargos.current === true) {
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
                        // console.log(suppliersGeneral)
                    } else {
                        console.log('aqui no hay autoencargos');
                        // console.log(suppliersGeneral);
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
                    console.log(supplierExtendedArea);
                    // supplierExtended.current = supplierExtendedArea;
                    setSupplierAvailability(supplierExtendedArea);
                    //{fedexEconomico: true, fedexDiaSiguiente: true, estafetaEconomico: true, RedpackExiguiente: true}
                    //Se hace un nuevo array con la informacion de cada paqueteria con la respuesta de la API
                    suppliersGeneral.forEach(element => {
                        supplierShippingName[element.shipping_service.name] = [
                            element.shipping_company,
                            element.shipping_service.name,
                            element.shipping_service.description,
                            element.shipping_service.id,
                        ];
                    });
                    console.log(supplierShippingName);
                    //supplierShipping.current = supplierShippingName;
                    setSupplierAvailabilityGeneral(supplierShippingName);
                }
            })
            .catch(error => console.log('error', error));
    };

    useEffect(() => {
        if (weight === '') return;
        if (!supplierAvailability || !profileDoc) return;
        console.log('todos los provedores activos', supplierAvailability);
        // console.log('toda la info de los provedores activos', supplierAvailabilityGeneral);

        //Validaciones del peso
        let pricedWeight = Math.ceil(weight);
        //Si el peso es mayor a uno, se le asigna su peso, en otro caso se le asigna 1
        pricedWeight = pricedWeight > 1 ? pricedWeight : 1;
        const volumetricWeight = Math.ceil((height * width * depth) / 5000);

        if (volumetricWeight > weight) {
            console.log('el peso volumetrico es mayor que el peso declarado');
            pricedWeight = volumetricWeight;
            console.log('pricedWeight', pricedWeight);
            setFinalWeight(pricedWeight);
            getFinalWeight.current = pricedWeight;
        } else {
            setFinalWeight(pricedWeight);
            getFinalWeight.current = pricedWeight;
            console.log('pricedWeight', pricedWeight);
        }

        //Validaciones de valor asegurado
        const getInsurancePrice = company => {
            //console.log('seguro por provedor', company);
            if (contentValue === '') return 0;
            const baseValue = parseInt(contentValue, 10) * 0.02;
            console.log('valor asegurado ', baseValue);
            const extraValue = 40;
            if (company === 'autoencargos' && baseValue > 0) {
                return Math.max(baseValue, 20);
            }
            //else
            if (
                (company === 'fedexDiaSiguiente' && baseValue > 0) ||
                (company === 'fedexEconomico' && baseValue > 0)
            ) {
                return Math.max(baseValue, 20) + extraValue;
            }
            //else
            if (
                (company === 'redpackExpress' && baseValue > 0) ||
                (company === 'redpackEcoExpress' && baseValue > 0)
            ) {
                return Math.max(baseValue, 20) + extraValue;
            }
            return 0;
            // else {
            //     return 0;
            // }
        };

        //Validaciones de zona extendida
        let extendedAreaFedexDiaS = 0;
        let extendedAreaFedexEco = 0;
        let extendedAreaRedpackExp = 0;
        let extendedAreaRedpackEco = 0;
        // let extendedAreaAutoencargos = 0;

        if (typeof supplierAvailability.NACIONALDIASIGUIENTE !== 'undefined') {
            extendedAreaFedexDiaS =
                typeof supplierAvailability.NACIONALDIASIGUIENTE.zonaExtendida !== 'undefined'
                    ? 150
                    : 0;
            //console.log('extendedAreaFedexDiaS', extendedAreaFedexDiaS);
        } else {
            console.log('no zona extendida extendedAreaFedexDiaS');
        }
        if (typeof supplierAvailability.NACIONALECONOMICO !== 'undefined') {
            extendedAreaFedexEco =
                typeof supplierAvailability.NACIONALECONOMICO.zonaExtendida !== 'undefined'
                    ? 150
                    : 0;
            //console.log('extendedAreaFedexEco', extendedAreaFedexEco);
        } else {
            console.log('no zona extendida extendedAreaFedexEco');
        }
        if (typeof supplierAvailability.EXPRESS !== 'undefined') {
            extendedAreaRedpackExp =
                typeof supplierAvailability.EXPRESS.zonaExtendida !== 'undefined' ? 130 : 0;
            // console.log('extendedAreaRedpackExp', extendedAreaRedpackExp);
        } else {
            console.log('no zona extendida extendedAreaRedpackExp');
        }
        if (typeof supplierAvailability.ECOEXPRESS !== 'undefined') {
            extendedAreaRedpackEco =
                typeof supplierAvailability.ECOEXPRESS.zonaExtendida !== 'undefined' ? 130 : 0;
            // console.log('extendedAreaRedpackEco', extendedAreaRedpackEco);
        } else {
            console.log('no zona extendida extendedAreaRedpackEco');
        }

        profileDoc.ref
            .collection('rate')
            .orderBy('max', 'desc')
            .onSnapshot(querySnapshot => {
                const segundaMejorTarifa = {};
                const kgsExtraTarifas = {};
                let precioTotal;
                querySnapshot.forEach(doc => {
                    console.log(doc.data());
                    const { entrega, precio, max, min, kgExtra } = doc.data();
                    // Encontramos si hay tarifas que apliquen directo al paquete
                    if (
                        !kgExtra &&
                        parseInt(min, 10) <= parseInt(pricedWeight, 10) &&
                        parseInt(max, 10) >= parseInt(pricedWeight, 10)
                    ) {
                        console.log('Encontramos si hay tarifas que apliquen directo al paquete');
                        //precioTotal = parseInt(precio, 10) * quantity;
                        getFinalPrice.current = parseInt(precio, 10) * quantity;
                        //console.log('precioTotal de entrega', precioTotal);
                        let cargoExtraHeight;
                        if (parseInt(height, 10) > 100 && entrega === 'redpackEcoExpress') {
                            cargoExtraHeight = 210;
                            console.log('cargoExtra redpack', cargoExtraHeight);
                        } else if (parseInt(height, 10) > 120 && entrega === 'fedexDiaSiguiente') {
                            cargoExtraHeight = 280;
                            console.log('cargoExtra fedexDiaSiguiente', cargoExtraHeight);
                        } else if (parseInt(height, 10) > 120 && entrega === 'fedexEconomico') {
                            cargoExtraHeight = 110;
                            console.log('cargoExtra fedexEconomico', cargoExtraHeight);
                        } else {
                            cargoExtraHeight = 0;
                            console.log('cargoExtra', cargoExtraHeight);
                        }
                        //const precio = tarifa.guia + kilosExtra + cargoExtra;

                        console.log(
                            'precioTotal',
                            precioTotal,
                            'getFinalPrice',
                            getFinalPrice.current,
                            cargoExtraHeight,
                        );
                        if (entrega === 'fedexDiaSiguiente')
                            setSupplierCostFedexDiaS({
                                id: doc.id,
                                precio:
                                    getFinalPrice.current +
                                    getInsurancePrice('fedexDiaSiguiente') +
                                    extendedAreaFedexDiaS +
                                    cargoExtraHeight,
                                seguro: getInsurancePrice('fedexDiaSiguiente'),
                                cargoExtraHeight: cargoExtraHeight,
                                guia: getFinalPrice.current,
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
                                    getFinalPrice.current +
                                    getInsurancePrice('fedexEconomico') +
                                    extendedAreaFedexEco +
                                    cargoExtraHeight,
                                seguro: getInsurancePrice('fedexEconomico'),
                                cargoExtraHeight: cargoExtraHeight,
                                guia: getFinalPrice.current,
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
                                    getFinalPrice.current +
                                    getInsurancePrice('redpackExpress') +
                                    extendedAreaRedpackExp +
                                    cargoExtraHeight,
                                seguro: getInsurancePrice('redpackExpress'),
                                cargoExtraHeight: cargoExtraHeight,
                                guia: getFinalPrice.current,
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
                                    getFinalPrice.current +
                                    getInsurancePrice('redpackEcoExpress') +
                                    extendedAreaRedpackEco +
                                    cargoExtraHeight,
                                seguro: getInsurancePrice('redpackEcoExpress'),
                                cargoExtraHeight: cargoExtraHeight,
                                guia: getFinalPrice.current,
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
                                    getFinalPrice.current +
                                    getInsurancePrice('autoencargos') +
                                    cargoExtraHeight,
                                seguro: getInsurancePrice('autoencargos'),
                                cargoExtraHeight: 0,
                                guia: getFinalPrice.current,
                                zonaExt: false,
                                shippingInfo: !supplierAvailabilityGeneral.AUTOENCARGOS
                                    ? false
                                    : supplierAvailabilityGeneral.AUTOENCARGOS,
                                insurance: getInsurancePrice('autoencargos'),
                            });
                        return;
                    }
                    // else
                    //si el peso es mayor al  rango maximo de la tarifa hay kilos extras
                    if (
                        parseInt(pricedWeight, 10) > parseInt(max, 10) &&
                        !getFinalPrice.current &&
                        !kgExtra
                    ) {
                        console.log('entrando a kilos extra');
                        console.log(
                            'precioTotal',
                            precioTotal,
                            'getFinalPrice',
                            getFinalPrice.current,
                        );
                        const diferencia =
                            (parseInt(pricedWeight, 10) - parseInt(max, 10)) * quantity;
                        console.log('diferencia', diferencia);
                        console.log(segundaMejorTarifa[entrega]);
                        if (
                            !segundaMejorTarifa[entrega] ||
                            segundaMejorTarifa[entrega].diferencia > diferencia
                        ) {
                            precioTotal = parseInt(precio, 10) * quantity;
                            if (getFinalPrice.current > precioTotal) {
                                precioTotal = getFinalPrice.current;
                            }
                            console.log('precioTotal de entrega', precioTotal);
                            segundaMejorTarifa[entrega] = {
                                id: doc.id,
                                guia: precioTotal,
                                diferencia,
                            };
                            console.log('tarifas de precio extra', segundaMejorTarifa);
                            return;
                        }
                    }

                    //Anotamos los cargos de kg extra, por si los necesitamos
                    if (kgExtra) {
                        kgsExtraTarifas[entrega.slice(0, entrega.indexOf('Extra'))] = parseInt(
                            kgExtra,
                            10,
                        );
                        console.log('tiene tarifa de kilos extra', kgsExtraTarifas);
                        return;
                    }

                    // Si el peso es menor al mínimo de kgs de la tarifa, no aplica
                    if (parseInt(pricedWeight, 10) < parseInt(min, 10)) {
                        console.log('el peso es menor al mínimo de kgs de la tarifa, no aplica');
                        return;
                    }
                });
                Object.keys(segundaMejorTarifa).forEach(entrega => {
                    console.log('entrando a los objects keys');
                    const tarifa = segundaMejorTarifa[entrega];
                    let cargoExtra;
                    let cargoExtraHeight;
                    // console.log('tarifa', tarifa);
                    const { guia } = tarifa;
                    // console.log('guia tarifa', tarifa.diferencia);
                    console.log('Entrega', entrega);
                    //console.log('supplierCostFedexDiaS 2', supplierCostFedexDiaS);
                    const kilosExtra = tarifa.diferencia * kgsExtraTarifas[entrega];
                    if (
                        (weight > 30 && entrega === 'fedexDiaSiguiente') ||
                        (weight > 30 && entrega === 'fedexEconomico')
                    ) {
                        cargoExtra = 110;
                        console.log('cargoExtra', cargoExtra);
                    } else {
                        cargoExtra = 0;
                        console.log('cargoExtra', cargoExtra);
                    }
                    console.log('height en kilos extra', height);

                    if (
                        (parseInt(height, 10) > 100 && entrega === 'redpackEcoExpress') ||
                        (parseInt(height, 10) > 100 && entrega === 'redpackExpress')
                    ) {
                        cargoExtraHeight = 210;
                        console.log('cargoExtra redpack', cargoExtraHeight);
                    } else if (parseInt(height, 10) > 120 && entrega === 'fedexDiaSiguiente') {
                        cargoExtraHeight = 280;
                        console.log('cargoExtra', cargoExtraHeight);
                    } else if (parseInt(height, 10) > 120 && entrega === 'fedexEconomico') {
                        cargoExtraHeight = 110;
                        console.log('cargoExtra', cargoExtraHeight);
                    } else {
                        cargoExtraHeight = 0;
                        console.log('cargoExtra', cargoExtraHeight);
                    }
                    const precio = tarifa.guia + kilosExtra + cargoExtra;
                    console.log(
                        'precio final, sin contar seguro',
                        tarifa.guia,
                        kilosExtra,
                        cargoExtra,
                        cargoExtraHeight,
                    );
                    if (entrega === 'fedexDiaSiguiente')
                        setSupplierCostFedexDiaS({
                            id: tarifa.id,
                            precio:
                                precio +
                                getInsurancePrice('fedexDiaSiguiente') +
                                extendedAreaFedexDiaS +
                                cargoExtraHeight,
                            seguro: getInsurancePrice('fedexDiaSiguiente'),
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
                            seguro: getInsurancePrice('fedexEconomico'),
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
                            seguro: getInsurancePrice('redpackExpress'),
                            kilosExtra,
                            cargoExtraHeight: cargoExtraHeight,
                            cargoExtra: 0,
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
                                precioTotal +
                                getInsurancePrice('redpackEcoExpress') +
                                extendedAreaRedpackEco +
                                cargoExtraHeight,
                            seguro: getInsurancePrice('redpackEcoExpress'),
                            kilosExtra,
                            cargoExtraHeight: cargoExtraHeight,
                            cargoExtra: 0,
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
                            precio: precio + getInsurancePrice('autoencargos') + cargoExtraHeight,
                            seguro: getInsurancePrice('autoencargos'),
                            kilosExtra,
                            cargoExtraHeight: 0,
                            cargoExtra: 0,
                            guia,
                            zonaExt: false,
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
                    {costos.kilosExtra && (
                        <PriceContainer>
                            <PriceLabel>Kg adicionales:</PriceLabel>
                            <PriceNumber>{formatMoney(costos.kilosExtra)}</PriceNumber>
                        </PriceContainer>
                    )}
                    {costos.seguro > 0 && (
                        <PriceContainer>
                            <PriceLabel>Cargo por Seguro:</PriceLabel>
                            <PriceNumber>{formatMoney(costos.seguro)}</PriceNumber>
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
                        label="Elegir"
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
                    {!(
                        (supplierAvailability.NACIONALDIASIGUIENTE != 'undefined' &&
                            supplierCostFedexDiaS.guia) ||
                        // (supplierAvailability.NACIONALECONOMICO != 'undefined' &&
                        //     supplierCostFedexEcon.guia) ||
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
