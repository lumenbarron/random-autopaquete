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

    const [directionData, setDirectionData] = useState([]);

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

    function handleDirections(snapshot) {
        const directionData = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data(),
            };
        });
        setDirectionData(directionData);
    }

    const options = directionData.map((directions, idx) => {
        return {};
    });

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
    console.log(idGuiaGlobal);
    return (
        <>
            <StyledDirectiosDetails style={{ justifyContent: 'center' }}>
                <StyledDetails>
                    <span>
                        <b>Tortas Macario</b>
                    </span>
                    <p>Pablo Valdez 668</p>
                    <p>La perla</p>
                    <p>Guadalajara, Jalisco</p>
                    <p>C.P. 46360</p>
                    <p>Tel 3310628584</p>
                </StyledDetails>
                <StyledDetails>
                    <span>
                        <b>Tortas Macario</b>
                    </span>
                    <p>Pablo Valdez 668</p>
                    <p>La perla</p>
                    <p>Guadalajara, Jalisco</p>
                    <p>C.P. 46360</p>
                    <p>Tel 3310628584</p>
                </StyledDetails>
                <StyledDetails>
                    <span>
                        <b>Tortas Macario</b>
                    </span>
                    <p>Pablo Valdez 668</p>
                    <p>La perla</p>
                    <p>Guadalajara, Jalisco</p>
                    <p>C.P. 46360</p>
                    <p>Tel 3310628584</p>
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
