import React, { useState, useRef, useEffect } from 'react';
import { ProgressIndicator, ProgressStep, Button, Spinner } from 'react-rainbow-components';
import { useFirebaseApp, useUser } from 'reactfire';
import { Link, useParams } from 'react-router-dom';

import { OrigenComponent } from './origen';
import { DestinoComponent } from './destino';
import { PaqueteComponent } from './paquete';
import { ServicioComponent } from './servicio';
import { DescargaComponent } from './descarga';
//import { PaqueteriaComponent } from './paqueteria';
import { StyledSendPage, DownloadContainerPDF } from './styled';

const SendPage = () => {
    const [currentStepName, setCurrentStepName] = useState('origen');
    const firebase = useFirebaseApp();
    const db = firebase.firestore();
    const idGuiaGlobal = useRef(null);
    const user = useUser();
    const { idGuia: idGuiaParam, step: stepParam } = useParams();
    const [onReplay, setOnReplay] = useState(false);
    const [guiaReady, setguiaReady] = useState(false);
    const [emptyResult, setEmptyResult] = useState(false);
    const tokenSand = process.env.REACT_APP_REDPACK_SAND;
    const tokenProd = process.env.REACT_APP_REDPACK_PROD;

    useEffect(() => {
        if (stepParam) setCurrentStepName(stepParam);
    }, [stepParam]);

    useEffect(() => {
        if (idGuiaParam) idGuiaGlobal.current = idGuiaParam;
    }, [idGuiaParam]);

    const saveOriginData = ({ idGuia }) => {
        // TODO: Guardar la info de la dirección a firestore (si fue solicitado)
        idGuiaGlobal.current = idGuia;
        // TODO: Guardar la dirección en un State, para usarla cuando se creará la guía
        setCurrentStepName('destino');
    };

    const saveDestinationData = (directionData, directionGuiaData, checkBox) => {
        if (idGuiaGlobal.current === null) {
            console.log('Es necesario completar el primer paso');
            return;
        }
        // TODO: Guardar la info de la dirección a firestore (si fue solicitado)
        if (checkBox) {
            db.collection('receiver_addresses')
                .add(directionData)
                .then(function(docRef) {
                    console.log('Document written with ID (destino): ', docRef.id);
                })
                .catch(function(error) {
                    console.error('Error adding document: ', error);
                });
        }
        // TODO: Guardar la dirección en un State, para usarla cuando se creará la guía
        const directionsGuiasCollectionAdd = db
            .collection('guia')
            .doc(idGuiaGlobal.current)
            .update(directionGuiaData);

        directionsGuiasCollectionAdd
            .then(function() {
                console.log('Se cumplio! Document written with ID (guia): ', idGuiaGlobal.current);
            })
            .catch(function(error) {
                console.error('Error adding document: ', error);
            });
        setCurrentStepName('paquete');
    };

    const savePackagingData = (packageData, packageGuiaData, checkBox) => {
        console.log('entra a savePackagingData: ', packageData, packageGuiaData, checkBox);
        if (idGuiaGlobal.current === null) {
            console.log('Es necesario completar el primer paso');
            return;
        }
        // TODO: Guardar la info del paquete a firestore (si fue solicitado)
        if (checkBox) {
            db.collection('package')
                .add(packageData)
                .then(function() {
                    console.log('Document written with ID (destino): ', idGuiaGlobal.current);
                })
                .catch(function(error) {
                    console.error('Error adding document: ', error);
                });
        }
        // TODO: Guardar la info del paquete en un State, para usarla cuando se creará la guía
        const directionsGuiasCollectionAdd = db
            .collection('guia')
            .doc(idGuiaGlobal.current)
            .update(packageGuiaData);

        directionsGuiasCollectionAdd
            .then(function() {
                console.log(
                    'Se cumplio 2! Document written with ID (guia): ',
                    idGuiaGlobal.current,
                );
            })
            .catch(function(error) {
                console.error('Error adding document: ', error);
            });
        setCurrentStepName('servicio');
    };

    const saveServiceData = supplierData => {
        // TODO: Guardar la elección de paquetería en un State, para usarla cuando se creará la guía
        //console.log('supplierData', supplierData);
        let costGuia = supplierData.Supplier_cost;
        // console.log('costGuia', costGuia);
        const directionsGuiasCollectionAdd = db
            .collection('guia')
            .doc(idGuiaGlobal.current)
            .update({ status: 'completed', supplierData });

        if (supplierData.Supplier === 'autoencargosEconomico') {
            // console.log('autoencargos pdf');
            console.log('quita saldo en autoencargos');
            newBalance(costGuia);
            setguiaReady(true);
            setCurrentStepName('descarga');
        }
        // else if (
        //     supplierData.Supplier === 'fedexDiaSiguiente' ||
        //     supplierData.Supplier === 'fedexEconomico'
        // ) {
        //     directionsGuiasCollectionAdd
        //         .then(function() {
        //             console.log('peticion a la api fed');
        //             user.getIdToken().then(idToken => {
        //                 try {
        //                     const xhr = new XMLHttpRequest();
        //                     xhr.responseType = 'json';
        //                     xhr.contentType = 'application/json';
        //                     xhr.open('POST', '/guia/fedex');
        //                     xhr.setRequestHeader('Authorization', `Bearer ${idToken}`);
        //                     xhr.send(JSON.stringify({ guiaId: idGuiaGlobal.current }));
        //                     //newBalance(costGuia);
        //                     setguiaReady(true);
        //                     setCurrentStepName('descarga');
        //                 } catch (err) {
        //                     console.log(err.message);
        //                 }
        //             });
        //         })
        //         .catch(function(error) {
        //             console.error('Error adding document: ', error);
        //         });
        // }
        else {
            setCurrentStepName('descarga');
            let myHeaders = new Headers();
            myHeaders.append('Authorization', tokenProd);
            myHeaders.append('Content-Type', 'application/json');

            //Asignando los valores desde el doc guia del firestore
            db.collection('guia')
                .doc(idGuiaGlobal.current)
                .get()
                .then(function(doc) {
                    if (doc.exists) {
                        //console.log('Document data:', doc.data());
                        let data = JSON.stringify({
                            sender: {
                                contact_name:
                                    doc.data().supplierData.Supplier === 'estafetaEconomico' ||
                                    doc.data().supplierData.Supplier === 'estafetaDiaSiguiente'
                                        ? doc.data().sender_addresses.name.substring(0, 30)
                                        : doc.data().sender_addresses.name,
                                company_name: doc.data().sender_addresses.name,
                                street:
                                    doc.data().supplierData.Supplier === 'estafetaEconomico' ||
                                    doc.data().supplierData.Supplier === 'estafetaDiaSiguiente'
                                        ? doc.data().sender_addresses.street_name.substring(0, 19)
                                        : doc.data().sender_addresses.street_name,
                                zip_code: doc.data().sender_addresses.codigo_postal,
                                neighborhood: doc.data().sender_addresses.neighborhood,
                                city: doc.data().sender_addresses.country,
                                country: 'MX',
                                state: doc.data().sender_addresses.state,
                                street_number: doc.data().sender_addresses.street_number,
                                place_reference: doc.data().sender_addresses.place_reference,
                                phone: doc.data().sender_addresses.phone,
                            },
                            receiver: {
                                contact_name:
                                    doc.data().supplierData.Supplier === 'estafetaEconomico' ||
                                    doc.data().supplierData.Supplier === 'estafetaDiaSiguiente'
                                        ? doc.data().receiver_addresses.name.substring(0, 30)
                                        : doc.data().receiver_addresses.name,
                                company_name: doc.data().receiver_addresses.name,
                                street:
                                    doc.data().supplierData.Supplier === 'estafetaEconomico' ||
                                    doc.data().supplierData.Supplier === 'estafetaDiaSiguiente'
                                        ? doc.data().receiver_addresses.street_name.substring(0, 19)
                                        : doc.data().receiver_addresses.street_name,
                                zip_code: doc.data().receiver_addresses.codigo_postal,
                                neighborhood: doc.data().receiver_addresses.neighborhood,
                                city: doc.data().receiver_addresses.country,
                                country: 'MX',
                                state: doc.data().receiver_addresses.state,
                                street_number: doc.data().receiver_addresses.street_number
                                    ? doc.data().receiver_addresses.street_number
                                    : '',
                                place_reference: doc.data().receiver_addresses.place_reference,
                                phone: doc.data().receiver_addresses.phone,
                            },
                            packages: [
                                {
                                    name: doc.data().package.name.substring(0, 25),
                                    height: doc.data().package.height,
                                    width: doc.data().package.width,
                                    depth: doc.data().package.depth,
                                    weight: doc.data().package.weight,
                                    content_description: doc.data().package.content_description,
                                    quantity: doc.data().package.quantity,
                                },
                            ],
                            shipping_company: doc.data().supplierData.cargos.shippingInfo[0],
                            shipping_service: {
                                name: doc.data().supplierData.cargos.shippingInfo[1],
                                description: doc.data().supplierData.cargos.shippingInfo[2],
                                id: doc.data().supplierData.cargos.shippingInfo[3],
                            },
                            shipping_secure:
                                //false,
                                doc.data().supplierData.cargos.insurance === 0 ? false : true,
                            shipping_secure_data: {
                                notes:
                                    // '-',
                                    doc.data().package.content_description,
                                amount:
                                    // 0,
                                    doc.data().supplierData.cargos.insurance,
                            },
                        });
                        //console.log('data 2', data);
                        let requestOptions = {
                            method: 'POST',
                            headers: myHeaders,
                            body: data,
                            redirect: 'follow',
                        };
                        console.log(data);
                        fetch(
                            'https://autopaquete.simplestcode.com/api/do-shipping/',
                            requestOptions,
                        )
                            .then(response => response.json())
                            .then(result => {
                                console.log(result);
                                let finalResult = result;
                                let responseFetch = Object.keys(result);
                                console.log(responseFetch);
                                if (responseFetch.length === 0) {
                                    setEmptyResult(true);
                                    db.collection('guia')
                                        .doc(idGuiaGlobal.current)
                                        .update({ result: responseFetch, body: data });
                                } else if (result.pdf_b64.length === 0 || result.pdf_b64 == '') {
                                    setEmptyResult(true);
                                    db.collection('guia')
                                        .doc(idGuiaGlobal.current)
                                        .update({ result: result, body: data });
                                } else {
                                    db.collection('guia')
                                        .doc(idGuiaGlobal.current)
                                        .update({
                                            label: result.pdf_b64[0],
                                            rastreo: result.id_shipping,
                                            body: data,
                                            result: finalResult,
                                        });
                                    console.log('quita saldo demas paqueterias');
                                    newBalance(costGuia);
                                    setguiaReady(true);
                                }
                            })
                            .catch(error => {
                                console.log('error', error);
                                setEmptyResult(true);
                            });
                    }
                });
        }
    };

    const newBalance = cost => {
        // console.log('cost', cost);
        db.collection('profiles')
            .where('ID', '==', user.uid)
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    // console.log(doc.id, ' => ', doc.data());
                    let newBalance = parseFloat(doc.data().saldo) - cost;
                    newBalance = Math.round((newBalance + Number.EPSILON) * 100) / 100;
                    if (newBalance < 0) {
                        return false;
                    }
                    // console.log('newBalance', newBalance);
                    db.collection('profiles')
                        .doc(doc.id)
                        .update({ saldo: newBalance })
                        .then(() => {
                            // console.log('get it');
                        });
                });
            })
            .catch(function(error) {
                console.log('Error getting documents: ', error);
            });
    };

    async function replayLabel(e) {
        e.preventDefault(true);
        setCurrentStepName('servicio');
        setOnReplay(true);
        const ogGuia = await db
            .collection('guia')
            .doc(idGuiaGlobal.current)
            .get();
        const {
            ID,
            receiver_addresses: rAddress,
            sender_addresses: sAddress,
            supplierData,
            razon_social,
            name,
            creation_date,
        } = ogGuia.data();
        // console.log('ogGuia.data()', ogGuia.data());
        const newGuia = await db.collection('guia').add({
            ID,
            receiver_addresses: rAddress,
            sender_addresses: sAddress,
            supplierData,
            razon_social,
            name,
            creation_date,
            package: ogGuia.data().package,
        });
        idGuiaGlobal.current = newGuia.id;
        setOnReplay(false);
    }

    const handleNextClick = () => {
        if (currentStepName === 'origen') {
            setCurrentStepName('destino');
        } else if (currentStepName === 'destino') {
            setCurrentStepName('paquete');
        }
        // return setState(isNextDisabled: false );
    };
    const handleBackClick = () => {
        if (currentStepName === 'paquete') {
            setCurrentStepName('destino');
        } else if (currentStepName === 'destino') {
            setCurrentStepName('origen');
        }
    };

    if (onReplay) {
        return (
            <>
                <h3>Generando nueva guía</h3>
            </>
        );
    }

    return (
        <>
            <StyledSendPage>
                <ProgressIndicator currentStepName={currentStepName}>
                    <ProgressStep name="origen" label="Origen" />
                    <ProgressStep name="destino" label="Destino" />
                    <ProgressStep name="paquete" label="Paquete" />
                    {/* <ProgressStep name="paqueteria" label="Paquetería" /> */}
                    <ProgressStep name="servicio" label="Servicio" />
                    <ProgressStep name="descarga" label="Descarga" />
                </ProgressIndicator>
                {currentStepName === 'servicio' ? null : currentStepName === 'descarga' ? null : (
                    <div className="rainbow-m-top_xx-large rainbow-align-content_center rainbow-flex_wrap">
                        <Button
                            label="Atras"
                            onClick={handleBackClick}
                            variant="neutral"
                            className="rainbow-m-horizontal_medium"
                        />
                        {/* <Button
                            label="Siguiente"
                            onClick={handleNextClick}
                            variant="brand"
                            className="rainbow-m-horizontal_medium"
                        /> */}
                    </div>
                )}
                {currentStepName === 'origen' && (
                    <OrigenComponent onSave={saveOriginData} idGuiaGlobal={idGuiaGlobal.current} />
                )}
                {currentStepName === 'destino' && (
                    <DestinoComponent
                        onSave={saveDestinationData}
                        idGuiaGlobal={idGuiaGlobal.current}
                    />
                )}
                {currentStepName === 'paquete' && (
                    <PaqueteComponent
                        onSave={savePackagingData}
                        idGuiaGlobal={idGuiaGlobal.current}
                    />
                )}

                {/*                 {currentStepName === 'paqueteria' && (
                    <PaqueteriaComponent
                        onSave={saveServiceData}
                        idGuiaGlobal={idGuiaGlobal.current}
                    />
                )} */}
                {currentStepName === 'servicio' && (
                    <ServicioComponent
                        onSave={saveServiceData}
                        idGuiaGlobal={idGuiaGlobal.current}
                    />
                )}
                {!guiaReady && currentStepName === 'descarga' && (
                    <DownloadContainerPDF>
                        <h1>Generando guía...</h1>
                        <div className="rainbow-position_relative rainbow-m-vertical_xx-large rainbow-p-vertical_xx-large">
                            <Spinner size="large" variant="brand" />
                        </div>
                    </DownloadContainerPDF>
                )}
                {emptyResult && currentStepName === 'descarga' && (
                    <DownloadContainerPDF>
                        <h1>
                            Lo sentimos, ha ocurrido un error, podrías generar la guía de nuevo. (No
                            te preocupes, tu saldo no se ha descontado)
                        </h1>
                    </DownloadContainerPDF>
                )}
                {guiaReady && currentStepName === 'descarga' && (
                    <DescargaComponent idGuiaGlobal={idGuiaGlobal.current} onReplay={replayLabel} />
                )}
            </StyledSendPage>
        </>
    );
};

export default SendPage;
