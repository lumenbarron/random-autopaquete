import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFViewer } from '@react-pdf/renderer';

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
    console.log('data', data);
    return (
        <div>
            <PDFViewer>
                <Document>
                    <Page size="A4" style={stylePage}>
                        <View style={styleSection}>
                            <Text>Holi</Text>
                            <Text>{data.receiver_addresses.country}</Text>
                        </View>
                    </Page>
                </Document>
            </PDFViewer>
        </div>
    );
};
