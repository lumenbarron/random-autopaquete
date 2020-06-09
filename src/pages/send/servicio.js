import React, { useState } from 'react';
import { Card, Button, Input } from 'react-rainbow-components';
import { StyledPaneContainer } from './styled';
import styled from 'styled-components';
import { useUser } from 'reactfire';

const DetailsLabel = styled.p`
    margin-bottom: 1.2rem;
`;

export const ServicioComponent = ({ onSave }) => {
    const [fedex, setFedex] = useState('Fedex');
    const [supplierCostFedex, setSupplierConst] = useState('100');

    const [estafeta, setEstafeta] = useState('Fedex');
    const [supplierCostEstafeta, setSupplierCostEstafeta] = useState('150');

    const user = useUser();

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

    const style = {
        hidden: {
            display: 'none',
        },
    };

    return (
        <StyledPaneContainer style={{ justifyContent: 'center' }}>
            <Card className="rainbow-flex rainbow-flex_column rainbow-align_center rainbow-justify_space-around rainbow-p-around_large rainbow-m-around_small">
                <h3>Fedex</h3>
                <h4>Entrega Estimada</h4>
                <DetailsLabel>3 a 4 días hábiles</DetailsLabel>
                <h4>Detalles</h4>
                <DetailsLabel>Entrega a Domicilio</DetailsLabel>
                <h1> $ 100</h1>
                <Button label="Elegir" variant="brand" onClick={registerFedex} />
            </Card>
            <Card className="rainbow-flex rainbow-flex_column rainbow-align_center rainbow-justify_space-around rainbow-p-around_large rainbow-m-around_small">
                <h3>Estafeta</h3>
                <h4>Entrega Estimada</h4>
                <DetailsLabel>3 a 4 días hábiles</DetailsLabel>
                <h4>Entrega Estimada</h4>
                <DetailsLabel>Entrega a Domicilio</DetailsLabel>
                <h1>$ 150</h1>
                <Button label="Elegir" variant="brand" onClick={registerEstafeta} />
            </Card>
        </StyledPaneContainer>
    );
};
