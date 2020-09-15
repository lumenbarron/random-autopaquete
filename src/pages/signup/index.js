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

const SignUpPage = () => {
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [name, setName] = useState('');
    const [lastname, setLastName] = useState('');

    const [errorUserAlreadyRegistered, setErrorUserAlreadyRegistered] = useState(false);
    const [errorRegister, setErrorRegister] = useState(false);

    const firebase = useFirebaseApp();
    const history = useHistory();
    const user = useUser();
    const db = firebase.firestore();

    const [message, setMessage] = useState(false);
    const [messegeClass, setMessegeClass] = useState(false);

    //Crear usuario con correo y contraseña
    const register = e => {
        e.preventDefault();
        if (
            newEmail.trim() === '' ||
            newPassword.trim() === '' ||
            name.trim() === '' ||
            lastname.trim() === ''
        ) {
            setErrorRegister(true);
            return;
        }
        firebase
            .auth()
            .createUserWithEmailAndPassword(newEmail, newPassword)
            .then(({ user }) => {
                user.sendEmailVerification();
                const profilesCollectionAdd = db.collection('profiles').add({
                    name,
                    lastname,
                    user_type: 'regular',
                    ID: user.uid,
                    status: 'En Revisión',
                    saldo: 0,
                });
                profilesCollectionAdd
                    .then(function(docRef) {
                        history.push('/documentacion');
                    })
                    .catch(function(error) {
                        console.error('Error adding document: ', error);
                    });
                setErrorUserAlreadyRegistered(false);
            })
            .catch(function() {
                setErrorRegister(false);
                setErrorUserAlreadyRegistered(true);
            });
    };

    //useBlockSecurity();

    return (
        <StyledLoginPage>
            <StyledLoginSection style={{ paddingBottom: '2.9%' }}>
                <h1>Regístrate 1</h1>
                <div>
                    <form>
                        <div className="rainbow-align-content_center rainbow-flex_wrap">
                            <Input
                                value={name}
                                id="name"
                                label="Nombre(s)"
                                name="name"
                                className="rainbow-p-around_medium"
                                onChange={ev => setName(ev.target.value)}
                                style={{ width: '45%' }}
                                icon={<FontAwesomeIcon icon={faUser} />}
                            />
                            <Input
                                value={lastname}
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
                        </div>
                    </form>
                    <Button
                        className="boton rainbow-m-around_medium"
                        type="submit"
                        onClick={register}
                    >
                        Unirse
                    </Button>
                </div>
            </StyledLoginSection>
        </StyledLoginPage>
    );
};

export default SignUpPage;
