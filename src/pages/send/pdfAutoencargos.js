import React, { useState, useEffect } from 'react';
import {
    Page,
    Text,
    View,
    Document,
    Image,
    PDFViewer,
    Canvas,
    StyleSheet,
} from '@react-pdf/renderer';
//import styles from './stylePdfAuto';
//import {StyleHeaderImage  } from './styled';
// import { StyleContentData } from './styled';

const styles = StyleSheet.create({
    body: {
        paddingTop: 35,
        paddingBottom: 65,
        paddingHorizontal: 35,
        width: '500px',
        height: '800px',
    },
    titles: {
        fontSize: 26,
        textAlign: 'center',
        fontFamily: 'Montserrat',
    },
    text: {
        fontSize: 20,
        textAlign: 'justify',
        fontFamily: 'Montserrat',
    },
    image: {
        width: 185,
        height: 45,
    },
    data: {
        border: '1px solid green',
        borderRadius: 20,
    },
});

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
        console.log('data', data.data);
        console.log('guia', data.guia);
        //General data
        setNoGuia(data.guia);
        setRazonSocial(data.razon_social);
        setService(data.data.supplierData.Supplier);
        setDate(data.data.package.creation_date);
        //Sender information
        setNameSender(data.data.name);
        setStreetNumberSender(data.data.sender_addresses.street_number);
        setNeighborhoodSender(data.data.sender_addresses.neighborhood);
        setCountrySender(data.data.sender_addresses.country);
        setCPSender(data.data.sender_addresses.codigo_postal);
        setPhoneSender(data.data.sender_addresses.phone);
        setRefSenderStreet(data.data.sender_addresses.place_reference);
        //Receiver information
        setNameReceiver(data.data.receiver_addresses.name);
        setStreetNumberReceiver(data.data.receiver_addresses.street_number);
        setNeighborhoodReceiver(data.data.receiver_addresses.neighborhood);
        setCountryReceiver(data.data.receiver_addresses.country);
        setCPReceiver(data.data.receiver_addresses.codigo_postal);
        setPhoneReceiver(data.data.receiver_addresses.phone);
        setRefReceiverStreet(data.data.receiver_addresses.place_reference);
        //Package
        setContent(data.data.package.content_description);
        setAssurance(data.data.supplierData.cargos.seguro);

        setTimeout(() => {
            console.log('settime');
            setRenderReady(true);
        }, 5000);
    }, []);

    return (
        <div>
            {renderReady ? (
                <PDFViewer>
                    <Document title={noGuia}>
                        <Page orientation="portrait" style={styles.body}>
                            <View>
                                <Image style={styles.image} src="/assets/autoencar.png" />
                                <Text>Número de Guía {noGuia}</Text>
                                <Text>Servicio {service}</Text>
                                <Text>Servicio {service}</Text>
                                <Text>Fecha {date}</Text>
                                <Text> Origen </Text>
                                <Text>Nombre quien envia {nameSender}</Text>
                                <Text>
                                    Direccion {streetNumberSender} , {neighborhoodSender},{' '}
                                    {CPSender}, {countrySender}{' '}
                                </Text>
                                <Text>Telefono {phoneSender}</Text>
                                <Text>Referencias adicionales {refSenderStreet}</Text>
                                <Text> Destino </Text>
                                <Text>Nombre quien recive {nameReceiver}</Text>
                                <Text>
                                    Direccion {streetNumberReceiver} , {neighborhoodReceiver},{' '}
                                    {CPReceiver}, {countryReceiver}{' '}
                                </Text>
                                <Text>Telefono {phoneReceiver}</Text>
                                <Text>Referencias adicionales {refReceiverStreet}</Text>
                                <Text> Valor declarado {assurance}</Text>
                                <Text>Contendio {content}</Text>
                                <Text>Razón Social {razonSocial} </Text>
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
