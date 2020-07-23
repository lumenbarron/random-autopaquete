import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Input, FileSelector, DatePicker } from 'react-rainbow-components';
import { useFirebaseApp, useUser } from 'reactfire';
import { StyledTabContent, StyledForm, StyledSubmit } from '../styled';
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

    const [error, setError] = useState(false);

    const firebase = useFirebaseApp();
    const db = firebase.firestore();
    const history = useHistory();

    const storage = firebase.storage();

    const user = useUser();
    const dateBorn = new Date(date.date);

    let uploadedFiles = 0;
    let filesToUpload = 0;

    let urlDomicilio = '';
    let urlIne = '';
    let urlFiscal = '';

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
                            nombre_fiscal: name,
                            direccion: address,
                            telefono: phone,
                            RFC,
                            Fecha: dateBorn.toLocaleDateString(),
                            INENumero: INEnumber,
                            persona: 'Física',
                            files: {
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

                        history.push('/mi-cuenta');
                    }
                });
            });
        }
    };

    const saveURL = () => {
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
            .child(fileIne[0].name)
            .getDownloadURL()
            .then(function(url) {
                urlIne = url;
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
        if (
            name.trim() === '' ||
            INEnumber.trim() === '' ||
            address.trim() === '' ||
            RFC.trim() === '' ||
            date.trim() === '' ||
            phone.trim() === ''
        ) {
            setError(true);
            return;
        }

        setError(false);

        let fileName = '';
        let filePath = '';

        filesToUpload = fileIne ? filesToUpload + 1 : filesToUpload;
        filesToUpload = fileFiscal ? filesToUpload + 1 : filesToUpload;
        filesToUpload = fileDomicilio ? filesToUpload + 1 : filesToUpload;

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
    };

    console.log();

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
                            label="Nombre de la calle, número exterior e interior"
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
                        <DatePicker
                            id="fechaNacimiento"
                            name="fechaNacimiento"
                            className="rainbow-p-around_medium"
                            value={date.date}
                            label="Fecha de nacimiento"
                            onChange={value => setDate({ date: value })}
                            style={{ width: '90%' }}
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
                    {error && (
                        <div className="alert-error">Todos los campos necesitan estar llenos</div>
                    )}
                    <StyledSubmit className="rainbow-m-around_medium" type="submit">
                        Continuar
                    </StyledSubmit>
                </div>
            </StyledForm>
        </StyledTabContent>
    );
};

export default TabPersonaFisica;
