import React, { useState } from 'react';
import { Input } from 'react-rainbow-components';
import { useFirebaseApp, useUser } from 'reactfire';
import { StyledTabContent, StyledForm, StyledSubmit } from '../styled.js';
import FileSelector from '../../../components/react-rainbow-beta/components/FileSelector';

const TabPersonaMoral = () => {
    const [razonSocial, setRazonSocial] = useState();
    const [legalName, setLegalName] = useState();
    const [address, setAdrress] = useState();
    const [phone, setPhone] = useState();
    const [RFC, setRFC] = useState();

    const [fileActaConstitutiva, setFileActaConstitutiva] = useState();
    const [fileFiscal, setFileFiscal] = useState();
    const [fileIne, setFileINE] = useState();
    const [fileDomicilio, setFileAddress] = useState();

    const firebase = useFirebaseApp();
    const db = firebase.firestore();
    const storage = firebase.storage();

    const user = useUser();

    let uploadedFiles = 0;
    let filesToUpload = 0;

    let urlDomicilio = '';
    let urlIne = '';
    let urlFiscal = '';
    let urlActaConstituva = '';

    const saveData = () => {
        if (user) {
            const docRef = db.collection('profiles').where('ID', '==', user.uid);

            docRef.get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    const userName = doc.data().name;
                    const lastName = doc.data().lastname;
                    const DocRef = doc.id;

                    if (uploadedFiles === filesToUpload) {
                        const userData = {
                            razon_social: razonSocial,
                            nombreRepresentanteLegal: legalName,
                            direccion: address,
                            telefono: phone,
                            RFC,
                            persona: 'Moral',
                            files: {
                                fileActaConstitutiva: fileActaConstitutiva
                                    ? urlActaConstituva
                                    : undefined,
                                fileFiscal: fileFiscal ? urlFiscal : undefined,
                                fileIne: fileIne ? urlIne : undefined,
                                fileDomicilio: fileDomicilio ? urlDomicilio : undefined,
                            },
                        };

                        const profilesCollectionAdd = db
                            .collection('profiles')
                            .doc(DocRef)
                            .update(userData);

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
        }
    };

    const saveURL = () => {
        storage
            .ref(`documentation/${user.uid}`)
            .child(fileActaConstitutiva[0].name)
            .getDownloadURL()
            .then(function(url) {
                urlActaConstituva = url;
                saveData();
            });

        storage
            .ref(`documentation/${user.uid}`)
            .child(fileIne[0].name)
            .getDownloadURL()
            .then(function(url) {
                urlIne = url;
                saveData();
            });
        storage
            .ref(`documentation/${user.uid}`)
            .child(fileDomicilio[0].name)
            .getDownloadURL()
            .then(function(url) {
                urlDomicilio = url;
                saveData();
            });

        storage
            .ref(`documentation/${user.uid}`)
            .child(fileFiscal[0].name)
            .getDownloadURL()
            .then(function(url) {
                urlFiscal = url;
                saveData();
            });
    };

    const register = e => {
        e.preventDefault();
        let fileName = '';
        let filePath = '';

        filesToUpload = fileActaConstitutiva ? filesToUpload + 1 : filesToUpload;
        filesToUpload = fileIne ? filesToUpload + 1 : filesToUpload;
        filesToUpload = fileFiscal ? filesToUpload + 1 : filesToUpload;
        filesToUpload = fileDomicilio ? filesToUpload + 1 : filesToUpload;

        if (fileActaConstitutiva) {
            fileName = fileActaConstitutiva[0].name;
            filePath = `documentation/${user.uid}/${fileName}`;
            firebase
                .storage()
                .ref(filePath)
                .put(fileActaConstitutiva[0])
                .then(snapshot => {
                    uploadedFiles += 1;
                    saveURL();
                });
        }

        if (fileFiscal) {
            fileName = fileFiscal[0].name;
            filePath = `documentation/${user.uid}/${fileName}`;
            firebase
                .storage()
                .ref(filePath)
                .put(fileFiscal[0])
                .then(snapshot => {
                    uploadedFiles += 1;
                    saveURL();
                });
        }

        if (fileDomicilio) {
            fileName = fileDomicilio[0].name;
            filePath = `documentation/${user.uid}/${fileName}`;
            firebase
                .storage()
                .ref(filePath)
                .put(fileDomicilio[0])
                .then(snapshot => {
                    uploadedFiles += 1;
                    saveURL();
                });
        }

        if (fileIne) {
            fileName = fileIne[0].name;
            filePath = `documentation/${user.uid}/${fileName}`;
            firebase
                .storage()
                .ref(filePath)
                .put(fileIne[0])
                .then(snapshot => {
                    uploadedFiles += 1;
                    saveURL();
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
