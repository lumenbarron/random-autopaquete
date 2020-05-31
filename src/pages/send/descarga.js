import React from 'react';
import { Button } from 'react-rainbow-components';
import { DownloadContainer } from './styled';
import styled from 'styled-components';

const DetailsLabel = styled.p`
    margin-bottom: 1.2rem;
`;

export const DescargaComponent = () => {
    return (
        <DownloadContainer>
            <h2>Guía</h2>
            <img src="/assets/icon-pdf.png" alt="Icono de PDF" nopin="nopin" />
            <DetailsLabel>Imprímela y pégala en tu paquete</DetailsLabel>
            <Button
                label="Descargar"
                variant="brand"
                onClick={() => {
                    console.log('DESCARGANDO.. ');
                }}
            />
        </DownloadContainer>
    );
};
