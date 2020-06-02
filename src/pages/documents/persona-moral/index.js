import React, { useState } from 'react';
import { Input } from 'react-rainbow-components';
import { useFirebaseApp, useUser } from 'reactfire';
import { StyledTabContent, StyledForm, StyledSubmit } from '../styled.js';
import FileSelector from '../../../components/react-rainbow-beta/components/FileSelector';

const TabPersonaMoral = () => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [RFC, setRFC] = useState('');
    const [date, setDate] = useState('');
    const [INEnumber, setINENumber] = useState('');
    const [fileDomicilio, setFileAddress] = useState([]);
    const [fileIne, setFileINE] = useState([]);
    const [fileFiscal, setFileFiscal] = useState('');
    //const [file, setFile] = useState('');
    const firebase = useFirebaseApp();
    const db = firebase.firestore();

    const register = files => {
        // const file = files[0];
        // const fileName = files[0].name;
        // const pathF = firebase.storage();
        // const filePath = `photos/${fileName}`;
        // const storageRef = pathF.ref(filePath);
        // storageRef.put(file).then(function(snapshot) {
        //     console.log('Uploaded a blob or file!');
        //     console.log(file.name);
        //     console.log(pathF);
        //     console.log(file);
        // });
        // // const profilesCollectionAdd = db.collection('profiles').add({
        //     name,
        //     direccion: address,
        //     telefono: phone,
        //     RFC,
        //     Fecha: date,
        //     INENumero: INEnumber,
        //     Comprobante_fiscal: INEnumber,
        // });
        // profilesCollectionAdd
        //     .then(function(docRef) {
        //         console.log('Document written with ID: ', docRef.id);
        //     })
        //     .catch(function(error) {
        //         console.error('Error adding document: ', error);
        //     });
    };

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
                        onChange={register}
                    />
                    <h5 className="rainbow-m-vertical_x-large">
                        Al enviar tu documentación aceptas los términos y condiciones y el aviso de
                        privacidad
                    </h5>
                    <StyledSubmit
                        className="rainbow-m-around_medium"
                        type="submit"
                        onClick={register}
                    >
                        Continuar
                    </StyledSubmit>
                </div>
            </StyledForm>
        </StyledTabContent>
    );
};

export default TabPersonaMoral;
