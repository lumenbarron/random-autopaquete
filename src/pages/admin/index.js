import React, { useState } from 'react';
import { StyledAdmin } from './styled';
import 'firebase/auth';
import * as firebase from 'firebase';
import { useBlockSecurity } from '../../hooks/useBlockSecurity';

import { useFirebaseApp, useUser } from 'reactfire';
import { useHistory } from 'react-router-dom';

const AdminPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const firebase = useFirebaseApp();
    const history = useHistory();
    const db = firebase.firestore();

    const login = async e => {
        e.preventDefault();
        if (email.trim() === '' || password.trim() === '') {
            console.log('Espacios vacios');
            return;
        }

        await firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(({ user }) => {
                const docRef = db.collection('profiles').where('ID', '==', user.uid);
                docRef
                    .get()
                    .then(function(querySnapshot) {
                        querySnapshot.forEach(function(doc) {
                            console.log(doc.data().user_type);
                            if (doc.data().user_type === 'regular') {
                                history.push('/mi-cuenta');
                                console.log('En este forumlario solo se registra el admin');
                            }
                            if (doc.data().user_type === 'admin') {
                                history.push('/admin/usuarios');
                                console.log(user);
                            }

                            // revisar si el usuario tiene perfil en firestore y si es de tipo admin
                        });
                    })
                    .catch(function(error) {
                        console.log('Error getting documents: ', error);
                    });
            });
    };
    useBlockSecurity();

    return (
        <StyledAdmin>
            <div>
                <div className="back1">
                    <div className="formulario">
                        <form>
                            <img src="/assets/logo.png" alt="Logo Autopaquete" width="300"></img>
                            <div className="contenedor">
                                <div className="input-contenedor">
                                    <input
                                        type="text"
                                        placeholder="Correo Electronico"
                                        id="email"
                                        onChange={ev => setEmail(ev.target.value)}
                                    ></input>
                                </div>

                                <div className="input-contenedor">
                                    <input
                                        type="password"
                                        placeholder="Contraseña"
                                        id="password"
                                        onChange={ev => setPassword(ev.target.value)}
                                    ></input>
                                </div>
                                <input
                                    type="submit"
                                    value="Iniciar sesión"
                                    className="button"
                                    onClick={login}
                                ></input>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </StyledAdmin>
    );
};

export default AdminPage;
