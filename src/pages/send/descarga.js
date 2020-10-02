import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useFirebaseApp } from 'reactfire';
import styled from 'styled-components';
import { PdfAutoencargos } from './pdfAutoencargos';
import { DownloadContainer } from './styled';

const DetailsLabel = styled.p`
    margin-bottom: 1.2rem;
`;

export const DescargaComponent = ({ idGuiaGlobal, onReplay, data }) => {
    const firebase = useFirebaseApp();
    const db = firebase.firestore();
    const [pdf, setPDF] = useState(false);
    const [error, setError] = useState(false);
    const history = useHistory();

    console.log(idGuiaGlobal, data);

    useEffect(() => {
        const prepareDownload = () => {
            db.collection('guia')
                .doc(idGuiaGlobal)
                .onSnapshot(doc => {
                    const data = doc.data();
                    if (data.label) {
                        setPDF(doc.data().label);
                    }
                    if (data.status === 'error') {
                        setError(true);
                    }
                });
        };
        prepareDownload();
    }, [idGuiaGlobal]);

    const loading = !pdf && !error;

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
                    <a href="/mi-cuenta/enviar" onClick={onReplay}>
                        Repetir último envío
                    </a>
                </>
            )}
            {error && (
                <h2>
                    Hubo un problema al generar tu guía, verifica que las direcciones y datos del
                    paquete sean válidos e intenta de nuevo.
                </h2>
            )}
            {loading && (
                <div>
                    {' '}
                    <h2>Generando guía, espera un minuto... </h2>
                </div>
            )}
        </DownloadContainer>
    );
};
