import React, { useState, useEffect } from 'react';
import { Input, Button, RadioGroup, Textarea } from 'react-rainbow-components';
import formatMoney from 'accounting-js/lib/formatMoney';
import { useFirebaseApp, useUser } from 'reactfire';
import { StyledComment } from './styled';
import * as firebase from 'firebase';

export default function InfoGeneral({ user }) {
    const [lastname, setLastName] = useState('');
    const [name, setName] = useState('');
    const [idClient, setIdClient] = useState('');
    const [status, setStatus] = useState('');
    const [saldo, setSaldo] = useState('');
    const [email, setEmail] = useState('');

    const [fileFis, setDownloadsFiles] = useState([]);

    const firebase = useFirebaseApp();
    const db = firebase.firestore();
    const userFirebase = useUser();

    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [RFC, setRFC] = useState('');
    const [date, setDate] = useState('');
    const [INEnumber, setINENumber] = useState('');

    const [fileActaConstitutiva, setFileActaConstitutiva] = useState();
    const [fileFiscal, setFileFiscal] = useState();
    const [fileIne, setFileINE] = useState();
    const [fileDomicilio, setFileAddress] = useState();
    const [comment, setComment] = useState('');
    const [showComment, setShowComment] = useState([]);
    const [persona, setPersona] = useState();
    const [razonSocial, setRazonSocial] = useState('');
    const [legalName, setLegalName] = useState('');

    const personaFisica = persona === 'Física';
    const personaMoral = persona === 'Moral';

    const creationDate = new Date();
    const optionsDate = { year: '2-digit', month: '2-digit', day: '2-digit' };

    const statusOptions = [
        { value: 'Aprobado', label: 'Aprobado' },
        { value: 'En Revisión', label: 'En Revisión' },
        { value: 'Falta Información', label: 'Información Errónea o Faltante' },
    ];

    // Obtiene los emails con la función cloud, que requiere un idToken de un admin
    useEffect(() => {
        let cancelXHR = false;
        userFirebase.getIdToken().then(idToken => {
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'json';
            xhr.onload = event => {
                if (cancelXHR) {
                    return;
                }
                var emails = xhr.response;
                if (emails) {
                    var emailObj = emails.find(obj => user.ID === obj['uid']);
                    setEmail(emailObj.email);
                }
            };
            xhr.open('GET', '/admin/getEmails');
            xhr.setRequestHeader('Authorization', 'Bearer ' + idToken);
            xhr.send();
        });
        return () => {
            cancelXHR = true;
        };
    }, [userFirebase]);

    useEffect(() => {
        setName(user.name);
        setLastName(user.lastname);
        setIdClient(user.idClient);
        setStatus(user.status ? user.status : 'En Revisión');
        setSaldo(user.saldo ? user.saldo : '0');
        setPhone(user.telefono);
        setRFC(user.RFC);
        setAddress(user.direccion);
        setDate(user.Fecha);
        setINENumber(user.INENumero);
        setPersona(user.persona);
        setRazonSocial(user.razon_social);
        setLegalName(user.nombreRepresentanteLegal);
    }, [user]);

    const docRef = db.collection('profiles').doc(user.id);
    docRef
        .get()
        .then(function(doc) {
            if (doc.exists) {
                setFileAddress(doc.data().files.fileDomicilio);
                setFileINE(doc.data().files.fileIne);
                setFileFiscal(doc.data().files.fileFiscal);
                setFileActaConstitutiva(doc.data().files.fileActaConstitutiva);
            } else {
                console.log('No such document!');
            }
        })
        .catch(function(error) {
            console.log('Error getting document:', error);
        });

    const downloadFiles = () => {
        window.open(fileDomicilio, 'Comprobante de domocilio');
        window.open(fileFiscal, 'Comprobante situación fiscal');
        window.open(fileIne, 'Comprobante de INE');
        if (fileActaConstitutiva) {
            window.open(fileActaConstitutiva, 'Acta constitutiva');
        }
    };

    useEffect(() => {
        if (user) {
            const reloadComments = () => {
                db.collection('profiles')
                    .doc(user.id)
                    .collection('comentarios')
                    .onSnapshot(handleComments);
            };
            reloadComments();
        }
    }, []);

    function handleComments(snapshot) {
        const showComment = snapshot.docs.map(doc => {
            //console.log('comentarios', doc.data(), doc.id);
            return {
                id: doc.id,
                // date : doc.data().creation_date,
                // date2 : new Date(doc.data().creation_date),
                ...doc.data(),
            };
        });
        // console.log(showComment, 'showComment');
        // let sortedComments = showComment.sort( (a,b) => {
        //     return new Date(a.date).getTime() - new Date(b.date).getTime();
        // } )

        // console.log(sortedComments, 'sortedComments');
        setShowComment(showComment);
    }
    const editProfile = () => {
        let editProfile = {};
        if (persona === 'Física') {
            editProfile = {
                name,
                lastname,
                status,
                telefono: phone,
                RFC,
                direccion: address,
                Fecha: date,
                INENumero: INEnumber,
            };
        }

        if (persona === 'Moral') {
            editProfile = {
                name,
                lastname,
                razon_social: razonSocial,
                status,
                telefono: phone,
                nombreRepresentanteLegal: legalName,
                direccion: address,
                RFC,
            };
        }

        if (persona !== 'Moral' && persona !== 'Física') {
            editProfile = {
                status,
            };
        }

        const directionsGuiasCollectionAdd = db
            .collection('profiles')
            .doc(user.id)
            .update(editProfile);

        if (comment.trim() === '') {
            directionsGuiasCollectionAdd
                .then(function(docRef) {
                    console.log('Se cumplio! Document written');
                })
                .catch(function(error) {
                    console.error('No se encontro el documento: ', error);
                });
            return;
        }
        directionsGuiasCollectionAdd
            .then(function(docRef) {
                console.log('Se cumplio! Document written');
            })
            .catch(function(error) {
                console.error('Error adding document: ', error);
            });
        const addComment = {
            comment,
            creation_date: creationDate.toLocaleDateString('es-US', optionsDate),
        };

        if (comment.trim() === '') {
            console.log('No hay comentarios por el momento');
        }

        db.collection('profiles')
            .doc(user.id)
            .collection('comentarios')
            .add(addComment)
            .then(function(docRef) {
                console.log('Document written');
            })
            .catch(function(error) {
                console.error('Error adding document: ', error);
            });
    };

    return (
        <>
            <h2>Editar Usuario</h2>
            <div className="rainbow-flex rainbow-flex_wrap">
                {personaFisica && (
                    <>
                        <div style={{ flex: '1 1' }}>
                            <Input
                                id="nombre"
                                label="Nombre"
                                className="rainbow-p-around_medium"
                                style={{ width: '100%' }}
                                value={name}
                                // onChange={ev => setName(ev.target.value)}
                                readOnly
                            />
                            <Input
                                id="apellido"
                                label="Apellido"
                                className="rainbow-p-around_medium"
                                style={{ width: '100%' }}
                                value={lastname}
                                // onChange={ev => setLastName(ev.target.value)}
                                readOnly
                            />
                            <Input
                                id="idCliente"
                                label="Id Cliente"
                                className="rainbow-p-around_medium"
                                style={{ width: '100%' }}
                                value={idClient}
                                // onChange={ev => setLastName(ev.target.value)}
                                readOnly
                            />
                            <Input
                                id="domicilio"
                                label="Nombre de la calle, número exterior e interior"
                                className="rainbow-p-around_medium"
                                style={{ width: '100%' }}
                                value={address}
                                onChange={ev => setAddress(ev.target.value)}
                            />
                            <Input
                                id="numeroine"
                                label="Número de INE"
                                className="rainbow-p-around_medium"
                                style={{ width: '100%' }}
                                value={INEnumber}
                                onChange={ev => setINENumber(ev.target.value)}
                            />
                            <Button
                                label="Descargar Archivos"
                                style={{ width: '100%', height: '4rem' }}
                                onClick={downloadFiles}
                            />
                        </div>

                        <div style={{ flex: '1 1' }}>
                            <Input
                                id="telefono"
                                label="Teléfono"
                                className="rainbow-p-around_medium"
                                style={{ width: '100%' }}
                                value={phone}
                                onChange={ev => setPhone(ev.target.value)}
                            />
                            <Input
                                id="RFC"
                                label="RFC"
                                className="rainbow-p-around_medium"
                                style={{ width: '100%' }}
                                value={RFC}
                                onChange={ev => setRFC(ev.target.value)}
                            />
                            <Input
                                id="fecha"
                                label="Fecha de nacimiento"
                                className="rainbow-p-around_medium"
                                style={{ width: '100%' }}
                                value={date}
                                onChange={ev => setDate(ev.target.value)}
                            />
                        </div>
                    </>
                )}

                {personaMoral && (
                    <>
                        <div style={{ flex: '1 1' }}>
                            <Input
                                id="nombre"
                                label="Nombre"
                                className="rainbow-p-around_medium"
                                style={{ width: '100%' }}
                                value={name}
                                // onChange={ev => setName(ev.target.value)}
                                readOnly
                            />
                            <Input
                                id="apellido"
                                label="Apellido"
                                className="rainbow-p-around_medium"
                                style={{ width: '100%' }}
                                value={lastname}
                                // onChange={ev => setLastName(ev.target.value)}
                                readOnly
                            />
                            <Input
                                id="idCliente"
                                label="Id Cliente"
                                className="rainbow-p-around_medium"
                                style={{ width: '100%' }}
                                value={idClient}
                                // onChange={ev => setLastName(ev.target.value)}
                                readOnly
                            />
                            <Input
                                id="domicilio"
                                label="Domicilio"
                                className="rainbow-p-around_medium"
                                style={{ width: '100%' }}
                                value={address}
                                onChange={ev => setAddress(ev.target.value)}
                            />
                            <Input
                                id="razonSocial"
                                label="Razon social"
                                className="rainbow-p-around_medium"
                                style={{ width: '100%' }}
                                value={razonSocial}
                                onChange={ev => setRazonSocial(ev.target.value)}
                            />
                            <Button
                                label="Descargar Archivos"
                                style={{ width: '100%', height: '4rem' }}
                                onClick={downloadFiles}
                            />
                        </div>

                        <div style={{ flex: '1 1' }}>
                            <Input
                                id="telefono"
                                label="Teléfono"
                                className="rainbow-p-around_medium"
                                style={{ width: '100%' }}
                                value={phone}
                                onChange={ev => setPhone(ev.target.value)}
                            />
                            <Input
                                id="RFC"
                                label="RFC"
                                className="rainbow-p-around_medium"
                                style={{ width: '100%' }}
                                value={RFC}
                                onChange={ev => setRFC(ev.target.value)}
                            />
                            <Input
                                id="representante"
                                label="Nombre del representante legal"
                                className="rainbow-p-around_medium"
                                style={{ width: '100%' }}
                                value={legalName}
                                onChange={ev => setLegalName(ev.target.value)}
                            />
                        </div>
                    </>
                )}

                <div style={{ flex: '1 1' }}>
                    <RadioGroup
                        id="radio-group-status"
                        options={statusOptions}
                        value={status}
                        onChange={ev => setStatus(ev.target.value)}
                        label="Status"
                    />
                    <h5>Crédito disponible</h5>
                    <p style={{ fontSize: '1.4rem' }}>{formatMoney(saldo, 2)}</p>
                    <h5>Correo</h5>
                    <p>{email}</p>
                </div>
                <div style={{ flex: '2 2' }}>
                    <Textarea
                        id="textarea-comentarios"
                        label="Comentarios"
                        rows={2}
                        placeholder="Placeholder Text"
                        className="rainbow-m-vertical_x-medium rainbow-p-horizontal_medium rainbow-m_auto"
                        onChange={ev => setComment(ev.target.value)}
                    />
                    {showComment.map((comentarios, idx) => (
                        <StyledComment key={'comentario_' + idx}>
                            {comentarios.comment}
                            <span className="date">{comentarios.creation_date}</span>
                        </StyledComment>
                    ))}

                    <Button className="btn-confirm" label="Guardar" onClick={editProfile} />
                </div>
            </div>
        </>
    );
}
