import React, { useState, useRef, useEffect } from 'react';
import { ProgressIndicator, ProgressStep, Button } from 'react-rainbow-components';
import { useFirebaseApp, useUser } from 'reactfire';
import { Link, useParams } from 'react-router-dom';

import { OrigenComponent } from './origen';
import { DestinoComponent } from './destino';
import { PaqueteComponent } from './paquete';
import { ServicioComponent } from './servicio';
import { DescargaComponent } from './descarga';
import { StyledSendPage } from './styled';

const SendPage = () => {
    const [currentStepName, setCurrentStepName] = useState('origen');
    const firebase = useFirebaseApp();
    const db = firebase.firestore();
    const idGuiaGlobal = useRef(null);
    const user = useUser();
    const { idGuia: idGuiaParam, step: stepParam } = useParams();
    const [onReplay, setOnReplay] = useState(false);

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
        console.log('savePackagingData');
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
            .then(function(docRef) {
                console.log('Se cumplio! Document written with ID (guia): ', docRef.id);
            })
            .catch(function(error) {
                console.error('Error adding document: ', error);
            });
        setCurrentStepName('servicio');
    };

    const saveServiceData = supplierData => {
        // TODO: Guardar la elección de paquetería en un State, para usarla cuando se creará la guía

        const directionsGuiasCollectionAdd = db
            .collection('guia')
            .doc(idGuiaGlobal.current)
            .update({ status: 'completed', supplierData });
        if (
            supplierData.Supplier === 'autoencargosExpress' ||
            supplierData.Supplier === 'autoencargosEconomico'
        ) {
            console.log('autoencargos pdf');
            console.log(idGuiaGlobal.current);
            setCurrentStepName('descarga');
        } else if (
            supplierData.Supplier === 'estafetaDiaSiguiente' ||
            supplierData.Supplier === 'estafetaEconomico'
        ) {
            directionsGuiasCollectionAdd
                .then(function() {
                    user.getIdToken().then(idToken => {
                        const xhr = new XMLHttpRequest();
                        xhr.responseType = 'json';
                        xhr.contentType = 'application/json';
                        xhr.open('POST', '/guia/estafeta');
                        xhr.setRequestHeader('Authorization', `Bearer ${idToken}`);
                        xhr.send(JSON.stringify({ guiaId: idGuiaGlobal.current }));
                        setCurrentStepName('descarga');
                    });
                })
                .catch(function(error) {
                    console.error('Error adding document: ', error);
                });
        } else {
            directionsGuiasCollectionAdd
                .then(function() {
                    user.getIdToken().then(idToken => {
                        const xhr = new XMLHttpRequest();
                        xhr.responseType = 'json';
                        xhr.contentType = 'application/json';
                        xhr.open('POST', '/guia/fedex');
                        xhr.setRequestHeader('Authorization', `Bearer ${idToken}`);
                        xhr.send(JSON.stringify({ guiaId: idGuiaGlobal.current }));
                        setCurrentStepName('descarga');
                    });
                })
                .catch(function(error) {
                    console.error('Error adding document: ', error);
                });
        }

        // directionsGuiasCollectionAdd
        //     .then(function () {
        //         user.getIdToken().then(idToken => {
        //             const xhr = new XMLHttpRequest();
        //             xhr.responseType = 'json';
        //             xhr.contentType = 'application/json';
        //             xhr.open('POST', servicioUrl);
        //             xhr.setRequestHeader('Authorization', `Bearer ${idToken}`);
        //             xhr.send(JSON.stringify({ guiaId: idGuiaGlobal.current }));
        //             setCurrentStepName('descarga');
        //         });
        //     })
        //     .catch(function (error) {
        //         console.error('Error adding document: ', error);
        //     });
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
        console.log('ogGuia.data()', ogGuia.data());
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
                {currentStepName === 'servicio' && (
                    <ServicioComponent
                        onSave={saveServiceData}
                        idGuiaGlobal={idGuiaGlobal.current}
                    />
                )}
                {currentStepName === 'descarga' && (
                    <DescargaComponent idGuiaGlobal={idGuiaGlobal.current} onReplay={replayLabel} />
                )}
            </StyledSendPage>
        </>
    );
};

export default SendPage;
