import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-rainbow-components';
import styled from 'styled-components';
import { useUser, useFirebaseApp } from 'reactfire';
import { StyledPaneContainer, StyledDirectiosDetails, StyledDetails } from './styled';

const DetailsLabel = styled.p`
    margin-bottom: 1.2rem;
`;

export const ServicioComponent = ({ onSave, idGuiaGlobal }) => {
    const [fedex, setFedex] = useState('Fedex');
    const [supplierCostFedex, setSupplierConst] = useState('100');

    const [estafeta, setEstafeta] = useState('Fedex');
    const [supplierCostEstafeta, setSupplierCostEstafeta] = useState('150');

    const user = useUser();
    const firebase = useFirebaseApp();
    const db = firebase.firestore();

    const [orderData, setOrderData] = useState([]);
    //Sender states
    const [nameSender, setNameSender] = useState();
    const [CPSender, setCPSender] = useState('');
    const [neighborhoodSender, setNeighborhoodSender] = useState('');
    const [countrySender, setCountrySender] = useState('');
    const [streetNumberSender, setStreetNumberSender] = useState('');
    const [phoneSender, setPhoneSender] = useState('');
    //Receiver states
    const [nameReceiver, setNameReceiver] = useState();
    const [CPReceiver, setCPReceiver] = useState('');
    const [neighborhoodReceiver, setNeighborhoodReceiver] = useState('');
    const [countryReceiver, setCountryReceiver] = useState('');
    const [streetNumberReceiver, setStreetNumberReceiver] = useState('');
    const [phoneReceiver, setPhoneReceiver] = useState('');
    //Package information
    const [namePackage, setNamePackage] = useState('');
    const [height, setHeight] = useState('');
    const [width, setWidth] = useState('');
    const [depth, setDepth] = useState('');
    const [weight, setWeight] = useState('');

    const registerFedex = () => {
        const supplierData = {
            ID: user.uid,
            Supplier: fedex,
            Supplier_cost: supplierCostFedex,
        };

        onSave({ supplierData });
    };

    const registerEstafeta = () => {
        const supplierData = {
            ID: user.uid,
            Supplier: estafeta,
            Supplier_cost: supplierCostEstafeta,
        };

        onSave({ supplierData });
    };

    db.collection('guia')
        .doc(idGuiaGlobal)
        .onSnapshot(function(doc) {
            console.log('dsadsa', doc.data());
            //Get snapshot sender information
            setNameSender(doc.data().sender_addresses.name);
            setCPSender(doc.data().sender_addresses.codigo_postal);
            setNeighborhoodSender(doc.data().sender_addresses.neighborhood);
            setCountrySender(doc.data().sender_addresses.country);
            setStreetNumberSender(doc.data().sender_addresses.street_number);
            setPhoneSender(doc.data().sender_addresses.phone);
            //Get snapshot to receive Receiver information
            setNameReceiver(doc.data().receiver_addresses.name);
            setCPReceiver(doc.data().receiver_addresses.codigo_postal);
            setNeighborhoodReceiver(doc.data().receiver_addresses.neighborhood);
            setCountryReceiver(doc.data().receiver_addresses.country);
            setStreetNumberReceiver(doc.data().receiver_addresses.street_number);
            setPhoneReceiver(doc.data().receiver_addresses.phone);
            //Get snapshot to receive package information
            setNamePackage(doc.data().package.name);
            setHeight(doc.data().package.height);
            setWidth(doc.data().package.width);
            setDepth(doc.data().package.depth);
            setWeight(doc.data().package.weight);
        });

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
                    <p>
                        Dimensiones: {height}x{width}x{depth} cm
                    </p>
                    <p>Peso: {weight} kgs</p>
                </StyledDetails>
            </StyledDirectiosDetails>
            <StyledPaneContainer style={{ justifyContent: 'center' }}>
                <Card className="rainbow-flex rainbow-flex_column rainbow-align_center rainbow-justify_space-around rainbow-p-around_large rainbow-m-around_small">
                    <h3>Fedex</h3>
                    <h4>Entrega Estimada</h4>
                    <DetailsLabel>Día siguiente</DetailsLabel>
                    <h4>Detalles</h4>
                    <DetailsLabel>Entrega a Domicilio</DetailsLabel>
                    <h1> $ 200</h1>
                    <Button label="Elegir" variant="brand" onClick={registerFedex} />
                </Card>
                <Card className="rainbow-flex rainbow-flex_column rainbow-align_center rainbow-justify_space-around rainbow-p-around_large rainbow-m-around_small">
                    <h3>Fedex</h3>
                    <h4>Entrega Estimada</h4>
                    <DetailsLabel>3 a 5 días hábiles</DetailsLabel>
                    <h4>Detalles</h4>
                    <DetailsLabel>Entrega a Domicilio</DetailsLabel>
                    <h1> $ 100</h1>
                    <Button label="Elegir" variant="brand" onClick={registerFedex} />
                </Card>
                <Card className="rainbow-flex rainbow-flex_column rainbow-align_center rainbow-justify_space-around rainbow-p-around_large rainbow-m-around_small">
                    <h3>Estafeta</h3>
                    <h4>Entrega Estimada</h4>
                    <DetailsLabel>Día siguiente</DetailsLabel>
                    <h4>Entrega Estimada</h4>
                    <DetailsLabel>Entrega a Domicilio</DetailsLabel>
                    <h1>$ 300</h1>
                    <Button label="Elegir" variant="brand" onClick={registerEstafeta} />
                </Card>
                <Card className="rainbow-flex rainbow-flex_column rainbow-align_center rainbow-justify_space-around rainbow-p-around_large rainbow-m-around_small">
                    <h3>Estafeta</h3>
                    <h4>Entrega Estimada</h4>
                    <DetailsLabel>3 a 5 días hábiles</DetailsLabel>
                    <h4>Entrega Estimada</h4>
                    <DetailsLabel>Entrega a Domicilio</DetailsLabel>
                    <h1>$ 150</h1>
                    <Button label="Elegir" variant="brand" onClick={registerEstafeta} />
                </Card>
            </StyledPaneContainer>
        </>
    );
};
