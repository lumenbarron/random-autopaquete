import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';
import { Input } from 'react-rainbow-components';
import { useFirebaseApp, useUser } from 'reactfire';
import { StyledLoginPage, StyledLoginSection } from './styled';
import redirectIfLoggedOut from '../../helpers/redirectIfLoggedOut';
import 'firebase/auth';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [name, setName] = useState('');
    const [lastname, setLastName] = useState('');
    const firebase = useFirebaseApp();
    const history = useHistory();
    const user = useUser();



    useEffect(() => {
        redirectIfLoggedOut(user);
    }, [user]);  
/*
    useEffect(() => {
        if (user !== null) {
            history.push('/mi-cuenta');
        }
    }, [user]);
*/

    // Crear usuario con correo y contraseña
    const register = e => {
        e.preventDefault();
        if(newEmail.trim() === '' || newPassword.trim() === '' || name.trim() === '' || lastname.trim() === ''  ){
            console.log("Espacios vacios");
            return;
        }
        firebase
            .auth()
            .createUserWithEmailAndPassword(newEmail, newPassword)
            .then(({ user }) => {
                user.sendEmailVerification();
                 history.push('/mi-cuenta');
            });
    };

    // Iniciar sesión
    const login = async e => {
        e.preventDefault();
        if(email.trim() === '' || password.trim() === ''){
            console.log("Espacios vacios");
            return;
        }
        await firebase.auth().signInWithEmailAndPassword(email, password);
        history.push('/mi-cuenta');



    };

    const restorePass = async e => {
        e.preventDefault();
        if(email.trim() === ''){
            console.log("Espacios vacios");
            return;
        }
        firebase
        .auth()
        .sendPasswordResetEmail(email);
    };



    
    return (
        <StyledLoginPage>
            <StyledLoginSection>
                <h1>Iniciar sesión</h1>
                    <Form>
                        <Form.Group controlId="formGroupEmail">
                            <Form.Label>Email o nombre de ususario</Form.Label>
                            <Form.Control
                                type="email"
                                controlid="email"
                                onChange={ev => setEmail(ev.target.value)}
                                className="ini-form"
                            />
                        </Form.Group>
                        <Form.Group controlId="formGroupPassword">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                controlid="password"
                                onChange={ev => setPassword(ev.target.value)}
                                className="ini-form"
                            />
                        </Form.Group>
                        <Button className="boton" type="submit" onClick={login}>
                            Iniciar sesión
                        </Button>
                        <a onClick={restorePass}>¿Olvidaste tu constraseña?</a>
                    </Form>
                
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
                            />
                            <Input
                                id="lastname"
                                label="Apellido(s)"
                                name="lastname"
                                className="rainbow-p-around_medium"
                                onChange={ev => setLastName(ev.target.value)}
                                style={{ width: '45%' }}
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
                            />
                        </div>
                        <div className="rainbow-align-content_center rainbow-flex_wrap">
                            <p style={{ fontSize: '0.9rem' }}>
                                Al darle Unirse estás aceptando nuestro
                                <a href="/aviso-de-privacidad" >Aviso de privacidad</a> y nuestros{' '}
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
