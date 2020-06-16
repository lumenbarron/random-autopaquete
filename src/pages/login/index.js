import React, { useState, useEffect } from 'react';

import { useHistory } from 'react-router-dom';
import { Input, Button } from 'react-rainbow-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faUser, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useFirebaseApp, useUser } from 'reactfire';
import * as firebase from 'firebase';
import 'firebase/storage';
import { StyledLoginPage, StyledLoginSection } from './styled';
import { useBlockSecurity } from '../../hooks/useBlockSecurity';
import 'firebase/auth';

const containerStyles = {
    maxWidth: 1000,
};

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [name, setName] = useState('');
    const [lastname, setLastName] = useState('');
    const [image, setImage] = useState('');
    const firebase = useFirebaseApp();
    const history = useHistory();
    const user = useUser();
    const db = firebase.firestore();

    // Crear usuario con correo y contraseña
    const register = e => {
        e.preventDefault();
        if (
            newEmail.trim() === '' ||
            newPassword.trim() === '' ||
            name.trim() === '' ||
            lastname.trim() === ''
        ) {
            console.log('Espacios vacios');
            return;
        }
        firebase
            .auth()
            .createUserWithEmailAndPassword(newEmail, newPassword)
            .then(({ user }) => {
                user.sendEmailVerification();
                history.push('/mi-cuenta');
                const profilesCollectionAdd = db.collection('profiles').add({
                    name,
                    lastname,
                    user_type: 'regular',
                    ID: user.uid,
                });
                profilesCollectionAdd
                    .then(function(docRef) {
                        console.log('Document written with ID: ', docRef.id);
                    })
                    .catch(function(error) {
                        console.error('Error adding document: ', error);
                    });
            });
    };

    // Iniciar sesión
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
                            }
                            if (doc.data().user_type === 'admin') {
                                history.push('/admin/usuarios');
                            }

                            // revisar si el usuario tiene perfil en firestore y si es de tipo admin
                        });
                    })
                    .catch(function(error) {
                        console.log('Error getting documents: ', error);
                    });
            });
    };

    const restorePass = async e => {
        e.preventDefault();
        if (email.trim() === '') {
            console.log('Espacios vacios');
            return;
        }
        firebase.auth().sendPasswordResetEmail(email);
    };

    //   useBlockSecurity();

    return (
        <StyledLoginPage>
            <StyledLoginSection>
                <h1>Iniciar sesión</h1>
                <form>
                    <Input
                        label="Email o nombre de ususario"
                        style={containerStyles}
                        className="rainbow-m-vertical_x-large rainbow-p-horizontal_medium rainbow-m_auto"
                        icon={<FontAwesomeIcon icon={faEnvelope} />}
                        onChange={ev => setEmail(ev.target.value)}
                    />
                    <Input
                        label="Contraseña"
                        style={containerStyles}
                        className="rainbow-m-vertical_x-large rainbow-p-horizontal_medium rainbow-m_auto"
                        icon={<FontAwesomeIcon icon={faKey} />}
                        type="password"
                        onChange={ev => setPassword(ev.target.value)}
                    />

                    <Button className="boton" type="submit" onClick={login}>
                        Iniciar sesión
                    </Button>
                    <a href="/login" onClick={restorePass}>
                        ¿Olvidaste tu constraseña?
                    </a>
                </form>
            </StyledLoginSection>

            <StyledLoginSection>
                <h1>Regístrate</h1>
                <div>
                    <form>
                        <div className="rainbow-align-content_center rainbow-flex_wrap">
                            <Input
                                id="name"
                                label="Nombre(s)"
                                name="name"
                                className="rainbow-p-around_medium"
                                onChange={ev => setName(ev.target.value)}
                                style={{ width: '45%' }}
                                icon={<FontAwesomeIcon icon={faUser} />}
                            />
                            <Input
                                id="lastname"
                                label="Apellido(s)"
                                name="lastname"
                                className="rainbow-p-around_medium"
                                onChange={ev => setLastName(ev.target.value)}
                                style={{ width: '45%' }}
                                icon={<FontAwesomeIcon icon={faUser} />}
                            />
                        </div>
                        <div className="rainbow-align-content_center rainbow-flex_wrap">
                            <Input
                                id="email"
                                label="Correo"
                                name="email"
                                type="email"
                                className="rainbow-p-around_medium"
                                style={{ width: '90%' }}
                                onChange={ev => setNewEmail(ev.target.value)}
                                icon={<FontAwesomeIcon icon={faEnvelope} />}
                            />
                        </div>
                        <div className="rainbow-align-content_center rainbow-flex_wrap">
                            <Input
                                id="password"
                                label="Contraseña"
                                name="password"
                                type="password"
                                className="rainbow-p-around_medium"
                                style={{ width: '90%' }}
                                onChange={ev => setNewPassword(ev.target.value)}
                                icon={<FontAwesomeIcon icon={faKey} />}
                            />
                        </div>
                        <div className="rainbow-align-content_center rainbow-flex_wrap">
                            <p style={{ fontSize: '0.9rem' }}>
                                Al darle Unirse estás aceptando nuestro
                                <a href="/aviso-de-privacidad">Aviso de privacidad</a> y nuestros{' '}
                                <a href="/terminos-y-condiciones">Términos y condiciones.</a>
                            </p>
                            <Button
                                className="boton rainbow-m-around_medium"
                                type="submit"
                                onClick={register}
                            >
                                Unirse
                            </Button>
                        </div>
                    </form>
                </div>
            </StyledLoginSection>
        </StyledLoginPage>
    );
};

export default LoginPage;
