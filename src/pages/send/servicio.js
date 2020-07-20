import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, Button } from 'react-rainbow-components';
import styled from 'styled-components';
import { useUser, useFirebaseApp } from 'reactfire';
import { StyledPaneContainer, StyledDirectiosDetails, StyledDetails } from './styled';

const DetailsLabel = styled.p`
    margin-bottom: 1.2rem;
`;

export const ServicioComponent = ({ onSave, idGuiaGlobal }) => {
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

    const [docId, setDocId] = useState();

    const registerService = (supplier, type, { id, precio, ...cargos }) => {
        db.collection('profiles')
            .where('ID', '==', user.uid)
            .get()
            .then(profile => {
                profile.docs[0].ref
                    .collection('rate')
                    .doc(id)
                    .get()
                    .then(doc => {
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
    };

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
        let pricedWeight = weight;
        const volumetricWeight = Math.ceil((height * width * depth) / 5000);
        if (volumetricWeight > weight) {
            pricedWeight = volumetricWeight;
        }
        const insurancePrice = contentValue !== '' ? 40 + parseInt(contentValue, 10) * 0.02 : 0;
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
                                    precio: precioTotal + insurancePrice,
                                    seguro: insurancePrice,
                                    guia: precioTotal,
                                });
                            if (entrega === 'fedexEconomico')
                                setSupplierCostFedexEcon({
                                    id: doc.id,
                                    precio: precioTotal + insurancePrice,
                                    seguro: insurancePrice,
                                    guia: precioTotal,
                                });
                            if (entrega === 'estafetaDiaSiguiente')
                                setSupplierCostEstafetaDiaS({
                                    id: doc.id,
                                    precio: precioTotal + insurancePrice,
                                    seguro: insurancePrice,
                                    guia: precioTotal,
                                });
                            if (entrega === 'estafetaEconomico')
                                setSupplierCostEstafetaEcon({
                                    id: doc.id,
                                    precio: precioTotal + insurancePrice,
                                    seguro: insurancePrice,
                                    guia: precioTotal,
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

                        console.log('Diferencia Variable', diferencia);
                        if (
                            !segundaMejorTarifa[entrega] ||
                            segundaMejorTarifa[entrega].diferencia > diferencia
                        ) {
                            const precioTotal = parseInt(precio, 10) * quantity;

                            segundaMejorTarifa[entrega] = {
                                id: doc.id,
                                precio: precioTotal + insurancePrice,
                                guia: precioTotal,
                                seguro: insurancePrice,
                                diferencia,
                            };
                        }
                    });
                    Object.keys(segundaMejorTarifa).forEach(entrega => {
                        const tarifa = segundaMejorTarifa[entrega];
                        const { guia } = tarifa;
                        const precio =
                            tarifa.guia +
                            tarifa.diferencia * kgsExtraTarifas[entrega] +
                            insurancePrice;
                        const cargoExtra = tarifa.diferencia * kgsExtraTarifas[entrega];
                        console.log('Tarifa', tarifa);
                        console.log('kgsExtraTarifas', kgsExtraTarifas);
                        if (entrega === 'fedexDiaSiguiente')
                            setSupplierCostFedexDiaS({
                                id: tarifa.id,
                                precio,
                                seguro: insurancePrice,
                                cargoExtra,
                                guia,
                            });
                        if (entrega === 'fedexEconomico')
                            setSupplierCostFedexEcon({
                                id: tarifa.id,
                                precio,
                                seguro: insurancePrice,
                                cargoExtra,
                                guia,
                            });
                        if (entrega === 'estafetaDiaSiguiente')
                            setSupplierCostEstafetaDiaS({
                                id: tarifa.id,
                                precio,
                                seguro: insurancePrice,
                                cargoExtra,
                                guia,
                            });
                        if (entrega === 'estafetaEconomico')
                            setSupplierCostEstafetaEcon({
                                id: tarifa.id,
                                precio,
                                seguro: insurancePrice,
                                cargoExtra,
                                guia,
                            });
                    });
                });
            });
    }, [weight, quantity, contentValue]);

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
            <StyledPaneContainer style={{ justifyContent: 'center' }}>
                <Card className="rainbow-flex rainbow-flex_column rainbow-align_center rainbow-justify_space-around rainbow-p-around_large rainbow-m-around_small">
                    <h3>Fedex</h3>
                    <h4>Entrega Estimada</h4>
                    <DetailsLabel>Día siguiente</DetailsLabel>
                    <h4>Detalles</h4>
                    <DetailsLabel>Entrega a Domicilio</DetailsLabel>
                    {supplierCostFedexDiaS && (
                        <>
                            {supplierCostFedexDiaS.cargoExtra && (
                                <DetailsLabel>
                                    Cargo por KGs Extra: ${supplierCostFedexDiaS.cargoExtra}
                                </DetailsLabel>
                            )}
                            {supplierCostFedexDiaS.seguro > 0 && (
                                <DetailsLabel>
                                    Cargo por Seguro: ${supplierCostFedexDiaS.seguro}
                                </DetailsLabel>
                            )}
                            <DetailsLabel>Guía: ${supplierCostFedexDiaS.guia}</DetailsLabel>
                            <h1> ${supplierCostFedexDiaS.precio}</h1>
                            <Button
                                label="Elegir"
                                variant="brand"
                                onClick={() =>
                                    registerService('fedex', 'DiaSiguiente', supplierCostFedexDiaS)
                                }
                            />
                        </>
                    )}
                </Card>
                <Card className="rainbow-flex rainbow-flex_column rainbow-align_center rainbow-justify_space-around rainbow-p-around_large rainbow-m-around_small">
                    <h3>Fedex</h3>
                    <h4>Entrega Estimada</h4>
                    <DetailsLabel>3 a 5 días hábiles</DetailsLabel>
                    <h4>Detalles</h4>
                    <DetailsLabel>Entrega a Domicilio</DetailsLabel>
                    {supplierCostFedexEcon && (
                        <>
                            {supplierCostFedexEcon.cargoExtra && (
                                <DetailsLabel>
                                    Cargo por KGs Extra: ${supplierCostFedexEcon.cargoExtra}
                                </DetailsLabel>
                            )}
                            {supplierCostFedexEcon.seguro > 0 && (
                                <DetailsLabel>
                                    Cargo por Seguro: ${supplierCostFedexEcon.seguro}
                                </DetailsLabel>
                            )}
                            <DetailsLabel>Guía: ${supplierCostFedexEcon.guia}</DetailsLabel>
                            <h1> ${supplierCostFedexEcon.precio}</h1>
                            <Button
                                label="Elegir"
                                variant="brand"
                                onClick={() =>
                                    registerService('fedex', 'Economico', supplierCostFedexEcon)
                                }
                            />
                        </>
                    )}
                </Card>
                <Card className="rainbow-flex rainbow-flex_column rainbow-align_center rainbow-justify_space-around rainbow-p-around_large rainbow-m-around_small">
                    <h3>Estafeta</h3>
                    <h4>Entrega Estimada</h4>
                    <DetailsLabel>Día siguiente</DetailsLabel>
                    <h4>Detalles</h4>
                    <DetailsLabel>Entrega a Domicilio</DetailsLabel>
                    {supplierCostEstafetaDiaS && (
                        <>
                            {supplierCostEstafetaDiaS.cargoExtra && (
                                <DetailsLabel>
                                    Cargo por KGs Extra: ${supplierCostEstafetaDiaS.cargoExtra}
                                </DetailsLabel>
                            )}
                            {supplierCostEstafetaDiaS.seguro > 0 && (
                                <DetailsLabel>
                                    Cargo por Seguro: ${supplierCostEstafetaDiaS.seguro}
                                </DetailsLabel>
                            )}
                            <DetailsLabel>Guía: ${supplierCostEstafetaDiaS.guia}</DetailsLabel>
                            <h1>${supplierCostEstafetaDiaS.precio}</h1>
                            <Button
                                label="Elegir"
                                variant="brand"
                                onClick={() =>
                                    registerService(
                                        'estafeta',
                                        'DiaSiguiente',
                                        supplierCostEstafetaDiaS,
                                    )
                                }
                            />
                        </>
                    )}
                </Card>
                <Card className="rainbow-flex rainbow-flex_column rainbow-align_center rainbow-justify_space-around rainbow-p-around_large rainbow-m-around_small">
                    <h3>Estafeta</h3>
                    <h4>Entrega Estimada</h4>
                    <DetailsLabel>3 a 5 días hábiles</DetailsLabel>
                    <h4>Detalles</h4>
                    <DetailsLabel>Entrega a Domicilio</DetailsLabel>
                    {supplierCostEstafetaEcon && (
                        <>
                            {supplierCostEstafetaEcon.cargoExtra && (
                                <DetailsLabel>
                                    Cargo por KGs Extra: ${supplierCostEstafetaEcon.cargoExtra}
                                </DetailsLabel>
                            )}
                            {supplierCostEstafetaEcon.seguro > 0 && (
                                <DetailsLabel>
                                    Cargo por Seguro: ${supplierCostEstafetaEcon.seguro}
                                </DetailsLabel>
                            )}
                            <DetailsLabel>Guía: ${supplierCostEstafetaEcon.guia}</DetailsLabel>
                            <h1>${supplierCostEstafetaEcon.precio}</h1>
                            <Button
                                label="Elegir"
                                variant="brand"
                                onClick={() =>
                                    registerService(
                                        'estafeta',
                                        'Economico',
                                        supplierCostEstafetaEcon,
                                    )
                                }
                            />
                        </>
                    )}
                </Card>
            </StyledPaneContainer>
        </>
    );
};

ServicioComponent.propTypes = {
    onSave: PropTypes.func.isRequired,
    idGuiaGlobal: PropTypes.string.isRequired,
};
