import React from 'react';
import { Card, Button } from 'react-rainbow-components';
import { StyledPaneContainer } from './styled';
import styled from 'styled-components';

const DetailsLabel = styled.p`
    margin-bottom: 1.2rem;
`;

export const ServicioComponent = ({ onSave }) => {
    return (
        <StyledPaneContainer style={{ justifyContent: 'center' }}>
            <Card className="rainbow-flex rainbow-flex_column rainbow-align_center rainbow-justify_space-around rainbow-p-around_large rainbow-m-around_small">
                <h3>Fedex</h3>
                <h4>Entrega Estimada</h4>
                <DetailsLabel>3 a 4 días hábiles</DetailsLabel>
                <h4>Detalles</h4>
                <DetailsLabel>Entrega a Domicilio</DetailsLabel>
                <h1>$ 100</h1>
                <Button label="Elegir" variant="brand" onClick={onSave} />
            </Card>
            <Card className="rainbow-flex rainbow-flex_column rainbow-align_center rainbow-justify_space-around rainbow-p-around_large rainbow-m-around_small">
                <h3>Estafeta</h3>
                <h4>Entrega Estimada</h4>
                <DetailsLabel>3 a 4 días hábiles</DetailsLabel>
                <h4>Entrega Estimada</h4>
                <DetailsLabel>Entrega a Domicilio</DetailsLabel>
                <h1>$ 150</h1>
                <Button label="Elegir" variant="brand" onClick={onSave} />
            </Card>
        </StyledPaneContainer>
    );
};
