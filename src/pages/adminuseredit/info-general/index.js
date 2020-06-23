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

    const [downloadsFiles, setDownloadsFiles] = useState([]);

    const firebase = useFirebaseApp();
    const db = firebase.firestore();
    const userFirebase = useUser();

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

    useEffect(() => {
        if (user) {
            const reloadFiles = () => {
                db.collection('profiles')
                    .where('ID', '==', user.ID)
                    .onSnapshot(handleFiles);
            };
            reloadFiles();
        }
    }, []);

    function handleFiles(snapshot) {
        const downloadsFiles = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data(),
            };
        });
        setDownloadsFiles(downloadsFiles);
    }

    const files = downloadsFiles.map((file, idx) => {
        return [file.files];
    });

    console.log('Tiene que existir algo aquí', files);

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

        directionsGuiasCollectionAdd
            .then(function(docRef) {
                console.log('Se cumplio! Document written with ID (guia): ', docRef.id);
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

                    <a href={files}>
                        <Button
                            label="Descargar Archivos"
                            style={{ width: '100%', height: '4rem' }}
                        />
                    </a>
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
                    />
                    <StyledComment>
                        Comentario 1<span className="date">21/Jun/2020</span>
                    </StyledComment>
                    <StyledComment>
                        Comentario 2<span className="date">23/Jun/2020</span>
                    </StyledComment>
                    <Button className="btn-confirm" label="Guardar" onClick={editProfile} />
                </div>
            </div>
        </>
    );
}
