import React, { useState } from 'react';
import { Input } from 'react-rainbow-components';
import { useFirebaseApp, useUser } from 'reactfire';
import { StyledTabContent, StyledForm, StyledSubmit } from '../styled';
import FileSelector from '../../../components/react-rainbow-beta/components/FileSelector';
import * as firebase from 'firebase';
import 'firebase/storage';

const TabPersonaFisica = () => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [RFC, setRFC] = useState('');
    const [date, setDate] = useState('');
    const [INEnumber, setINENumber] = useState('');

    const [fileFiscal, setFileFiscal] = useState();
    const [fileIne, setFileINE] = useState();
    const [fileDomicilio, setFileAddress] = useState();

    const firebase = useFirebaseApp();
    const db = firebase.firestore();

    const user = useUser();

    let uploadedFiles = 0;
    let filesToUpload = 0;

    const docRef = db.collection('profiles').where('ID', '==', user.uid);
    docRef.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // console.log(doc);
        });
    });

    const saveData = () => {
        // docRef.get().then(function(querySnapshot) {
        //     querySnapshot.forEach(function(doc) {
        //         const userName = doc.data().name;
        //         const lastName = doc.data().lastname;
        //         const DocRef = doc.id;

        //         console.log('Apellido', doc.data().lastname);
        //         console.log('Usuario', doc.data().name);

        if (uploadedFiles === filesToUpload) {
            const userData = {
                ID: user.uid,
                name: '',
                lastname: '',
                nombre_fiscal: name,
                direccion: address,
                telefono: phone,
                RFC,
                Fecha: date,
                INENumero: INEnumber,
                Comprobante_fiscal: INEnumber,
                user_type: 'regular',
                files: {
                    fileFiscal: fileFiscal ? `photos/${fileFiscal[0].name}` : undefined,
                    fileIne: fileIne ? `photos/${fileIne[0].name}` : undefined,
                    fileDomicilio: fileDomicilio ? `photos/${fileDomicilio[0].name}` : undefined,
                },
            };

            //console.log('Documento', DocRef);
            const profilesCollectionAdd = db
                .collection('profiles')
                .doc('XehxzcFtQNFosDYOISeJ')
                .update(userData);

            //const profilesCollectionAdd = db.collection('profiles').add(userData);

            profilesCollectionAdd
                .then(function() {
                    console.log('Document successfully written!');
                })
                .catch(function(error) {
                    console.error('Error writing document: ', error);
                });
        }
        //     });
        // });
    };

    const register = e => {
        e.preventDefault();

        console.log('name', name);
        console.log('address', address);
        console.log('phone', phone);
        console.log('RFC', RFC);
        console.log('INEnumber', INEnumber);

        console.log('fileFiscal', fileFiscal);
        console.log('fileIne', fileIne);
        console.log('fileDomicilio', fileDomicilio);

        let fileName = '';
        let filePath = '';

        filesToUpload = fileIne ? filesToUpload + 1 : filesToUpload;
        filesToUpload = fileFiscal ? filesToUpload + 1 : filesToUpload;
        filesToUpload = fileDomicilio ? filesToUpload + 1 : filesToUpload;

        if (fileDomicilio) {
            fileName = fileDomicilio[0].name;
            filePath = `photos/${fileName}`;
            firebase
                .storage()
                .ref(filePath)
                .put(fileDomicilio[0])
                .then(snapshot => {
                    // save somewhere ---> snapshot;
                    uploadedFiles += 1;
                    saveData();
                });
        }

        if (fileIne) {
            fileName = fileIne[0].name;
            filePath = `photos/${fileName}`;
            firebase
                .storage()
                .ref(filePath)
                .put(fileIne[0])
                .then(snapshot => {
                    uploadedFiles += 1;
                    saveData();
                });
        }

        if (fileFiscal) {
            fileName = fileFiscal[0].name;
            filePath = `photos/${fileName}`;
            firebase
                .storage()
                .ref(filePath)
                .put(fileFiscal[0])
                .then(snapshot => {
                    uploadedFiles += 1;
                    saveData();
                });
        }
    };

    return (
        <StyledTabContent
            aria-labelledby="pfisica"
            id="pfisicaTab"
            className="rainbow-p-around_xx-large rainbow-font-size-text_large"
        >
            <StyledForm onSubmit={register}>
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

export default TabPersonaFisica;
