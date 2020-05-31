import React, { useState } from 'react';
import { ProgressIndicator, ProgressStep } from 'react-rainbow-components';
import { StyledSendPage } from './styled';
import { OrigenComponent } from './origen';
import { DestinoComponent } from './destino';
import { PaqueteComponent } from './paquete';
import { ServicioComponent } from './servicio';
import { DescargaComponent } from './descarga';

const SendPage = () => {
    const [currentStepName, setCurrentStepName] = useState('origen');

    const saveOriginData = () => {
        // TODO: Guardar la info de la dirección a firestore (si fue solicitado)
        // TODO: Guardar la dirección en un State, para usarla cuando se creará la guía
        setCurrentStepName('destino');
    };

    const saveDestinationData = () => {
        // TODO: Guardar la info de la dirección a firestore (si fue solicitado)
        // TODO: Guardar la dirección en un State, para usarla cuando se creará la guía
        setCurrentStepName('paquete');
    };

    const savePackagingData = () => {
        // TODO: Guardar la info del paquete a firestore (si fue solicitado)
        // TODO: Guardar la info del paquete en un State, para usarla cuando se creará la guía
        setCurrentStepName('servicio');
    };

    const saveServiceData = () => {
        // TODO: Guardar la elección de paquetería en un State, para usarla cuando se creará la guía
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
                {currentStepName === 'servicio' && <ServicioComponent onSave={saveServiceData} />}
                {currentStepName === 'descarga' && <DescargaComponent />}
            </StyledSendPage>
        </>
    );
};

export default SendPage;
