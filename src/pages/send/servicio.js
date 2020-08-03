import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, Button } from 'react-rainbow-components';
import styled from 'styled-components';
import { useUser, useFirebaseApp } from 'reactfire';
import formatMoney from 'accounting-js/lib/formatMoney';
import { StyledPaneContainer, StyledDirectiosDetails, StyledDetails, StyledError } from './styled';

const PriceContainer = styled.div`
    display: flex;
    margin-bottom: 0.5rem;
    flex-direction: row;
    width: 50%;
    min-width: 170px;
`;

const PriceLabel = styled.div`
    display: flex;
    flex: '1 1';
`;

const PriceNumber = styled.div`
    text-align: right;
    flex: '1 1';
`;

export const ServicioComponent = ({ onSave, idGuiaGlobal }) => {
    const [supplierAvailability, setSupplierAvailability] = useState(false);

    const [supplierCostFedexDiaS, setSupplierCostFedexDiaS] = useState(false);
    const [supplierCostFedexEcon, setSupplierCostFedexEcon] = useState(false);

    const [supplierCostEstafetaDiaS, setSupplierCostEstafetaDiaS] = useState(false);
    const [supplierCostEstafetaEcon, setSupplierCostEstafetaEcon] = useState(false);

    const user = useUser();
    const firebase = useFirebaseApp();
    const db = firebase.firestore();

    // Sender states
    const [nameSender, setNameSender] = useState();
    const [CPSender, setCPSender] = useState('');
    const [neighborhoodSender, setNeighborhoodSender] = useState('');
    const [countrySender, setCountrySender] = useState('');
    const [streetNumberSender, setStreetNumberSender] = useState('');
    const [phoneSender, setPhoneSender] = useState('');
    // Receiver states
    const [nameReceiver, setNameReceiver] = useState();
    const [CPReceiver, setCPReceiver] = useState('');
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
    const [quantity, setQuantity] = useState('');
    const [contentValue, setContentValue] = useState('');
    const [error, setError] = useState(false);

    const [docId, setDocId] = useState();

    const registerService = (supplier, type, { id, precio, ...cargos }) => {
        db.collection('profiles')
            .where('ID', '==', user.uid)
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    if (parseFloat(precio) > parseFloat(doc.data().saldo)) {
                        setError(true);
                    } else {
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
                                            Supplier_cost: precio,
                                            tarifa,
                                            cargos,
                                        };
                                        onSave(supplierData);
                                    });
                            });
                    }
                });
            })
            .catch(function(error) {
                console.log('Error getting documents: ', error);
            });
    };

    useEffect(() => {
        user.getIdToken().then(idToken => {
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'json';
            xhr.contentType = 'application/json';
            xhr.open('POST', '/guia/cotizar');
            xhr.setRequestHeader('Authorization', `Bearer ${idToken}`);
            xhr.send(JSON.stringify({ guiaId: idGuiaGlobal }));
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    setSupplierAvailability(xhr.response);
                }
            };
        });
    }, []);

    useEffect(() => {
        db.collection('guia')
            .doc(idGuiaGlobal)
            .onSnapshot(function getGuia(doc) {
                // Get snapshot sender information
                setNameSender(doc.data().sender_addresses.name);
                setCPSender(doc.data().sender_addresses.codigo_postal);
                setNeighborhoodSender(doc.data().sender_addresses.neighborhood);
                setCountrySender(doc.data().sender_addresses.country);
                setStreetNumberSender(doc.data().sender_addresses.street_number);
                setPhoneSender(doc.data().sender_addresses.phone);
                // Get snapshot to receive Receiver information
                setNameReceiver(doc.data().receiver_addresses.name);
                setCPReceiver(doc.data().receiver_addresses.codigo_postal);
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
        if (weight === '') return;
        if (!supplierAvailability) return;
        let pricedWeight = weight;
        const volumetricWeight = Math.ceil((height * width * depth) / 5000);
        if (volumetricWeight > weight) {
            pricedWeight = volumetricWeight;
        }

        const getInsurancePrice = company => {
            if (contentValue === '') return 0;
            const baseValue = parseInt(contentValue, 10) * 0.02;
            const extraValue = 40;
            if (company === 'fedexDiaSiguiente' || company === 'fedexEconomico') {
                return baseValue + extraValue;
            }
            if (company === 'estafetaDiaSiguiente' || company === 'estafetaEconomico') {
                return baseValue;
            }
            return 0;
        };
        db.collection('profiles')
            .where('ID', '==', user.uid)
            .get()
            .then(profile => {
                profile.docs[0].ref.collection('rate').onSnapshot(querySnapshot => {
                    const segundaMejorTarifa = {};
                    const kgsExtraTarifas = {};
                    querySnapshot.forEach(doc => {
                        const { entrega, precio, max, min, kgExtra } = doc.data();
                        // Encontramos si hay tarifas que apliquen directo al paquete
                        if (
                            !kgExtra &&
                            parseInt(min, 10) <= parseInt(pricedWeight, 10) &&
                            parseInt(max, 10) >= parseInt(pricedWeight, 10)
                        ) {
                            const precioTotal = parseInt(precio, 10) * quantity;
                            if (entrega === 'fedexDiaSiguiente')
                                setSupplierCostFedexDiaS({
                                    id: doc.id,
                                    precio:
                                        precioTotal +
                                        getInsurancePrice('fedexDiaSiguiente') +
                                        (typeof supplierAvailability.fedexDiaSiguiente
                                            .zonaExtendida !== 'undefined'
                                            ? 150
                                            : 0),
                                    seguro: getInsurancePrice('fedexDiaSiguiente'),
                                    guia: precioTotal,
                                    zonaExt: !!supplierAvailability.fedexDiaSiguiente.zonaExtendida,
                                });
                            if (entrega === 'fedexEconomico')
                                setSupplierCostFedexEcon({
                                    id: doc.id,
                                    precio:
                                        precioTotal +
                                        getInsurancePrice('fedexEconomico') +
                                        (typeof supplierAvailability.fedexEconomico
                                            .zonaExtendida !== 'undefined'
                                            ? 150
                                            : 0),
                                    seguro: getInsurancePrice('fedexEconomico'),
                                    guia: precioTotal,
                                    zonaExt: !!supplierAvailability.fedexEconomico.zonaExtendida,
                                });
                            if (entrega === 'estafetaDiaSiguiente')
                                setSupplierCostEstafetaDiaS({
                                    id: doc.id,
                                    precio:
                                        precioTotal +
                                        getInsurancePrice('estafetaDiaSiguiente') +
                                        (typeof supplierAvailability.estafetaDiaSiguiente
                                            .zonaExtendida !== 'undefined'
                                            ? 150
                                            : 0),
                                    seguro: getInsurancePrice('estafetaDiaSiguiente'),
                                    guia: precioTotal,
                                    zonaExt: !!supplierAvailability.estafetaDiaSiguiente
                                        .zonaExtendida,
                                });
                            if (entrega === 'estafetaEconomico')
                                setSupplierCostEstafetaEcon({
                                    id: doc.id,
                                    precio:
                                        precioTotal +
                                        getInsurancePrice('estafetaEconomico') +
                                        (typeof supplierAvailability.estafetaEconomico
                                            .zonaExtendida !== 'undefined'
                                            ? 150
                                            : 0),
                                    seguro: getInsurancePrice('estafetaEconomico'),
                                    guia: precioTotal,
                                    zonaExt: !!supplierAvailability.estafetaEconomico.zonaExtendida,
                                });
                            return;
                        }

                        // Anotamos los cargos de kg extra, por si los necesitamos
                        if (kgExtra) {
                            kgsExtraTarifas[entrega.slice(0, entrega.indexOf('Extra'))] = parseInt(
                                kgExtra,
                                10,
                            );
                            return;
                        }

                        // Si el mínimo de kgs de la tarifa es mayor al peso, no aplica
                        if (parseInt(min, 10) > parseInt(pricedWeight, 10)) {
                            return;
                        }

                        // Esto ocurre si el máximo es menor y el mínimo es menor que el peso,
                        // es decir, nos sobran kilos
                        const diferencia =
                            (parseInt(pricedWeight, 10) - parseInt(max, 10)) * quantity;

                        //console.log('Diferencia Variable', diferencia);
                        if (
                            !segundaMejorTarifa[entrega] ||
                            segundaMejorTarifa[entrega].diferencia > diferencia
                        ) {
                            const precioTotal = parseInt(precio, 10) * quantity;

                            segundaMejorTarifa[entrega] = {
                                id: doc.id,
                                //  precio: precioTotal + getInsurancePrice('estafetaEconomico'),
                                guia: precioTotal,
                                //  seguro: getInsurancePrice('estafetaEconomico'),
                                diferencia,
                            };
                            return;
                        }
                    });
                    Object.keys(segundaMejorTarifa).forEach(entrega => {
                        const tarifa = segundaMejorTarifa[entrega];
                        const { guia } = tarifa;
                        const precio = tarifa.guia + tarifa.diferencia * kgsExtraTarifas[entrega];
                        //console.log('guia tarifa', tarifa.diferencia);
                        console.log('Entrega', entrega);
                        const cargoExtra = tarifa.diferencia * kgsExtraTarifas[entrega];
                        console.log('kgsExtraTarifas', kgsExtraTarifas);
                        if (entrega === 'fedexDiaSiguiente')
                            setSupplierCostFedexDiaS({
                                id: tarifa.id,
                                precio:
                                    precio +
                                    getInsurancePrice('fedexDiaSiguiente') +
                                    (typeof supplierAvailability.fedexDiaSiguiente.zonaExtendida !==
                                    'undefined'
                                        ? 150
                                        : 0),
                                seguro: getInsurancePrice('fedexDiaSiguiente'),
                                cargoExtra,
                                guia,
                                zonaExt: !!supplierAvailability.fedexDiaSiguiente.zonaExtendida,
                            });
                        if (entrega === 'fedexEconomico')
                            setSupplierCostFedexEcon({
                                id: tarifa.id,
                                precio:
                                    precio +
                                    getInsurancePrice('fedexEconomico') +
                                    (typeof supplierAvailability.fedexEconomico.zonaExtendida !==
                                    'undefined'
                                        ? 150
                                        : 0),
                                seguro: getInsurancePrice('fedexEconomico'),
                                cargoExtra,
                                guia,
                                zonaExt: !!supplierAvailability.fedexEconomico.zonaExtendida,
                            });
                        if (entrega === 'estafetaDiaSiguiente')
                            setSupplierCostEstafetaDiaS({
                                id: tarifa.id,
                                precio:
                                    precio +
                                    getInsurancePrice('estafetaDiaSiguiente') +
                                    (typeof supplierAvailability.estafetaDiaSiguiente
                                        .zonaExtendida !== 'undefined'
                                        ? 150
                                        : 0),
                                seguro: getInsurancePrice('estafetaDiaSiguiente'),
                                cargoExtra,
                                guia,
                                zonaExt: !!supplierAvailability.estafetaDiaSiguiente.zonaExtendida,
                            });
                        if (entrega === 'estafetaEconomico')
                            setSupplierCostEstafetaEcon({
                                id: tarifa.id,
                                precio:
                                    precio +
                                    getInsurancePrice('estafetaEconomico') +
                                    (typeof supplierAvailability.estafetaEconomico.zonaExtendida !==
                                    'undefined'
                                        ? 150
                                        : 0),
                                seguro: getInsurancePrice('estafetaEconomico'),
                                cargoExtra,
                                guia,
                                zonaExt: !!supplierAvailability.estafetaEconomico.zonaExtendida,
                            });
                    });
                });
            });
    }, [weight, quantity, contentValue, supplierAvailability]);

    const supplierCard = (proveedor, tipoEnvio, entrega, costos) => (
        <Card className="rainbow-flex rainbow-flex_column rainbow-align_center rainbow-justify_space-around rainbow-p-around_large rainbow-m-around_small">
            {proveedor === 'fedex' && <img src="/assets/fedex.png" alt="Fedex" />}
            {proveedor === 'estafeta' && <img src="/assets/estafeta.png" alt="Estafeta" />}
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
                    {costos.cargoExtra && (
                        <PriceContainer>
                            <PriceLabel>Kg adicionales:</PriceLabel>
                            <PriceNumber>{formatMoney(costos.cargoExtra)}</PriceNumber>
                        </PriceContainer>
                    )}
                    {costos.seguro > 0 && (
                        <PriceContainer>
                            <PriceLabel>Cargo por Seguro:</PriceLabel>
                            <PriceNumber>{formatMoney(costos.seguro)}</PriceNumber>
                        </PriceContainer>
                    )}
                    {costos.zonaExt && (
                        <PriceContainer>
                            <PriceLabel>Zona Extendida:</PriceLabel>
                            <PriceNumber>{formatMoney(150)}</PriceNumber>
                        </PriceContainer>
                    )}
                    <br />
                    <PriceContainer>
                        <PriceLabel>Subtotal:</PriceLabel>
                        <PriceNumber>{formatMoney(costos.precio * 0.862)}</PriceNumber>
                    </PriceContainer>
                    <PriceContainer>
                        <PriceLabel>IVA:</PriceLabel>
                        <PriceNumber>{formatMoney(costos.precio * 0.138)}</PriceNumber>
                    </PriceContainer>
                    <h1> {formatMoney(costos.precio)}</h1>
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
                    <p>Peso: {weight} kgs</p>
                    {contentValue !== '' && <p>Valor asegurado: ${contentValue}</p>}
                </StyledDetails>
            </StyledDirectiosDetails>
            <StyledError>
                {error && <div className="alert-error">No tienes el saldo suficiente</div>}
            </StyledError>
            {!supplierAvailability && <h1>Obteniendo precios...</h1>}
            {supplierAvailability && (
                <StyledPaneContainer style={{ justifyContent: 'center' }}>
                    {supplierAvailability.fedexDiaSiguiente &&
                        supplierCostFedexDiaS.guia &&
                        supplierCard(
                            'fedex',
                            'DiaSiguiente',
                            'Día Siguiente',
                            supplierCostFedexDiaS,
                        )}
                    {supplierAvailability.fedexEconomico &&
                        supplierCostFedexEcon.guia &&
                        supplierCard(
                            'fedex',
                            'Economico',
                            '3 a 5 días hábiles',
                            supplierCostFedexEcon,
                        )}
                    {supplierAvailability.estafetaDiaSiguiente &&
                        supplierCostEstafetaDiaS.guia &&
                        supplierCard(
                            'estafeta',
                            'DiaSiguiente',
                            'Día Siguiente',
                            supplierCostEstafetaDiaS,
                        )}
                    {supplierAvailability.estafetaEconomico &&
                        supplierCostEstafetaEcon.guia &&
                        supplierCard(
                            'estafeta',
                            'Economico',
                            '3 a 5 días hábiles',
                            supplierCostEstafetaEcon,
                        )}
                </StyledPaneContainer>
            )}
        </>
    );
};

ServicioComponent.propTypes = {
    onSave: PropTypes.func.isRequired,
    idGuiaGlobal: PropTypes.string.isRequired,
};
