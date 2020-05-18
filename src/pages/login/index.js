import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { StyledLogin } from './styled';

const LoginPage = () => {
    return (
        <StyledLogin>
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
        </StyledLogin>
    );
};

export default LoginPage;
