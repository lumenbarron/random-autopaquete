import React, { useState, useRef } from 'react';
import { ProgressIndicator, ProgressStep } from 'react-rainbow-components';
import { StyledSendPage } from './styled';
import { OrigenComponent } from './origen';
import { DestinoComponent } from './destino';
import { PaqueteComponent } from './paquete';
import { ServicioComponent } from './servicio';
import { DescargaComponent } from './descarga';
import { useFirebaseApp } from 'reactfire';

const SendPage = () => {
    const [currentStepName, setCurrentStepName] = useState('origen');
    const firebase = useFirebaseApp();
    const db = firebase.firestore();
    const idGuiaGlobal = useRef(null);

    const saveOriginData = ({ idGuia }) => {
        // TODO: Guardar la info de la dirección a firestore (si fue solicitado)
        idGuiaGlobal.current = idGuia;
        // TODO: Guardar la dirección en un State, para usarla cuando se creará la guía
        setCurrentStepName('destino');
    };

    const saveDestinationData = (
        directionData,
        directionGuiaData,
        checkBox,
        duplicateStreet,
        streetNumber,
    ) => {
        // TODO: Guardar la info de la dirección a firestore (si fue solicitado)
        if (checkBox) {
            if (duplicateStreet.includes(streetNumber)) {
                console.log('Necesitas poner una calle diferente');
                return;
            }
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
            .then(function(docRef) {
                console.log('Se cumplio! Document written with ID (guia): ', docRef.id);
            })
            .catch(function(error) {
                console.error('Error adding document: ', error);
            });
        setCurrentStepName('paquete');
    };

    const savePackagingData = (packageData, packageGuiaData, checkBox) => {
        // TODO: Guardar la info del paquete a firestore (si fue solicitado)
        if (checkBox) {
            db.collection('package')
                .add(packageData)
                .then(function(docRef) {
                    console.log('Document written with ID (destino): ', docRef.id);
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

        db.collection('supplier')
            .add(supplierData)
            .then(function(docRef) {
                console.log('Document written with ID (destino): ', docRef.id);
            })
            .catch(function(error) {
                console.error('Error adding document: ', error);
            });

        const directionsGuiasCollectionAdd = db
            .collection('guia')
            .doc(idGuiaGlobal.current)
            .update(supplierData);

        directionsGuiasCollectionAdd
            .then(function(docRef) {
                console.log('Se cumplio! Document written with ID (guia): ', docRef.id);
            })
            .catch(function(error) {
                console.error('Error adding document: ', error);
            });

        setCurrentStepName('descarga');
    };

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
                {currentStepName === 'origen' && <OrigenComponent onSave={saveOriginData} />}
                {currentStepName === 'destino' && <DestinoComponent onSave={saveDestinationData} />}
                {currentStepName === 'paquete' && <PaqueteComponent onSave={savePackagingData} />}
                {currentStepName === 'servicio' && (
                    <ServicioComponent
                        onSave={saveServiceData}
                        idGuiaGlobal={idGuiaGlobal.current}
                    />
                )}
                {currentStepName === 'descarga' && <DescargaComponent />}
            </StyledSendPage>
        </>
    );
};

export default SendPage;
