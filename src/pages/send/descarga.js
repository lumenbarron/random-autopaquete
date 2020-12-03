import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useFirebaseApp } from 'reactfire';
import styled from 'styled-components';
import { PdfAutoencargos } from './pdfAutoencargos';
import { DownloadContainer, DownloadContainerPDF } from './styled';

const DetailsLabel = styled.p`
    margin-bottom: 1.2rem;
`;

const ContentPDF = styled.p`
    margin-bottom: 1.2rem;
`;

export const DescargaComponent = ({ idGuiaGlobal, onReplay }) => {
    const firebase = useFirebaseApp();
    const db = firebase.firestore();
    const [pdf, setPDF] = useState(false);
    const [pdfAuto, setPDFAuto] = useState(false);
    const [error, setError] = useState(false);
    const allData = useRef();
    const company = useRef('');
    const rastreo = useRef('');
    const history = useHistory();

    useEffect(() => {
        const prepareDownload = () => {
            db.collection('guia')
                .doc(idGuiaGlobal)
                .onSnapshot(doc => {
                    const data = doc.data();
                    allData.current = doc.data();
                    company.current = doc.data().razon_social;
                    rastreo.current = doc.data().rastreo;
                    console.log(
                        'data descarga',
                        allData.current,
                        'razon social',
                        company.current,
                        'rastreo',
                        rastreo.current,
                    );
                    if (data.supplierData.Supplier === 'autoencargosEconomico') {
                        setPDFAuto(true);
                    }
                    if (data.label) {
                        //console.log('data label', data.label);
                        setPDF(doc.data().label);
                    }
                    if (data.status === 'error') {
                        setError(true);
                    }
                });
        };
        prepareDownload();
    }, [idGuiaGlobal]);

    const loading = !pdf && !error && !pdfAuto;

    return (
        // <DownloadContainer>
        <>
            {pdf && (
                <DownloadContainer>
                    <h2>Guía</h2>
                    <a href={`data:application/pdf;base64,${pdf}`} download="guia.pdf">
                        <img src="/assets/icon-pdf.png" alt="Icono de PDF" nopin="nopin" />
                        <DetailsLabel>Imprímela y pégala en tu paquete</DetailsLabel>
                        Descargar
                    </a>
                    <a href="/mi-cuenta/enviar" onClick={onReplay}>
                        Repetir último envío
                    </a>
                </DownloadContainer>
            )}
            {pdfAuto && (
                <DownloadContainerPDF>
                    <h2>Guía</h2>

                    <PdfAutoencargos
                        data={allData.current}
                        company={company.current}
                        guia={rastreo.current}
                    />
                    <a href="/mi-cuenta/enviar" onClick={onReplay}>
                        Repetir último envío
                    </a>
                </DownloadContainerPDF>
            )}
            {error && (
                <DownloadContainer>
                    <h2>
                        Hubo un problema al generar tu guía, verifica que las direcciones y datos
                        del paquete sean válidos e intenta de nuevo.
                    </h2>
                </DownloadContainer>
            )}
            {loading && (
                <DownloadContainer>
                    <h2>Generando guía, espera un minuto... </h2>
                </DownloadContainer>
            )}
        </>
        // </DownloadContainer>
    );
};
