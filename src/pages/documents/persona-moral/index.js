import React, { useState } from 'react';
import { Input } from 'react-rainbow-components';
import { useFirebaseApp, useUser } from 'reactfire';
import { StyledTabContent, StyledForm, StyledSubmit } from '../styled.js';
import FileSelector from '../../../components/react-rainbow-beta/components/FileSelector';

const TabPersonaMoral = () => {
    const [razonSocial, setRazonSocial] = useState('');
    const [legalName, setLegalName] = useState('');
    const [address, setAdrress] = useState('');
    const [phone, setPhone] = useState('');
    const [RFC, setRFC] = useState('');

    const [fileActaConstitutiva, setFileActaConstitutiva] = useState();
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
        docRef.get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                const userName = doc.data().name;
                const lastName = doc.data().lastname;
                const DocRef = doc.id;

                if (uploadedFiles === filesToUpload) {
                    const userData = {
                        ID: user.uid,
                        name: userName,
                        lastname: lastName,
                        razon_social: razonSocial,
                        nombreRepresentanteLegal: legalName,
                        direccion: address,
                        telefono: phone,
                        RFC,
                        user_type: 'regular',
                        files: {
                            fileActaConstitutiva: fileActaConstitutiva
                                ? `photos/${fileActaConstitutiva[0].name}`
                                : undefined,
                            fileFiscal: fileFiscal ? `photos/${fileFiscal[0].name}` : undefined,
                            fileIne: fileIne ? `photos/${fileIne[0].name}` : undefined,
                            fileDomicilio: fileDomicilio
                                ? `photos/${fileDomicilio[0].name}`
                                : undefined,
                        },
                    };

                    //console.log('Documento', DocRef);
                    const profilesCollectionAdd = db
                        .collection('profiles')
                        .doc(DocRef)
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
            });
        });
    };

    const register = e => {
        e.preventDefault();

        console.log('name', 'name');
        console.log('address', address);
        console.log('phone', phone);
        console.log('RFC', RFC);
        console.log('INEnumber', 'INEnumber');

        console.log('fileFiscal', fileFiscal);
        console.log('fileIne', fileIne);
        console.log('fileDomicilio', fileDomicilio);

        let fileName = '';
        let filePath = '';

        filesToUpload = fileActaConstitutiva ? filesToUpload + 1 : filesToUpload;
        filesToUpload = fileIne ? filesToUpload + 1 : filesToUpload;
        filesToUpload = fileFiscal ? filesToUpload + 1 : filesToUpload;
        filesToUpload = fileDomicilio ? filesToUpload + 1 : filesToUpload;

        if (fileActaConstitutiva) {
            fileName = fileActaConstitutiva[0].name;
            filePath = `photos/${fileName}`;
            firebase
                .storage()
                .ref(filePath)
                .put(fileActaConstitutiva[0])
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
                            onChange={ev => setRazonSocial(ev.target.value)}
                        />
                        <Input
                            id="nombreRepLegal"
                            label="Nombre Representante Legal"
                            name="nombreRepLegal"
                            className="rainbow-p-around_medium"
                            style={{ width: '90%' }}
                            onChange={ev => setLegalName(ev.target.value)}
                        />
                        <Input
                            id="domicilio"
                            label="Domicilio"
                            name="domicilio"
                            className="rainbow-p-around_medium"
                            style={{ width: '90%' }}
                            onChange={ev => setAdrress(ev.target.value)}
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
                    <FileSelector
                        className="rainbow-p-horizontal_medium rainbow-m_auto"
                        label="Acta Constitutiva"
                        placeholder="Sube o arrastra tu archivo aquí"
                        style={{ height: '20%', marginBottom: '1rem' }}
                        onChange={setFileActaConstitutiva}
                    />
                </div>
                <div style={{ flex: '1 1', textAlign: 'center' }}>
                    <FileSelector
                        className="rainbow-p-horizontal_medium rainbow-m_auto"
                        label="Constancia de Situación Fiscal"
                        placeholder="Sube o arrastra tu archivo aquí"
                        style={{ height: '20%' }}
                        onChange={setFileFiscal}
                    />
                    <FileSelector
                        className="rainbow-p-horizontal_medium rainbow-m_auto"
                        label="Comprobante de domicilio"
                        placeholder="Sube o arrastra tu archivo aquí"
                        style={{ height: '20%' }}
                        onChange={setFileAddress}
                    />
                    <FileSelector
                        className="rainbow-p-horizontal_medium rainbow-m_auto"
                        label="Foto de INE Representante Legal"
                        placeholder="Sube o arrastra tu archivo aquí"
                        style={{ height: '20%' }}
                        onChange={setFileINE}
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
