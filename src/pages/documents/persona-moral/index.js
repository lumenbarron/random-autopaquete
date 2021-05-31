import React, { useState, useEffect } from 'react';
import { Input, FileSelector } from 'react-rainbow-components';
import { useFirebaseApp, useUser } from 'reactfire';
import { useHistory } from 'react-router-dom';
import { StyledTabContent, StyledForm, StyledSubmit } from '../styled.js';
import swal from 'sweetalert2';
const phoneRegex = RegExp(/^[0-9]{10}$/);
const rfcRegex = RegExp(
    /^([A-ZÑ\x26]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1]))((-)?([A-Z\d]{3}))?$/,
);

const TabPersonaMoral = () => {
    const firebase = useFirebaseApp();
    const db = firebase.firestore();
    const history = useHistory();
    const user = useUser();
    const userEmail = user.providerData[0].email;
    const storage = firebase.storage();

    const [userName, setUserName] = useState('');
    const [idUser, setIdUser] = useState('');
    const [razonSocial, setRazonSocial] = useState('');
    const [legalName, setLegalName] = useState('');
    const [address, setAdrress] = useState('');
    const [phone, setPhone] = useState('');
    const [RFC, setRFC] = useState('');

    const [fileActaConstitutiva, setFileActaConstitutiva] = useState('');
    const [fileFiscal, setFileFiscal] = useState('');
    const [fileIne, setFileINE] = useState('');
    const [fileDomicilio, setFileAddress] = useState('');

    const [error, setError] = useState(false);
    const [errorIdUser, setErrorIdUser] = useState(false);
    const [errorRazonSocial, setErrorRazonSocial] = useState(false);
    const [errorLegalName, setErrorLegalName] = useState(false);
    const [errorAddress, setErrorAddress] = useState(false);
    const [errorPhone, setErrorPhone] = useState(false);
    const [errorRFC, setErrorRFC] = useState(false);
    const [errorFileActaConstitutiva, setErrorFileActaConstitutiva] = useState(false);
    const [errorFileFiscal, setErrorFileFiscal] = useState(false);
    const [errorFileDomicilio, setErrorFileDomicilio] = useState(false);
    const [errorFileIne, setErrorFileIne] = useState(false);

    const [correctRegister, setCorrectRegister] = useState(false);

    let uploadedFiles = 0;
    let filesToUpload = 0;

    let urlDomicilio = '';
    let urlIne = '';
    let urlFiscal = '';
    let urlActaConstituva = '';

    useEffect(() => {
        db.collection('profiles')
            .where('ID', '==', user.uid)
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    setUserName(doc.data().name);
                    setRazonSocial(doc.data().razon_social);
                    setLegalName(doc.data().nombreRepresentanteLegal);
                    setAdrress(doc.data().direccion);
                    setPhone(doc.data().telefono);
                    setRFC(doc.data().RFC);
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
                            idClient: idUser,
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
                        // setTimeout(function() {
                        //     history.push('/mi-cuenta');
                        // }, 1000);
                    }
                });
            });
        }
        setTimeout(function() {
            console.log('saliendo');
            logout();
        }, 1500);
    };

    const logout = () => {
        //e.preventDefault();
        firebase.auth().signOut();
        history.push('/signup');
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
        if (razonSocial === undefined || razonSocial.trim() === '') {
            setErrorRazonSocial(true);
            setError(true);
            return;
        } else {
            setErrorRazonSocial(false);
        }
        if (legalName === undefined || legalName.trim() === '') {
            setErrorLegalName(true);
            setError(true);
            return;
        } else {
            setErrorLegalName(false);
        }
        if (address === undefined || address.trim() === '') {
            setErrorAddress(true);
            setError(true);
            console.log(1);
            return;
        } else {
            setErrorAddress(false);
        }
        if (phone === undefined || phone.trim() === '' || !phoneRegex.test(phone)) {
            setErrorPhone(true);
            setError(true);
            return;
        } else {
            setErrorPhone(false);
        }
        if (RFC === undefined || RFC.trim() === '' || !rfcRegex.test(RFC)) {
            setErrorRFC(true);
            setError(true);
            return;
        } else {
            setErrorRFC(false);
        }

        if (
            fileActaConstitutiva === undefined ||
            fileActaConstitutiva === '' ||
            fileActaConstitutiva.length === 0
        ) {
            setErrorFileActaConstitutiva(true);
            setError(true);
            return;
        } else {
            setErrorFileActaConstitutiva(false);
        }
        if (fileFiscal === undefined || fileFiscal === '' || fileFiscal.length === 0) {
            setErrorFileFiscal(true);
            setError(true);
            return;
        } else {
            setErrorFileFiscal(false);
        }
        if (fileDomicilio === undefined || fileDomicilio === '' || fileDomicilio.length === 0) {
            setErrorFileDomicilio(true);
            setError(true);
            return;
        } else {
            setErrorFileDomicilio(false);
        }
        if (fileIne === undefined || fileIne === '' || fileIne.length === 0) {
            setErrorFileIne(true);
            setError(true);
            return;
        } else {
            setErrorFileIne(false);
        }
        //if idClient exist no save data
        db.collection('profiles')
            .where('idClient', '==', idUser.trim())
            .get()
            .then(function(querySnapshot) {
                if (!querySnapshot.empty) {
                    console.log('Usuario Existe:' + idUser.trim() + ' Bloquenado registro');
                    swal.fire('¡Oh no!', 'El id ya está registrado en la plataforma', 'error');
                } else {
                    console.log('Usuario No Existe:' + idUser.trim() + ' Creando registro');
                    setError(false);

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
                }
            })
            .catch(function(error) {
                console.log('Error getting documents: ', error);
                swal.fire(
                    '¡Oh no!',
                    'Error al conectar con la base de datos, intenta mas tarde',
                    'error',
                );
            });
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
                            id="idCliente"
                            label="Id Cliente"
                            name="idCliente"
                            value={idUser}
                            className={`rainbow-p-around_medium ${
                                errorIdUser ? 'empty-space' : ''
                            }`}
                            style={{ width: '90%' }}
                            onChange={ev => setIdUser(ev.target.value)}
                        />
                        <Input
                            id="razonSocial"
                            label="Razón Social"
                            name="razonSocial"
                            value={razonSocial}
                            className={`rainbow-p-around_medium ${
                                errorRazonSocial ? 'empty-space' : ''
                            }`}
                            style={{ width: '90%' }}
                            onChange={ev => setRazonSocial(ev.target.value)}
                        />
                        <Input
                            id="nombreRepLegal"
                            label="Nombre Representante Legal"
                            name="nombreRepLegal"
                            value={legalName}
                            className={`rainbow-p-around_medium ${
                                errorLegalName ? 'empty-space' : ''
                            }`}
                            style={{ width: '90%' }}
                            onChange={ev => setLegalName(ev.target.value)}
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
                            onChange={ev => setAdrress(ev.target.value)}
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
                            value={RFC}
                            className={`rainbow-p-around_medium ${errorRFC ? 'empty-space' : ''}`}
                            style={{ width: '45%' }}
                            onChange={ev => setRFC(ev.target.value)}
                        />
                    </div>
                    <FileSelector
                        className={`rainbow-p-horizontal_medium rainbow-m_auto ${
                            errorFileActaConstitutiva ? 'empty-file' : ''
                        }`}
                        label="Acta Constitutiva"
                        placeholder="Sube o arrastra tu archivo aquí"
                        style={{ height: '20%', marginBottom: '1rem' }}
                        onChange={setFileActaConstitutiva}
                    />
                </div>
                <div style={{ flex: '1 1', textAlign: 'center' }}>
                    <FileSelector
                        className={`rainbow-p-horizontal_medium rainbow-m_auto ${
                            errorFileFiscal ? 'empty-file' : ''
                        }`}
                        label="Constancia de Situación Fiscal"
                        placeholder="Sube o arrastra tu archivo aquí"
                        style={{ height: '20%' }}
                        onChange={setFileFiscal}
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
                    <FileSelector
                        className={`rainbow-p-horizontal_medium rainbow-m_auto ${
                            errorFileIne ? 'empty-file' : ''
                        }`}
                        label="Foto de INE Representante Legal"
                        placeholder="Sube o arrastra tu archivo aquí"
                        style={{ height: '20%' }}
                        onChange={setFileINE}
                    />
                    <h5 className="rainbow-m-vertical_x-large">
                        Al enviar tu documentación aceptas los términos y condiciones y el aviso de
                        privacidad
                    </h5>
                    {error && <div className="alert-error">corregir los campos marcados</div>}
                    {correctRegister && <div className="text-success">Registro completo</div>}
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
