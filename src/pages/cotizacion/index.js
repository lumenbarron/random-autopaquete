import React, { useState, useEffect, useRef } from 'react';
import PropTypes, { element } from 'prop-types';
import {
    Card,
    Button,
    Spinner,
    Input,
    CheckboxToggle,
    Picklist,
    Option,
} from 'react-rainbow-components';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useUser, useFirebaseApp } from 'reactfire';
import formatMoney from 'accounting-js/lib/formatMoney';
import toFixed from 'accounting-js/lib/toFixed';
import {
    StyledLeftPane,
    HelpLabel,
    StyledSendPage,
    StyledRightPane,
    StyledPaneContainer,
    StyledDirectiosDetails,
    StyledDetails,
    StyledError,
} from './styled';
import { Row } from 'react-bootstrap';
import swal from 'sweetalert2';

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

const cpRegex = RegExp(/^[0-9]{5}$/);
const numberRegex = RegExp(/^[0-9]+$/);
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

export const CotizacionPage = () => {
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

    const cpsAvailabilityAutoencargos = useRef(false);
    const cpsAvailabilityZEAutoencargos = useRef(false);

    const [error, setError] = useState(false);
    const [errorHeight, setErrorHeight] = useState(false);
    const [errorWidth, setErrorWidth] = useState(false);
    const [errorDepth, setErrorDepth] = useState(false);
    const [errorWeight, setErrorWeight] = useState(false);
    const [errorCPOrigin, setErrorCPOrigin] = useState(false);
    const [errorCPDestiny, setErrorCPDestiny] = useState(false);
    const [errorCityOrigin, setErrorCityOrigin] = useState(false);
    const [errorCityDestiny, setErrorCityDestiny] = useState(false);
    const [errorStateOrigin, errorSetStateOrigin] = useState(false);
    const [errorStateDestiny, setErrorStateDestiny] = useState(false);

    const [profileDoc, setProfileDoc] = useState(false);
    const [available, setAvailable] = useState(false);
    const [ready, setReady] = useState(false);
    const [suppliers, setSuppliers] = useState(false);
    const [CPOrigin, setCPOrigin] = useState('');
    const [CPDestiny, setCPDestiny] = useState('');
    const [cityOrigin, setCityOrigin] = useState('');
    const [stateOrigin, setStateOrigin] = useState({ label: '', value: '' });
    const [cityDestiny, setCityDestiny] = useState('');
    const [stateDestiny, setStateDestiny] = useState({ label: '', value: '' });

    // Package information
    const [height, setHeight] = useState('');
    const [width, setWidth] = useState('');
    const [depth, setDepth] = useState('');
    const [weight, setWeight] = useState();

    const realWeight = useRef();
    const getFinalWeight = useRef('');
    const realHeight = useRef('');
    const realWidth = useRef('');
    const realDepth = useRef('');
    const getCPOrigin = useRef('');
    const getCPDestiny = useRef('');
    const getCityOrigin = useRef('');
    const getCityDestiny = useRef('');
    const getStateOrigin = useRef('');
    const getStateDestiny = useRef('');
    const allRatesData = useRef([]);

    let supplierExtendedArea = {};
    let supplierDelivery = {};
    // let supplierFedex = false;
    // let supplierRedpack = false;
    // let supplierEstafeta = false;
    let supplierShippingName = {};
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
                    });
                });
        };
        getRates();
    }, [user]);

    useEffect(() => {
        // console.log(CPOrigin, 'cp origen')
        if (CPOrigin.length === 5) {
            fetch(
                `https://api-sepomex.hckdrk.mx/query/info_cp/${CPOrigin}?type=simplified&token=${sepomex}`,
            )
                .then(response => {
                    if (!response.ok) {
                        // console.log('CP Origen no validado');
                        setTimeout(() => {
                            swal.fire({
                                title: '!Lo siento!',
                                text: 'Código Postal de origen no válido, favor de verificar.',
                                icon: 'error',
                                confirmButtonText: 'Ok',
                            });
                            setCPOrigin('');
                        }, 1000);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.response) {
                        const { municipio, estado } = data.response;
                        setCityOrigin(municipio);
                        const stateKey = Object.keys(states).find(key => states[key] === estado);
                        setStateOrigin({ label: states[stateKey], value: stateKey });
                    }
                });
        }
    }, [CPOrigin]);

    useEffect(() => {
        // console.log(CPDestiny, 'cp destino')
        if (CPDestiny.length === 5) {
            fetch(
                `https://api-sepomex.hckdrk.mx/query/info_cp/${CPDestiny}?type=simplified&token=${sepomex}`,
            )
                .then(response => {
                    if (!response.ok) {
                        // console.log('CP no validado');
                        setTimeout(() => {
                            swal.fire({
                                title: '!Lo siento!',
                                text: 'Código Postal de destino no válido, favor de verificar.',
                                icon: 'error',
                                confirmButtonText: 'Ok',
                            });
                            setCPDestiny('');
                        }, 1000);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.response) {
                        const { municipio, estado } = data.response;
                        setCityDestiny(municipio);
                        const stateKey = Object.keys(states).find(key => states[key] === estado);
                        setStateDestiny({ label: states[stateKey], value: stateKey });
                        validateAutoencargos();
                        setAvailable(true);
                    }
                });
        }
    }, [CPDestiny]);

    const validateAutoencargos = () => {
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
                let cpSender = allCpsZMG.includes(CPOrigin);
                let cpReceiver = allCpsZMG.includes(CPDestiny);
                let cpSenderExt = extendedAreaAE.includes(CPOrigin);
                let cpReceiverExt = extendedAreaAE.includes(CPDestiny);

                // console.log(cpReceiverExt, cpSenderExt, cpReceiver, cpSender);
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
    };

    const cotizarGuia = async () => {
        setSuppliers(true);
        setReady(false);
        let data = JSON.stringify({
            sender: {
                contact_name: 'origin name',
                company_name: 'origin company',
                street: 'origin street',
                zip_code: CPOrigin,
                neighborhood: 'origin neighborhood',
                city: cityOrigin,
                country: 'MX',
                state: stateOrigin.value,
                street_number: 'origin number',
                place_reference: 'origin reference',
                phone: 'origin phone',
            },
            receiver: {
                contact_name: 'destination name',
                company_name: 'destination company',
                street: 'destination street',
                zip_code: CPDestiny,
                neighborhood: 'destination neighborhood',
                city: cityDestiny,
                country: 'MX',
                state: stateDestiny.value,
                street_number: 'destination number',
                place_reference: 'destination reference',
                phone: 'destination phone',
            },
            packages: [
                {
                    name: 'estandar',
                    height: height,
                    width: width,
                    depth: depth,
                    weight: weight === '0' ? 1 : parseInt(weight),
                    content_description: 's-d',
                    quantity: 1,
                },
            ],
        });
        // console.log(data, 'data')
        let myHeaders = new Headers();
        myHeaders.append('Authorization', tokenProd);
        myHeaders.append('Content-Type', 'application/json');
        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: data,
            redirect: 'follow',
        };

        if (CPOrigin.trim() === '' || !cpRegex.test(CPOrigin)) {
            setErrorCPOrigin(true);
            setError(true);
            return;
        } else {
            setErrorCPOrigin(false);
        }
        if (CPDestiny.trim() === '' || !cpRegex.test(CPDestiny)) {
            setErrorCPDestiny(true);
            setError(true);
            return;
        } else {
            setErrorCPDestiny(false);
        }
        if (height.trim() === '' || !numberRegex.test(height) || height <= 0) {
            setError(true);
            setErrorHeight(true);
            return;
        } else {
            setErrorHeight(false);
        }
        if (width.trim() === '' || !numberRegex.test(width) || width <= 0) {
            setError(true);
            setErrorWidth(true);
            return;
        } else {
            setErrorWidth(false);
        }
        if (depth.trim() === '' || !numberRegex.test(depth) || depth <= 0) {
            setError(true);
            setErrorDepth(true);
            return;
        } else {
            setErrorDepth(false);
        }
        if (weight === '' || weight === 0 || !numberWithDecimalRegex.test(weight)) {
            swal.fire('¡Oh no!', 'Parece que no hay un pesó válido', 'error');
            setError(true);
            setErrorWeight(true);
            return;
        } else if (weight > 70) {
            swal.fire('¡Oh no!', 'Por el momento no puedes enviar más de 70 kg', 'error');
            setError(true);
            setErrorWeight(true);
            return;
        } else {
            setErrorWeight(false);

            // await Promise.all([
            //     fetch(
            //         'https://autopaquete.simplestcode.com/api/do-shipping-quote/redpack',
            //         requestOptions,
            //     ),
            //     fetch(
            //         'https://autopaquete.simplestcode.com/api/do-shipping-quote/pakke',
            //         requestOptions,
            //     ),
            //     fetch(
            //         'https://autopaquete.simplestcode.com/api/do-shipping-quote/fedex',
            //         requestOptions,
            //     ),
            // ])
            //     .then(async ([res1, res2, res3]) => {
            //         const result1 = await res1.json();
            //         const result2 = await res2.json();
            //         const result3 = await res3.json();
            //         console.log(result1, result2, result3);
            //         let result = result1.concat(result2, result3);

            const urlRequest = `https://autopaquete.simplestcode.com/api/do-shipping-quote/`;
            // console.log('url', urlRequest);

            fetch(urlRequest, requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log(result);
                    if (result.length >= 1) {
                        setAvailable(false);
                        setCPOrigin('');
                        setCPDestiny('');
                        setCityOrigin('');
                        setStateOrigin('');
                        setCityDestiny('');
                        setStateDestiny('');
                        setHeight('');
                        setWidth('');
                        setDepth('');
                        setWeight('');
                        realHeight.current = height;
                        realWidth.current = width;
                        realDepth.current = depth;
                        realWeight.current = weight;
                        getCPOrigin.current = CPOrigin;
                        getCPDestiny.current = CPDestiny;
                        getCityOrigin.current = cityOrigin;
                        getCityDestiny.current = cityDestiny;
                        getStateOrigin.current = stateOrigin.value;
                        getStateDestiny.current = stateDestiny.value;
                        setReady(true);
                        setSuppliers(false);

                        let suppliersGeneral = result;
                        //console.log('suppliersGeneral', suppliersGeneral);
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
                        // console.log('zona extendida estafeta', supplierExtendedAreaUs);
                        //console.log('zona extendida API', supplierExtendedArea);
                        setSupplierAvailability(supplierExtendedArea);

                        //Se hace un array para ver el tipo de delivery
                        suppliersGeneral.forEach(element => {
                            if (element.delivery_type !== undefined) {
                                supplierDelivery[element.shipping_service.name] = [
                                    element.delivery_type,
                                ];
                            }
                        });
                        //console.log('delivey', supplierDelivery);
                        setSupplierAvailabilityDelivery(supplierDelivery);

                        //Se hace un nuevo array con la informacion de cada paqueteria con la respuesta de la API
                        suppliersGeneral.forEach(element => {
                            supplierShippingName[element.shipping_service.name] = [
                                element.shipping_company,
                                element.shipping_service.name,
                                element.shipping_service.description,
                                element.shipping_service.id,
                            ];
                        });
                        // console.log('result de la api', suppliersGeneral)
                        // console.log('info de respuesta de paqueteria en array', supplierShippingName)
                        setSupplierAvailabilityGeneral(supplierShippingName);
                    }
                })
                .catch(error => console.log('error', error));
        }
    };

    useEffect(() => {
        // console.log(realWeight.current, 'peso registrado')
        if (realWeight.current === '') return;
        if (!supplierAvailability || !profileDoc) return;

        //Validaciones del peso
        let pricedWeight = Math.ceil(realWeight.current);
        // console.log('peso fisico', pricedWeight)
        //Si el peso es mayor a uno, se le asigna su peso, en otro caso se le asigna 1
        pricedWeight = pricedWeight > 1 ? pricedWeight : 1;
        const volumetricWeight = Math.ceil(
            (realHeight.current * realWidth.current * realDepth.current) / 5000,
        );
        // console.log('peso vol', volumetricWeight)
        if (volumetricWeight > realWeight.current) {
            // console.log('el peso volumetrico es mayor que el peso declarado');
            pricedWeight = volumetricWeight;
            // setFinalWeight(pricedWeight);
            getFinalWeight.current = pricedWeight;
            // console.log('peso vol mayor a fisico', pricedWeight);
        } else {
            // setFinalWeight(pricedWeight);
            getFinalWeight.current = pricedWeight;
            //  console.log('peso fisico se quedA', pricedWeight);
        }

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

                    // console.log(
                    //     'todos los provedores activos',
                    //     supplierAvailabilityGeneral,
                    // );
                    // Encontramos si hay tarifas que apliquen directo al paquete
                    if (
                        !kgExtra &&
                        parseInt(min, 10) <= parseInt(pricedWeight, 10) &&
                        parseInt(max, 10) >= parseInt(pricedWeight, 10)
                    ) {
                        //  console.log('Encontramos si hay tarifas que apliquen directo al paquete');
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
                                    // getInsurancePrice('estafetaDiaSiguiente') +
                                    extendedAreaEstafetaDiaS +
                                    cargoExtraHeight,
                                delivery: 'NORMAL',
                                cargoExtraHeight: cargoExtraHeight,
                                guia: getFinalPriceEstafetaDiaS.finalPrice,
                                zonaExt: extendedAreaEstafetaDiaS != 0 ? 110 : false,
                                shippingInfo: !supplierAvailabilityGeneral.ESTAFETADIASIGUIENTE
                                    ? false
                                    : supplierAvailabilityGeneral.ESTAFETADIASIGUIENTE,
                                // insurance: getInsurancePrice('estafetaDiaSiguiente'),
                            });
                        if (entrega === 'estafetaEconomico')
                            setSupplierCostEstafetaEcon({
                                id: doc.id,
                                precio:
                                    getFinalPriceEstafetaEco.finalPrice +
                                    // getInsurancePrice('estafetaEconomico') +
                                    extendedAreaEstafetaEco +
                                    cargoExtraHeight,
                                delivery: 'NORMAL',
                                cargoExtraHeight: cargoExtraHeight,
                                guia: getFinalPriceEstafetaEco.finalPrice,
                                zonaExt: extendedAreaEstafetaEco != 0 ? 110 : false,
                                shippingInfo: !supplierAvailabilityGeneral.ESTAFETATERRESTRECONSUMO
                                    ? false
                                    : supplierAvailabilityGeneral.ESTAFETATERRESTRECONSUMO,
                                // insurance: getInsurancePrice('estafetaEconomico'),
                            });
                        if (entrega === 'fedexDiaSiguiente')
                            setSupplierCostFedexDiaS({
                                id: doc.id,
                                precio:
                                    getFinalPriceFedexDiaS.finalPrice +
                                    // getInsurancePrice('fedexDiaSiguiente') +
                                    extendedAreaFedexDiaS +
                                    cargoExtraHeight,
                                delivery: 'NORMAL',
                                cargoExtraHeight: cargoExtraHeight,
                                guia: getFinalPriceFedexDiaS.finalPrice,
                                zonaExt: extendedAreaFedexDiaS != 0 ? 150 : false,
                                shippingInfo: !supplierAvailabilityGeneral.NACIONALDIASIGUIENTE
                                    ? false
                                    : supplierAvailabilityGeneral.NACIONALDIASIGUIENTE,
                                // insurance: getInsurancePrice('fedexDiaSiguiente'),
                            });
                        if (entrega === 'fedexEconomico')
                            setSupplierCostFedexEcon({
                                id: doc.id,
                                precio:
                                    getFinalPriceFedexEco.finalPrice +
                                    // getInsurancePrice('fedexEconomico') +
                                    extendedAreaFedexEco +
                                    cargoExtraHeight,
                                delivery: 'NORMAL',
                                cargoExtraHeight: cargoExtraHeight,
                                guia: getFinalPriceFedexEco.finalPrice,
                                zonaExt: extendedAreaFedexEco != 0 ? 150 : false,
                                shippingInfo: !supplierAvailabilityGeneral.NACIONALECONOMICO
                                    ? false
                                    : supplierAvailabilityGeneral.NACIONALECONOMICO,
                                // insurance: getInsurancePrice('fedexEconomico'),
                            });
                        if (entrega === 'redpackExpress')
                            setSupplierCostRedpackEx({
                                id: doc.id,
                                precio:
                                    getFinalPriceRedExp.finalPrice +
                                    // getInsurancePrice('redpackExpress') +
                                    extendedAreaRedpackExp +
                                    cargoExtraHeight,
                                delivery: supplierAvailabilityDelivery.EXPRESS,
                                cargoExtraHeight: cargoExtraHeight,
                                guia: getFinalPriceRedExp.finalPrice,
                                zonaExt: extendedAreaRedpackExp != 0 ? 130 : false,
                                shippingInfo: !supplierAvailabilityGeneral.EXPRESS
                                    ? false
                                    : supplierAvailabilityGeneral.EXPRESS,
                                // insurance: getInsurancePrice('redpackExpress'),
                            });
                        if (entrega === 'redpackEcoExpress')
                            setSupplierCostRedpackEco({
                                id: doc.id,
                                precio:
                                    getFinalPriceRedEco.finalPrice +
                                    // getInsurancePrice('redpackEcoExpress') +
                                    extendedAreaRedpackEco +
                                    cargoExtraHeight,
                                delivery: supplierAvailabilityDelivery.ECOEXPRESS,
                                cargoExtraHeight: cargoExtraHeight,
                                guia: getFinalPriceRedEco.finalPrice,
                                zonaExt: extendedAreaRedpackEco != 0 ? 130 : false,
                                shippingInfo: !supplierAvailabilityGeneral.ECOEXPRESS
                                    ? false
                                    : supplierAvailabilityGeneral.ECOEXPRESS,
                                // insurance: getInsurancePrice('redpackEcoExpress'),
                            });
                        if (entrega === 'autoencargos')
                            setSupplierCostAutoencargosEcon({
                                id: doc.id,
                                precio:
                                    getFinalPriceAuto.finalPrice +
                                    // getInsurancePrice('autoencargos') +
                                    extendedAreaAutoencargos +
                                    cargoExtraHeight,
                                delivery: 'NORMAL',
                                cargoExtraHeight: 0,
                                guia: getFinalPriceAuto.finalPrice,
                                zonaExt: extendedAreaAutoencargos != 0 ? 40 : false,
                                shippingInfo: !supplierAvailabilityGeneral.AUTOENCARGOS
                                    ? false
                                    : supplierAvailabilityGeneral.AUTOENCARGOS,
                                // insurance: getInsurancePrice('autoencargos'),
                            });
                        return;
                    }
                    if (parseInt(pricedWeight, 10) > parseInt(max, 10) && !kgExtra) {
                        //  console.log('entrando a kilos extra');
                        // console.log('precioTotal', precioTotal, 'entrega', entrega);
                        let diferencia = (parseInt(pricedWeight, 10) - parseInt(max, 10)) * 1;
                        // console.log('diferencia', entrega, diferencia)
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
                    // console.log('tarifa', tarifa)
                    // console.log('tarifas de kg extra', kgsExtraTarifas)
                    let cargoExtra;
                    let cargoExtraHeight;
                    const { guia } = tarifa;
                    const kilosExtra = tarifa.diferencia * kgsExtraTarifas[entrega];
                    //console.log('peso', weight, 'peso real', realWeight);
                    if (
                        (realWeight.current > 30 && entrega === 'fedexDiaSiguiente') ||
                        (realWeight.current > 30 && entrega === 'fedexEconomico')
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
                    //     entrega,
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
                                // getInsurancePrice('estafetaDiaSiguiente') +
                                extendedAreaEstafetaDiaS +
                                cargoExtraHeight,

                            delivery: 'NORMAL',
                            kilosExtra,
                            cargoExtraHeight,
                            cargoExtra,
                            guia,
                            zonaExt: extendedAreaEstafetaDiaS != 0 ? 110 : false,
                            shippingInfo: !supplierAvailabilityGeneral.ESTAFETADIASIGUIENTE
                                ? false
                                : supplierAvailabilityGeneral.ESTAFETADIASIGUIENTE,
                            // insurance: getInsurancePrice('estafetaDiaSiguiente'),
                        });
                    if (entrega === 'estafetaEconomico')
                        setSupplierCostEstafetaEcon({
                            id: tarifa.id,
                            precio:
                                precio +
                                // getInsurancePrice('estafetaEconomico') +
                                extendedAreaEstafetaEco +
                                cargoExtraHeight,
                            delivery: 'NORMAL',
                            kilosExtra,
                            cargoExtraHeight,
                            cargoExtra,
                            guia,
                            zonaExt: extendedAreaEstafetaEco != 0 ? 110 : false,
                            shippingInfo: !supplierAvailabilityGeneral.ESTAFETATERRESTRECONSUMO
                                ? false
                                : supplierAvailabilityGeneral.ESTAFETATERRESTRECONSUMO,
                            // insurance: getInsurancePrice('estafetaEconomico'),
                        });
                    if (entrega === 'fedexDiaSiguiente')
                        setSupplierCostFedexDiaS({
                            id: tarifa.id,
                            precio:
                                precio +
                                // getInsurancePrice('fedexDiaSiguiente') +
                                extendedAreaFedexDiaS +
                                cargoExtraHeight,
                            delivery: 'NORMAL',
                            kilosExtra,
                            cargoExtraHeight,
                            cargoExtra,
                            guia,
                            zonaExt: extendedAreaFedexDiaS != 0 ? 150 : false,
                            shippingInfo: !supplierAvailabilityGeneral.NACIONALDIASIGUIENTE
                                ? false
                                : supplierAvailabilityGeneral.NACIONALDIASIGUIENTE,
                            // insurance: getInsurancePrice('fedexDiaSiguiente'),
                        });
                    if (entrega === 'fedexEconomico')
                        setSupplierCostFedexEcon({
                            id: tarifa.id,
                            precio:
                                precio +
                                // getInsurancePrice('fedexEconomico') +
                                extendedAreaFedexEco +
                                cargoExtraHeight,
                            delivery: 'NORMAL',
                            kilosExtra,
                            cargoExtraHeight,
                            cargoExtra,
                            guia,
                            zonaExt: extendedAreaFedexEco != 0 ? 150 : false,
                            shippingInfo: !supplierAvailabilityGeneral.NACIONALECONOMICO
                                ? false
                                : supplierAvailabilityGeneral.NACIONALECONOMICO,
                            // insurance: getInsurancePrice('fedexEconomico'),
                        });
                    if (entrega === 'redpackExpress')
                        setSupplierCostRedpackEx({
                            id: tarifa.id,
                            precio:
                                precio +
                                // getInsurancePrice('redpackExpress') +
                                extendedAreaRedpackExp +
                                cargoExtraHeight,
                            delivery: supplierAvailabilityDelivery.EXPRESS,
                            kilosExtra,
                            cargoExtraHeight: cargoExtraHeight,
                            cargoExtra,
                            guia,
                            zonaExt: extendedAreaRedpackExp != 0 ? 130 : false,
                            shippingInfo: !supplierAvailabilityGeneral.EXPRESS
                                ? false
                                : supplierAvailabilityGeneral.EXPRESS,
                            // insurance: getInsurancePrice('redpackExpress'),
                        });
                    if (entrega === 'redpackEcoExpress')
                        setSupplierCostRedpackEco({
                            id: tarifa.id,
                            precio:
                                precio +
                                // getInsurancePrice('redpackEcoExpress') +
                                extendedAreaRedpackEco +
                                cargoExtraHeight,
                            delivery: supplierAvailabilityDelivery.ECOEXPRESS,
                            kilosExtra,
                            cargoExtraHeight: cargoExtraHeight,
                            cargoExtra,
                            guia,
                            zonaExt: extendedAreaRedpackEco != 0 ? 130 : false,
                            shippingInfo: !supplierAvailabilityGeneral.ECOEXPRESS
                                ? false
                                : supplierAvailabilityGeneral.ECOEXPRESS,
                            // insurance: getInsurancePrice('redpackEcoExpress'),
                        });
                    if (entrega === 'autoencargos')
                        setSupplierCostAutoencargosEcon({
                            id: tarifa.id,
                            precio:
                                precio +
                                // getInsurancePrice('autoencargos') +
                                extendedAreaAutoencargos +
                                cargoExtraHeight,
                            delivery: 'NORMAL',
                            kilosExtra,
                            cargoExtraHeight: 0,
                            cargoExtra,
                            guia,
                            zonaExt: extendedAreaAutoencargos != 0 ? 40 : false,
                            shippingInfo: !supplierAvailabilityGeneral.AUTOENCARGOS
                                ? false
                                : supplierAvailabilityGeneral.AUTOENCARGOS,
                            // insurance: getInsurancePrice('autoencargos'),
                        });
                });
            });
    }, [realWeight.current, supplierAvailability, supplierAvailabilityGeneral, profileDoc]);

    const supplierCard = (proveedor, tipoEnvio, entrega, costos) => (
        <Card className="rainbow-flex rainbow-flex_column rainbow-align_center rainbow-justify_space-around rainbow-p-around_large rainbow-m-around_small">
            {/* {console.log('proveedor', proveedor, 'tipoEnvio', tipoEnvio , 'entrega', entrega, 'costos', costos )} */}
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
            {costos.delivery !== 'Normal' ||
                (costos.delivery !== 'NORMAL' && (
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
                ))}
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
                    {/* <Button
                        label="Elegir"
                        variant="brand"
                        onClick={() => registerService(proveedor, tipoEnvio, costos)}
                    /> */}
                </>
            )}
        </Card>
    );
    return (
        <>
            <StyledSendPage>
                <Row className="pb-4 pl-3">
                    <h1>Cotización Rapida</h1>
                </Row>
                <StyledPaneContainer>
                    <StyledRightPane>
                        <h4>Origen</h4>
                        <div className="rainbow-align-content_center ">
                            <Input
                                id="cp"
                                label="C.P."
                                name="cp"
                                value={CPOrigin}
                                className={`rainbow-p-around_medium ${
                                    errorCPOrigin ? 'empty-space' : ''
                                }`}
                                // style={{ width: '30%' }}
                                onChange={e => setCPOrigin(e.target.value)}
                            />
                        </div>
                        {errorCPOrigin && (
                            <div className="alert-error pl-4">
                                CP no validado, favor de verificarlo
                            </div>
                        )}
                        <Input
                            // readOnly
                            id="ciudad"
                            label="Ciudad"
                            name="ciudad"
                            value={cityOrigin}
                            className={`rainbow-p-around_medium ${
                                errorCityOrigin ? 'empty-space' : ''
                            }`}
                            style={{ flex: '1 1' }}
                            onChange={e => setCityOrigin(e.target.value)}
                        />
                        <Picklist
                            id="estado"
                            //  readOnly
                            label="Estado"
                            name="estado"
                            value={stateOrigin}
                            className={`rainbow-p-around_medium ${
                                errorStateOrigin ? 'empty-space' : ''
                            }`}
                            style={{ flex: '1 1' }}
                            onChange={value => setStateOrigin(value)}
                            required
                        >
                            <StatePicklistOptions />
                        </Picklist>
                    </StyledRightPane>
                    <StyledRightPane>
                        <h4>Destino</h4>
                        <div className="rainbow-align-content_center rainbow-flex_wrap">
                            <Input
                                id="cp"
                                label="C.P."
                                name="cp"
                                value={CPDestiny}
                                className={`rainbow-p-around_medium ${
                                    errorCPDestiny ? 'empty-space' : ''
                                }`}
                                // style={{ width: '30%' }}
                                onChange={e => setCPDestiny(e.target.value)}
                            />
                        </div>
                        {errorCPDestiny && (
                            <div className="alert-error pl-4">
                                CP no validado, favor de verificarlo
                            </div>
                        )}
                        <Input
                            // readOnly
                            id="ciudad"
                            label="Ciudad"
                            name="ciudad"
                            value={cityDestiny}
                            className={`rainbow-p-around_medium ${
                                errorCityDestiny ? 'empty-space' : ''
                            }`}
                            style={{ flex: '1 1' }}
                            onChange={e => setCityDestiny(e.target.value)}
                        />
                        <Picklist
                            id="estado"
                            label="Estado"
                            name="estado"
                            value={stateDestiny}
                            className={`rainbow-p-around_medium ${
                                errorStateDestiny ? 'empty-space' : ''
                            }`}
                            style={{ flex: '1 1' }}
                            onChange={value => setStateDestiny(value)}
                            required
                        >
                            <StatePicklistOptions />
                        </Picklist>
                    </StyledRightPane>
                    <StyledRightPane>
                        <h4>Medidas y Peso</h4>
                        <div style={{ minWidth: '300px' }}>
                            <div style={{ display: 'flex' }}>
                                <Input
                                    id="height"
                                    name="height"
                                    label="largo"
                                    value={height}
                                    className={`rainbow-p-around_medium ${
                                        errorHeight ? 'empty-space' : ''
                                    }`}
                                    style={{ width: '30%' }}
                                    onChange={e => setHeight(e.target.value)}
                                />
                                <HelpLabel>x</HelpLabel>
                                <Input
                                    id="width"
                                    name="width"
                                    label="ancho"
                                    value={width}
                                    className={`rainbow-p-around_medium ${
                                        errorWidth ? 'empty-space' : ''
                                    }`}
                                    style={{ width: '30%' }}
                                    onChange={e => setWidth(e.target.value)}
                                />
                                <HelpLabel>x</HelpLabel>
                                <Input
                                    id="depth"
                                    name="depth"
                                    label="alto"
                                    value={depth}
                                    className={`rainbow-p-around_medium ${
                                        errorDepth ? 'empty-space' : ''
                                    }`}
                                    style={{ width: '30%' }}
                                    onChange={e => setDepth(e.target.value)}
                                />
                                <HelpLabel>cm</HelpLabel>
                            </div>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <Input
                                id="peso"
                                label="Peso"
                                name="peso"
                                value={weight}
                                className={`rainbow-p-around_medium ${
                                    errorWeight ? 'empty-space' : ''
                                }`}
                                style={{ flex: '1 1' }}
                                onChange={e => setWeight(e.target.value)}
                            />
                            <HelpLabel>kgs</HelpLabel>
                        </div>
                    </StyledRightPane>
                </StyledPaneContainer>
                <StyledError>
                    {error && (
                        <div className="alert-error">
                            <h3>Corregir los campos marcados</h3>
                        </div>
                    )}
                </StyledError>
                <Row className="container-cotizar my-3">
                    <Button
                        label="Cotizar guía"
                        className="button-cotizar"
                        disabled={available ? false : true}
                        onClick={() => cotizarGuia()}
                    />
                </Row>
                {hasActivatedSuppliers === false && (
                    <h1>Ningún servicio activado, contacte a un administrador</h1>
                )}
                {supplierExtraWeight === false && (
                    <h1>
                        No tienes tarifa de kilos extra para ese provedor, por favor contacte a un
                        administrador
                    </h1>
                )}
                {hasActivatedSuppliers &&
                    // && !supplierAvailability
                    suppliers && (
                        <div className="rainbow-p-vertical_xx-large">
                            <h2>Obteniendo precios...</h2>
                            <div className="rainbow-position_relative rainbow-m-vertical_xx-large rainbow-p-vertical_xx-large">
                                <Spinner size="large" variant="brand" />
                            </div>
                        </div>
                    )}
                {hasActivatedSuppliers &&
                    //  && supplierAvailability
                    ready && (
                        <>
                            <StyledDirectiosDetails style={{ justifyContent: 'center' }}>
                                <StyledDetails>
                                    <span>
                                        <b>Origen</b>
                                    </span>
                                    <p>C.P. {getCPOrigin.current}</p>
                                    <p>Ciudad {getCityOrigin.current}</p>
                                    <p>Estado {getStateOrigin.current}</p>
                                </StyledDetails>
                                <StyledDetails>
                                    <span>
                                        <b>Destino</b>
                                    </span>
                                    <p>C.P. {getCPDestiny.current}</p>
                                    <p>Ciudad {getCityDestiny.current}</p>
                                    <p>Estado {getStateDestiny.current}</p>
                                </StyledDetails>
                                <StyledDetails>
                                    <span>
                                        <b>Paquete</b>
                                    </span>
                                    <p>Peso Físico: {realWeight.current} kgs</p>
                                    <p>
                                        Dimensiones: {realHeight.current}x{realWidth.current}x
                                        {realDepth.current} cm
                                    </p>
                                    <p>Peso Final: {getFinalWeight.current} kgs</p>
                                </StyledDetails>
                            </StyledDirectiosDetails>

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
                            </Row>
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
                            ) && (
                                <h1>
                                    {' '}
                                    ¡Oh no! Ha ocurrido un error, favor de contactar a tu asesor.
                                </h1>
                            )}
                        </>
                    )}
            </StyledSendPage>
        </>
    );
};

export default CotizacionPage;

// ServicioComponent.propTypes = {
//     onSave: PropTypes.func.isRequired,
//     idGuiaGlobal: PropTypes.string.isRequired,
// };
