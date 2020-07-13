import React, { useEffect, useState } from 'react';
import { Button } from 'react-rainbow-components';
import { useFirebaseApp } from 'reactfire';
import styled from 'styled-components';
import { DownloadContainer } from './styled';

const DetailsLabel = styled.p`
    margin-bottom: 1.2rem;
`;

export const DescargaComponent = ({ idGuiaGlobal }) => {
    const firebase = useFirebaseApp();
    const db = firebase.firestore();
    const [pdf, setPDF] = useState(false);

    useEffect(() => {
        const prepareDownload = () => {
            db.collection('guia')
                .doc(idGuiaGlobal)
                .onSnapshot(doc => {
                    setPDF(doc.data().label);
                });
        };
        prepareDownload();
    }, [idGuiaGlobal]);

    return (
        <DownloadContainer>
            {pdf && (
                <>
                    <h2>Guía</h2>
                    <a href={`data:application/pdf;base64,${pdf}`} download="guia.pdf">
                        <img src="/assets/icon-pdf.png" alt="Icono de PDF" nopin="nopin" />
                        <DetailsLabel>Imprímela y pégala en tu paquete</DetailsLabel>
                        Descargar
                    </a>
                </>
            )}
            {!pdf && <h2>Generando guía, espera un minuto... </h2>}
        </DownloadContainer>
    );
};
