import React, { useState } from 'react';
import { Tab, Input } from 'react-rainbow-components';
import { useFirebaseApp, useUser } from 'reactfire';
import {
    StyledContainer,
    StyledTabset,
    StyledTabContent,
    StyledForm,
    StyledSubmit,
} from './styled.js';
import { useSecurity } from '../../hooks/useSecurity';
// TODO: CAMBIAR ESTO EN CUANTO LIBEREN LA VERSION FINAL DE FileSelector
import FileSelector from '../../components/react-rainbow-beta/components/FileSelector';

const TabPersonaFisica = () => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [RFC, setRFC] = useState('');
    const [date, setDate] = useState('');
    const [INEnumber, setINENumber] = useState('');
    const [fileFiscal, setFileFiscal] = useState('');
    const [fileIne, setFileINE] = useState([]);
    const [fileDomicilio, setFileAddress] = useState([]);
    const firebase = useFirebaseApp();

    const registerPersonaFisica = files => {
        const file = files[0];
        if (file) {
            const storageRef = firebase.storage().ref(`photos/${file.name}`);

            storageRef.put(file).then(function(snapshot) {
                console.log('Uploaded a blob or file!');
            });
        }
     /*   const profilesCollectionAdd = db.collection('profiles').add({
            name: name,
            direccion: address,
            telefono: phone,
            RFC: RFC,
            Fecha: date,
            INENumero: RFC,
            RFC: RFC,


        });
        profilesCollectionAdd
            .then(function(docRef) {
                console.log('Document written with ID: ', docRef.id);
            })
            .catch(function(error) {
                console.error('Error adding document: ', error);
            });*/
    };


    console.log(name);
    console.log(fileFiscal);

    return (
        <StyledTabContent
            aria-labelledby="pfisica"
            id="pfisicaTab"
            className="rainbow-p-around_xx-large rainbow-font-size-text_large"
        >
            <StyledForm>
                <div style={{ flex: '1 1' }}>
                    <div className="rainbow-align-content_center rainbow-flex_wrap">
                        <Input
                            id="nombreCompleto"
                            label="Nombre Completo"
                            name="nombreCompleto"
                            className="rainbow-p-around_medium"
                            style={{ width: '90%' }}
                            onChange={ev => setName(ev.target.value)}
                        />
                        <Input
                            id="domicilio"
                            label="Domicilio"
                            name="domicilio"
                            className="rainbow-p-around_medium"
                            style={{ width: '90%' }}
                            onChange={ev => setAddress(ev.target.value)}
                        />
                    </div>
                    <div className="rainbow-align-content_center rainbow-flex_wrap">
                        <Input
                            id="telefono"
                            label="Telefono"
                            name="telefono"
                            className="rainbow-p-around_medium"
                            style={{ width: '45%' }}
                            onChange={ev => setPhone(ev.target.value)}
                        />
                        <Input
                            id="rfc"
                            label="RFC"
                            name="rfc"
                            className="rainbow-p-around_medium"
                            style={{ width: '45%' }}
                            onChange={ev => setRFC(ev.target.value)}
                        />
                    </div>
                    <div className="rainbow-align-content_center rainbow-flex_wrap">
                        <Input
                            id="fechaNacimiento"
                            label="Fecha de nacimiento"
                            name="fechaNacimiento"
                            type="date"
                            className="rainbow-p-around_medium"
                            style={{ width: '90%' }}
                            onChange={ev => setDate(ev.target.value)}
                        />
                        <Input
                            id="numeroINE"
                            label="Número de INE"
                            name="numeroINE"
                            className="rainbow-p-around_medium"
                            style={{ width: '90%' }}
                            onChange={ev => setINENumber(ev.target.value)}
                        />
                    </div>
                </div>
                <div style={{ flex: '1 1', textAlign: 'center' }}>
                    <FileSelector
                        className="rainbow-p-horizontal_medium rainbow-m_auto"
                        label="Constancia de Situación Fiscal (Opcional)"
                        placeholder="Sube o arrastra tu archivo aquí"
                        style={{ height: '20%' }}
                        onChange={setFileFiscal}
                    />
                    <FileSelector
                        className="rainbow-p-horizontal_medium rainbow-m_auto"
                        label="Foto de INE"
                        placeholder="Sube o arrastra tu archivo aquí"
                        style={{ height: '20%' }}
                        onChange={setFileINE}
                    />
                    <FileSelector
                        className="rainbow-p-horizontal_medium rainbow-m_auto"
                        label="Comprobante de domicilio"
                        placeholder="Sube o arrastra tu archivo aquí"
                        style={{ height: '20%' }}
                        onChange={setFileAddress}
                    />
                    <h5 className="rainbow-m-vertical_x-large">
                        Al enviar tu documentación aceptas los términos y condiciones y el aviso de
                        privacidad
                    </h5>
                    <StyledSubmit className="rainbow-m-around_medium" type="submit">
                        Continuar
                    </StyledSubmit>
                </div>
            </StyledForm>
        </StyledTabContent>
    );
};

const TabPersonaMoral = () => {
    return (
        <StyledTabContent
            aria-labelledby="pmoral"
            id="pmoralTab"
            className="rainbow-p-around_xx-large rainbow-font-size-text_large"
        >
            <StyledForm>
                <div style={{ flex: '1 1' }}>
                    <div className="rainbow-align-content_center rainbow-flex_wrap">
                        <Input
                            id="razonSocial"
                            label="Razón Social"
                            name="razonSocial"
                            className="rainbow-p-around_medium"
                            style={{ width: '90%' }}
                        />
                        <Input
                            id="nombreRepLegal"
                            label="Nombre Representante Legal"
                            name="nombreRepLegal"
                            className="rainbow-p-around_medium"
                            style={{ width: '90%' }}
                        />
                        <Input
                            id="domicilio"
                            label="Domicilio"
                            name="domicilio"
                            className="rainbow-p-around_medium"
                            style={{ width: '90%' }}
                        />
                    </div>
                    <div className="rainbow-align-content_center rainbow-flex_wrap">
                        <Input
                            id="telefono"
                            label="Telefono"
                            name="telefono"
                            className="rainbow-p-around_medium"
                            style={{ width: '45%' }}
                        />
                        <Input
                            id="rfc"
                            label="RFC"
                            name="rfc"
                            className="rainbow-p-around_medium"
                            style={{ width: '45%' }}
                        />
                    </div>
                    <FileSelector
                        className="rainbow-p-horizontal_medium rainbow-m_auto"
                        label="Acta Constitutiva"
                        placeholder="Sube o arrastra tu archivo aquí"
                        style={{ height: '20%', marginBottom: '1rem' }}
                    />
                </div>
                <div style={{ flex: '1 1', textAlign: 'center' }}>
                    <FileSelector
                        className="rainbow-p-horizontal_medium rainbow-m_auto"
                        label="Constancia de Situación Fiscal"
                        placeholder="Sube o arrastra tu archivo aquí"
                        style={{ height: '20%' }}
                    />
                    <FileSelector
                        className="rainbow-p-horizontal_medium rainbow-m_auto"
                        label="Comprobante de domicilio"
                        placeholder="Sube o arrastra tu archivo aquí"
                        style={{ height: '20%' }}
                    />
                    <FileSelector
                        className="rainbow-p-horizontal_medium rainbow-m_auto"
                        label="Foto de INE Representante Legal"
                        placeholder="Sube o arrastra tu archivo aquí"
                        style={{ height: '20%' }}
                    />
                    <h5 className="rainbow-m-vertical_x-large">
                        Al enviar tu documentación aceptas los términos y condiciones y el aviso de
                        privacidad
                    </h5>
                    <StyledSubmit className="rainbow-m-around_medium" type="submit">
                        Continuar
                    </StyledSubmit>
                </div>
            </StyledForm>
        </StyledTabContent>
    );
};

const DocumentsPage = () => {
    const [selected, setSelected] = useState('pfisica');

    // useSecurity();

    return (
        <StyledContainer>
            <StyledTabset
                id="tabset-1"
                onSelect={(e, selected) => {
                    setSelected(selected);
                }}
                activeTabName={selected}
                className="rainbow-p-horizontal_x-large"
            >
                <Tab label="Persona Física" name="pfisica" id="pfisica" ariaControls="pfisicaTab" />

                <Tab label="Persona Moral" name="pmoral" id="pmoral" ariaControls="pmoralTab" />
            </StyledTabset>
            {selected === 'pfisica' && <TabPersonaFisica />}
            {selected === 'pmoral' && <TabPersonaMoral />}
        </StyledContainer>
    );
};

export default DocumentsPage;
