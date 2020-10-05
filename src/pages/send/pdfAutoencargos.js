import React, { useState, useEffect } from 'react';
import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import { useFirebaseApp, useUser } from 'reactfire';

const stylePage = {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
};

const styleSection = {
    margin: 10,
    padding: 10,
    flexGrow: 1,
};

export const PdfAutoencargos = data => {
    // Sender states
    const [nameSender, setNameSender] = useState();
    const [renderReady, setRenderReady] = useState(false);

    useEffect(() => {
        console.log('data', data);
        console.log('data', data.data.name);
        setNameSender(data.data.name);
        setRenderReady(true);
        //console.log();
    }, []);

    return (
        <div>
            {renderReady ? (
                <PDFViewer>
                    <Document>
                        <Page size="A4" style={stylePage}>
                            <View style={styleSection}>
                                <Text>Holi</Text>
                                <Text>{nameSender}</Text>
                            </View>
                        </Page>
                    </Document>
                </PDFViewer>
            ) : (
                <h2>No se puede generar el pdf</h2>
            )}
        </div>
    );
};
