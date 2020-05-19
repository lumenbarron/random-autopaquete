import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { StyledLogin } from './styled';

const LoginPage = () => {
    return (
        <StyledLogin>
            <div className="flexwrap">
                <div>
                    <h1>Iniciar sesión</h1>
                    <Form>
                        <Form.Group controlId="formGroupEmail">
                            <Form.Label>Email o nombre de ususario</Form.Label>
                            <Form.Control type="email" />
                        </Form.Group>
                        <Form.Group controlId="formGroupPassword">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control type="password" />
                        </Form.Group>
                        <Button className="boton" type="submit">
                            Iniciar sesión
                        </Button>
                    </Form>
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

                            <p>Al darle Unirse estás aceptando nuestro <a href="/aviso-de-privacidad">Aviso de privacidad</a> y nuestros <a href="/terminos-y-condiciones">Términos y condiciones.</a></p>
                        </form>
                    </div>
                </div>
            </div>
        </StyledLogin>
    );
};

export default LoginPage;
