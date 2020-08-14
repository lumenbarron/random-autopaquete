import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Input, FileSelector, DatePicker } from 'react-rainbow-components';
import { useFirebaseApp, useUser } from 'reactfire';
import { StyledTabContent, StyledForm, StyledSubmit } from '../styled';
import * as firebase from 'firebase';
import 'firebase/storage';

const phoneRegex = RegExp(/^[0-9]{10}$/);
const rfcRegex = RegExp(
    /^([A-ZÑ\x26]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1]))((-)?([A-Z\d]{3}))?$/,
);
const ineRegex = RegExp(/^[0-9]{13}$/);

const TabPersonaFisica = () => {
    const [userName, setUserName] = useState('');
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [RFC, setRFC] = useState('');
    const [date, setDate] = useState('');
    const [INEnumber, setINENumber] = useState('');

    const [fileFiscal, setFileFiscal] = useState('');
    const [fileIne, setFileINE] = useState('');
    const [fileDomicilio, setFileAddress] = useState('');

    const [error, setError] = useState(false);
    const [errorName, setErrorName] = useState(false);
    const [errorAddress, setErrorAddress] = useState(false);
    const [errorPhone, setErrorPhone] = useState(false);
    const [errorRFC, setErrorRFC] = useState(false);
    const [errorDate, setErrorDate] = useState(false);
    const [errorINENumber, setErrorINENumber] = useState(false);
    const [errorFileFiscal, setErrorFileFiscal] = useState(false);
    const [errorFileIne, setErrorFileIne] = useState(false);
    const [errorFileDomicilio, setErrorFileDomicilio] = useState(false);

    const [correctRegister, setCorrectRegister] = useState(false);

    const firebase = useFirebaseApp();
    const db = firebase.firestore();
    const history = useHistory();

    const storage = firebase.storage();

    const dateBorn = new Date(date.date);
    const user = useUser();
    const userEmail = user.providerData[0].email;

    let uploadedFiles = 0;
    let filesToUpload = 0;

    let urlDomicilio = '';
    let urlIne = '';
    let urlFiscal = '';

    useEffect(() => {
        db.collection('profiles')
            .where('ID', '==', user.uid)
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    setUserName(doc.data().name);
                    setName(doc.data().nombre_fiscal);
                    setAddress(doc.data().direccion);
                    setPhone(doc.data().telefono);
                    setRFC(doc.data().RFC);
                    // setDate(doc.data().Fecha);
                    setINENumber(doc.data().INENumero);
                });
            })
            .catch(function(error) {
                console.log('Error getting documents: ', error);
            });
    }, []);

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
                                setCorrectRegister(true);
                            })
                            .catch(function(error) {
                                setCorrectRegister(false);
                            });

                        user.getIdToken().then(idToken => {
                            const xhr = new XMLHttpRequest();
                            xhr.responseType = 'json';
                            xhr.contentType = 'application/json';
                            // xhr.onload = () => {
                            //     setSent(true);
                            //     setSending(false);
                            // };
                            xhr.open('POST', '/documentacion/send');
                            xhr.setRequestHeader('Authorization', `Bearer ${idToken}`);
                            xhr.send(
                                JSON.stringify({
                                    userName,
                                    userEmail,
                                }),
                            );
                        });

                        setTimeout(function() {
                            history.push('/mi-cuenta');
                        }, 1000);
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
        if (name.trim() === '') {
            setErrorName(true);
            setError(true);
            return;
        } else {
            setErrorName(false);
        }
        if (address.trim() === '') {
            setErrorAddress(true);
            setError(true);
            return;
        } else {
            setErrorAddress(false);
        }
        if (phone.trim() === '' || !phoneRegex.test(phone)) {
            setErrorPhone(true);
            setError(true);
            return;
        } else {
            setErrorPhone(false);
        }
        if (RFC.trim() === '' || !rfcRegex.test(RFC)) {
            setErrorRFC(true);
            setError(true);
            return;
        } else {
            setErrorRFC(false);
        }
        if (String(date) === '') {
            setErrorDate(true);
            setError(true);
            return;
        } else {
            setErrorDate(false);
        }
        if (INEnumber.trim() === '' || !ineRegex.test(INEnumber)) {
            setErrorINENumber(true);
            setError(true);
            return;
        } else {
            setErrorINENumber(false);
        }
        if (fileFiscal === '' || fileFiscal.length === 0) {
            setErrorFileFiscal(true);
            setError(true);
            return;
        } else {
            setErrorFileFiscal(false);
        }
        if (fileIne === '' || fileIne.length === 0) {
            setErrorFileIne(true);
            setError(true);
            return;
        } else {
            setErrorFileIne(false);
        }
        if (fileDomicilio === '' || fileDomicilio.length === 0) {
            setErrorFileDomicilio(true);
            setError(true);
            return;
        } else {
            setErrorFileDomicilio(false);
        }

        setError(false);
        setCorrectRegister(true);
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
                            value={name}
                            className={`rainbow-p-around_medium ${errorName ? 'empty-space' : ''}`}
                            style={{ width: '90%' }}
                            onChange={ev => setName(ev.target.value)}
                        />
                        <Input
                            id="domicilio"
                            label="Nombre de la calle, número exterior e interior"
                            name="domicilio"
                            value={address}
                            className={`rainbow-p-around_medium ${
                                errorAddress ? 'empty-space' : ''
                            }`}
                            style={{ width: '90%' }}
                            onChange={ev => setAddress(ev.target.value)}
                        />
                    </div>
                    <div className="rainbow-align-content_center rainbow-flex_wrap">
                        <Input
                            id="telefono"
                            label="Telefono"
                            name="telefono"
                            value={phone}
                            className={`rainbow-p-around_medium ${errorPhone ? 'empty-space' : ''}`}
                            style={{ width: '45%' }}
                            onChange={ev => setPhone(ev.target.value)}
                        />
                        <Input
                            id="rfc"
                            label="RFC"
                            name="rfc"
                            value={RFC.toUpperCase()}
                            className={`rainbow-p-around_medium ${errorRFC ? 'empty-space' : ''}`}
                            style={{ width: '45%' }}
                            onChange={ev => setRFC(ev.target.value)}
                        />
                    </div>
                    <div className="rainbow-align-content_center rainbow-flex_wrap">
                        <DatePicker
                            id="fechaNacimiento"
                            name="fechaNacimiento"
                            className={`rainbow-p-around_medium ${errorDate ? 'empty-space' : ''}`}
                            value={date.date}
                            label="Fecha de nacimiento"
                            onChange={value => setDate({ date: value })}
                            style={{ width: '90%' }}
                        />

                        <Input
                            id="numeroINE"
                            label="Número de INE"
                            name="numeroINE"
                            value={INEnumber}
                            className={`rainbow-p-around_medium ${
                                errorINENumber ? 'empty-space' : ''
                            }`}
                            style={{ width: '90%' }}
                            onChange={ev => setINENumber(ev.target.value)}
                        />
                    </div>
                </div>
                <div style={{ flex: '1 1', textAlign: 'center' }}>
                    <FileSelector
                        className={`rainbow-p-horizontal_medium rainbow-m_auto ${
                            errorFileFiscal ? 'empty-file' : ''
                        }`}
                        label="Constancia de Situación Fiscal (Opcional)"
                        placeholder="Sube o arrastra tu archivo aquí"
                        style={{ height: '20%' }}
                        onChange={setFileFiscal}
                    />
                    <FileSelector
                        className={`rainbow-p-horizontal_medium rainbow-m_auto ${
                            errorFileIne ? 'empty-file' : ''
                        }`}
                        label="Foto de INE"
                        placeholder="Sube o arrastra tu archivo aquí"
                        style={{ height: '20%' }}
                        onChange={setFileINE}
                    />
                    <FileSelector
                        className={`rainbow-p-horizontal_medium rainbow-m_auto ${
                            errorFileDomicilio ? 'empty-file' : ''
                        }`}
                        label="Comprobante de domicilio"
                        placeholder="Sube o arrastra tu archivo aquí"
                        style={{ height: '20%' }}
                        onChange={setFileAddress}
                    />
                    <h5 className="rainbow-m-vertical_x-large">
                        Al enviar tu documentación aceptas los términos y condiciones y el aviso de
                        privacidad
                    </h5>
                    {error && <div className="alert-error">Corregir los campos marcados</div>}
                    {correctRegister && <div className="text-success">Registro completo</div>}
                    <StyledSubmit className="rainbow-m-around_medium" type="submit">
                        Continuar
                    </StyledSubmit>
                </div>
            </StyledForm>
        </StyledTabContent>
    );
};

export default TabPersonaFisica;
