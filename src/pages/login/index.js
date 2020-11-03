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
import swal from 'sweetalert2';

const containerStyles = {
    maxWidth: 1000,
};

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const [newEmail, setNewEmail] = useState('');
    // const [newPassword, setNewPassword] = useState('');
    // const [name, setName] = useState('');
    // const [lastname, setLastName] = useState('');

    const [errorLogIn, setErrorLogIn] = useState(false);
    //const [errorUserAlreadyRegistered, setErrorUserAlreadyRegistered] = useState(false);
    const [errorEmptyLogIn, setErrorEmptyLogIn] = useState(false);
    const [errorRestorePass, setErrorRestorePass] = useState(false);
    const [errorEmptyRestorePass, setErrorEmptyRestorePass] = useState(false);
    //const [errorRegister, setErrorRegister] = useState(false);

    const firebase = useFirebaseApp();
    // const history = useHistory();
    // const user = useUser();
    // const db = firebase.firestore();

    const [message, setMessage] = useState(false);
    const [messegeClass, setMessegeClass] = useState(false);

    // Crear usuario con correo y contraseña
    // const register = e => {
    //     e.preventDefault();
    //     if (
    //         newEmail.trim() === '' ||
    //         newPassword.trim() === '' ||
    //         name.trim() === '' ||
    //         lastname.trim() === ''
    //     ) {
    //         setErrorRegister(true);
    //         return;
    //     }
    //     firebase
    //         .auth()
    //         .createUserWithEmailAndPassword(newEmail, newPassword)
    //         .then(({ user }) => {
    //             user.sendEmailVerification();
    //             const profilesCollectionAdd = db.collection('profiles').add({
    //                 name,
    //                 lastname,
    //                 user_type: 'regular',
    //                 ID: user.uid,
    //                 status: 'En Revisión',
    //                 saldo: 0,
    //             });
    //             profilesCollectionAdd
    //                 .then(function(docRef) {
    //                     history.push('/documentacion');
    //                 })
    //                 .catch(function(error) {
    //                     console.error('Error adding document: ', error);
    //                 });
    //             setErrorUserAlreadyRegistered(false);
    //         })
    //         .catch(function() {
    //             setErrorRegister(false);
    //             setErrorUserAlreadyRegistered(true);
    //         });
    // };

    // Iniciar sesión
    const login = async e => {
        e.preventDefault();
        if (email.trim() === '' || password.trim() === '') {
            setErrorEmptyLogIn(true);
            return;
        }

        await firebase
            .auth()
            .setPersistence(firebase.auth.Auth.Persistence.SESSION)
            .then(function() {
                return firebase
                    .auth()
                    .signInWithEmailAndPassword(email, password)
                    .catch(function() {
                        setErrorLogIn(true);
                        swal.fire({
                            title: '!Oh no!',
                            text: 'Favor de verificar que el correo o la contraseña sean correctos',
                            icon: 'error',
                            confirmButtonText: 'Ok',
                        });
                    });
            })
            .catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
            });
    };

    const restorePass = async e => {
        e.preventDefault();
        if (email.trim() === '') {
            setErrorEmptyRestorePass(true);
            return;
        }
        firebase
            .auth()
            .sendPasswordResetEmail(email)
            .then(function() {
                setErrorRestorePass(true);
                setMessage('El correo de recuperción se envío correctamente');
                setMessegeClass('restore-pass');
            })
            .catch(function(error) {
                setErrorRestorePass(true);
                setMessage('Correo incorrecto');
                setMessegeClass('alert-error');
            });
    };

    useBlockSecurity();

    return (
        <StyledLoginPage>
            <StyledLoginSection>
                <h1>Iniciar sesión</h1>
                <div className="rainbow-align-content_center rainbow-flex_wrap">
                    <form>
                        <Input
                            label="Email o nombre de ususario"
                            // style={containerStyles}
                            className="rainbow-p-around_medium"
                            icon={<FontAwesomeIcon icon={faEnvelope} />}
                            onChange={ev => setEmail(ev.target.value)}
                        />
                        <Input
                            label="Contraseña"
                            className="rainbow-p-around_medium"
                            icon={<FontAwesomeIcon icon={faKey} />}
                            type="password"
                            onChange={ev => setPassword(ev.target.value)}
                        />

                        {errorEmptyLogIn && (
                            <div className="alert-error">
                                Necesitas ingresar tu correo y contraseña para iniciar sesión
                            </div>
                        )}
                        {errorLogIn && (
                            <div className="alert-error">Correo o contraseña incorrectos</div>
                        )}
                        {errorEmptyRestorePass && (
                            <div className="alert-error">Ingresa tu correo electrónico</div>
                        )}
                        {errorRestorePass && <div className={messegeClass}>{message}</div>}
                        <div className="rainbow-align-content_center rainbow-flex_wrap">
                            <Button
                                className="boton rainbow-m-around_medium"
                                type="submit"
                                onClick={login}
                            >
                                Iniciar sesión
                            </Button>
                        </div>
                        <div className="rainbow-align-content_center rainbow-flex_wrap">
                            <a href="/login" onClick={restorePass}>
                                ¿Olvidaste tu constraseña?
                            </a>
                        </div>
                    </form>
                </div>
            </StyledLoginSection>

            {/* <StyledLoginSection style={{ paddingBottom: '2.9%' }}>
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
                        {errorRegister && (
                            <div className="alert-error">Necesitas completar todos los campos</div>
                        )}
                        {errorUserAlreadyRegistered && (
                            <div className="alert-error">El correo ya tiene una cuenta activa</div>
                        )}
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
            </StyledLoginSection> */}
        </StyledLoginPage>
    );
};

export default LoginPage;
