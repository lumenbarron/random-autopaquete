import React, { useState, useEffect } from 'react';
import { Input, Button, RadioGroup, Textarea } from 'react-rainbow-components';
import formatMoney from 'accounting-js/lib/formatMoney';
import { useFirebaseApp, useUser } from 'reactfire';
import { StyledComment } from './styled';
import * as firebase from 'firebase';

export default function InfoGeneral({ user }) {
    const [lastname, setLastName] = useState('');
    const [name, setName] = useState('');
    const [status, setStatus] = useState('');
    const [saldo, setSaldo] = useState('');
    const [email, setEmail] = useState('');

    const [fileFis, setDownloadsFiles] = useState([]);

    const firebase = useFirebaseApp();
    const db = firebase.firestore();
    const userFirebase = useUser();

    const [fileActaConstitutiva, setFileActaConstitutiva] = useState();
    const [fileFiscal, setFileFiscal] = useState();
    const [fileIne, setFileINE] = useState();
    const [fileDomicilio, setFileAddress] = useState();
    const [comment, setComment] = useState('');
    const [showComment, setShowComment] = useState([]);

    const creationDate = new Date();

    const statusOptions = [
        { value: 'Aprobado', label: 'Aprobado' },
        { value: 'En Revisión', label: 'En Revisión' },
        { value: 'Falta Información', label: 'Información Errónea o Faltante' },
    ];

    useEffect(() => {
        setName(user.name);
        setLastName(user.lastname);
        setStatus(user.status ? user.status : 'En Revisión');
        setSaldo(user.saldo ? user.saldo : '0');
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
            return {
                id: doc.id,
                ...doc.data(),
            };
        });
        setShowComment(showComment);
    }
    const editProfile = () => {
        const editProfile = {
            name,
            lastname,
            status,
            saldo,
        };

        const directionsGuiasCollectionAdd = db
            .collection('profiles')
            .doc(user.id)
            .update(editProfile);

        if (comment.trim() === '') {
            directionsGuiasCollectionAdd
                .then(function(docRef) {
                    console.log('Se cumplio! Document written with ID (guia): ', docRef.id);
                })
                .catch(function(error) {
                    console.error('Error adding document: ', error);
                });
            return;
        }
        directionsGuiasCollectionAdd
            .then(function(docRef) {
                console.log('Se cumplio! Document written with ID (guia): ', docRef.id);
            })
            .catch(function(error) {
                console.error('Error adding document: ', error);
            });
        const addComment = {
            comment,
            creation_date: creationDate.toLocaleDateString(),
        };
        db.collection('profiles')
            .doc(user.id)
            .collection('comentarios')
            .add(addComment)
            .then(function(docRef) {
                console.log('Document written with ID (origen): ', docRef.id);
            })
            .catch(function(error) {
                console.error('Error adding document: ', error);
            });
    };
    return (
        <>
            <h2>Editar Usuario</h2>
            <div className="rainbow-flex rainbow-flex_wrap">
                <div style={{ flex: '1 1' }}>
                    <Input
                        id="nombre"
                        label="Nombre"
                        className="rainbow-p-around_medium"
                        style={{ width: '100%' }}
                        value={name}
                        onChange={ev => setName(ev.target.value)}
                    />
                    <Input
                        id="apellido"
                        label="Apellido"
                        className="rainbow-p-around_medium"
                        style={{ width: '100%' }}
                        value={lastname}
                        onChange={ev => setLastName(ev.target.value)}
                    />

                    <Button
                        label="Descargar Archivos"
                        style={{ width: '100%', height: '4rem' }}
                        onClick={downloadFiles}
                    />
                </div>
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
                        <StyledComment>
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
