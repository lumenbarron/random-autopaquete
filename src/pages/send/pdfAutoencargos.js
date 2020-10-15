import React, { useState, useEffect, useRef } from 'react';
import { Page, View, Document, Image, PDFViewer, Text } from '@react-pdf/renderer';
import styles from './pdfAutoencargos/styles';
import DataContact from './pdfAutoencargos/dataContact';
import Politics from './pdfAutoencargos/politics';
import Destination from './pdfAutoencargos/destinations';
import Package from './pdfAutoencargos/package';
import Logo from './pdfAutoencargos/logo';
// import logo from '../../../public/assets/autoencar.png';

export const PdfAutoencargos = data => {
    // Sender states
    const [nameSender, setNameSender] = useState();
    const [CPSender, setCPSender] = useState('');
    const [neighborhoodSender, setNeighborhoodSender] = useState('');
    const [countrySender, setCountrySender] = useState('');
    const [streetNumberSender, setStreetNumberSender] = useState('');
    const [phoneSender, setPhoneSender] = useState('');
    const [refSenderStreet, setRefSenderStreet] = useState('');

    // Receiver states
    const [nameReceiver, setNameReceiver] = useState();
    const [CPReceiver, setCPReceiver] = useState('');
    const [neighborhoodReceiver, setNeighborhoodReceiver] = useState('');
    const [countryReceiver, setCountryReceiver] = useState('');
    const [streetNumberReceiver, setStreetNumberReceiver] = useState('');
    const [phoneReceiver, setPhoneReceiver] = useState('');
    const [refReceiverStreet, setRefReceiverStreet] = useState('');

    // Package information
    const [content, setContent] = useState('');
    const [assurance, setAssurance] = useState('');

    const [noGuia, setNoGuia] = useState('');
    const [razonSocial, setRazonSocial] = useState('');
    const [service, setService] = useState('');
    const [date, setDate] = useState('');
    const [renderReady, setRenderReady] = useState(false);

    useEffect(() => {
        let allData = data.data;
        let supplier = allData.supplierData.Supplier.substring(12);
        console.log('company', data.company);
        //General data
        setNoGuia(data.guia);
        setRazonSocial(data.company);
        setService(supplier);
        setDate(allData.package.creation_date);
        //Sender information
        setNameSender(allData.name);
        setStreetNumberSender(allData.sender_addresses.street_number);
        setNeighborhoodSender(allData.sender_addresses.neighborhood);
        setCountrySender(allData.sender_addresses.country);
        setCPSender(allData.sender_addresses.codigo_postal);
        setPhoneSender(allData.sender_addresses.phone);
        setRefSenderStreet(allData.sender_addresses.place_reference);
        //Receiver information
        setNameReceiver(allData.receiver_addresses.name);
        setStreetNumberReceiver(allData.receiver_addresses.street_number);
        setNeighborhoodReceiver(allData.receiver_addresses.neighborhood);
        setCountryReceiver(allData.receiver_addresses.country);
        setCPReceiver(allData.receiver_addresses.codigo_postal);
        setPhoneReceiver(allData.receiver_addresses.phone);
        setRefReceiverStreet(allData.receiver_addresses.place_reference);
        //Package
        setContent(allData.package.content_description);
        // setAssurance(allData.supplierData.cargos.seguro);
        if (allData.supplierData.cargos.seguro > 0) {
            setAssurance('asegurado');
        } else {
            setAssurance('sin seguro');
        }

        setTimeout(() => {
            console.log('settime');
            setRenderReady(true);
        }, 5000);
    }, []);
    return (
        <div>
            {renderReady ? (
                <PDFViewer style={styles.viewer}>
                    <Document>
                        <Page size="A4" style={styles.page} orientation="landscape">
                            <View style={styles.section}>
                                <View
                                    style={[
                                        styles.container,
                                        {
                                            width: '50%',
                                            borderRightWidth: 1,
                                            borderStyle: 'dashed',
                                        },
                                    ]}
                                >
                                    <Logo />
                                    <DataContact noGuia={noGuia} service={service} date={date} />
                                    <Destination
                                        origin={'ORIGEN'}
                                        name={nameSender}
                                        adress={
                                            (streetNumberSender,
                                            neighborhoodSender,
                                            CPSender,
                                            countrySender)
                                        }
                                        phone={phoneSender}
                                        reference={refSenderStreet}
                                    />
                                    <Destination
                                        origin={'DESTINO'}
                                        name={nameReceiver}
                                        adress={
                                            (streetNumberReceiver,
                                            neighborhoodReceiver,
                                            CPReceiver,
                                            countryReceiver)
                                        }
                                        phone={phoneReceiver}
                                        reference={refReceiverStreet}
                                    />
                                    <Package
                                        assurance={assurance}
                                        company={razonSocial}
                                        content={content}
                                    />
                                </View>
                                <View style={[styles.container, { width: '50%' }]}>
                                    <Politics />
                                </View>
                            </View>
                        </Page>
                    </Document>
                </PDFViewer>
            ) : (
                <h2>Generando el pdf...</h2>
            )}
        </div>
    );
};
