import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useFirebaseApp, useUser } from 'reactfire';
import { StyledLogin } from './styled';
import 'firebase/auth';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const firebase = useFirebaseApp();
    const user = useUser();

    // Crear usuario con correo y contraseña
    const submit = e => {
        e.preventDefault();
        firebase.auth().createUserWithEmailAndPassword(email, password);
    };

    useEffect(() => {
        if (user && !user.emailVerified) {
            user.sendEmailVerification();
        }
    }, [user]);

    // Iniciar sesión
    const login = async e => {
        e.preventDefault();
        await firebase.auth().signInWithEmailAndPassword(email, password);
    };

    // Cerrar sesión
    const logout = async e => {
        e.preventDefault();
        await firebase.auth().signOut();
    };

    return (
        <StyledLogin>
            <div className="flexwrap">
                <div>
                    <h1>Iniciar sesión</h1>
                    {// Cuando el usuario no esta logeado
                    !user && (
                        <Form>
                            <Form.Group controlId="formGroupEmail">
                                <Form.Label>Email o nombre de ususario</Form.Label>
                                <Form.Control
                                    type="email"
                                    controlid="email"
                                    onChange={ev => setEmail(ev.target.value)}
                                />
                            </Form.Group>
                            <Form.Group controlId="formGroupPassword">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    controlid="password"
                                    onChange={ev => setPassword(ev.target.value)}
                                />
                            </Form.Group>
                            <Button className="boton" type="submit" onClick={submit}>
                                Registrarse
                            </Button>
                            <Button className="boton" type="submit" onClick={login}>
                                Iniciar sesión
                            </Button>
                        </Form>
                    )}

                    {// Cuando el usuario esta logeado
                    user && (
                        <Form>
                            <Button className="boton" type="submit" onClick={logout}>
                                Cerrar sesión
                            </Button>
                        </Form>
                    )}
                </div>
                <div>
                    <h1>Regístrate</h1>
                    <div>
                        <form>
                            <label>
                                Nombre (s):
                                <input type="text" name="name" />
                            </label>
                            <label>
                                Apellido (s):
                                <input type="text" name="name" />
                            </label>{' '}
                            <label>
                                Correo:
                                <input type="email" name="name" />
                            </label>{' '}
                            <label>
                                Nombre de usuario:
                                <input type="text" name="name" />
                            </label>{' '}
                            <label>
                                Contraseña:
                                <input type="password" name="name" />
                            </label>
                            <Button className="boton" type="submit">
                                Unirse
                            </Button>
                            <Button className="boton" type="submit">
                                Unirse
                            </Button>
                            <p>
                                Al darle Unirse estás aceptando nuestro{' '}
                                <a href="/aviso-de-privacidad">Aviso de privacidad</a> y nuestros{' '}
                                <a href="/terminos-y-condiciones">Términos y condiciones.</a>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </StyledLogin>
    );
};

export default LoginPage;
