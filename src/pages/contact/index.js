import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faClock,
    faEnvelope,
    faPhoneAlt,
    faLocationArrow,
    faComment,
} from '@fortawesome/free-solid-svg-icons';
import { StyledContact } from './styled';

const ContactPage = () => {
    return (
        <StyledContact>
            <div className="back">
                <h1>Contacto</h1>
                <div />
                <div>
                    <form>
                        <label>
                            Nombre (s):
                            <input type="text" name="name" />
                        </label>
                        <label>
                            Apellido (s):
                            <input type="password" name="name" />
                        </label>{' '}
                        <label>
                            Teléfono:
                            <input type="text" name="name" />
                        </label>{' '}
                        <label>
                            Correo:
                            <input type="text" name="name" />
                        </label>{' '}
                        <label>
                            Mensaje:
                            <input type="text" name="name" />
                        </label>
                        <input type="submit" value=" Envar" />
                    </form>
                </div>
                <Container>
                    <Row xs={2} md={4} lg={6}>
                        <Col>
                            <div className="col">
                                <h4>Horario</h4>
                                <ul>
                                    <li> Lunes - Viernes</li>
                                    <li>
                                        <FontAwesomeIcon className="icon" icon={faClock} />9 am - 5
                                        pm
                                    </li>
                                </ul>
                            </div>
                        </Col>
                        <Col>
                            <div className="col col2">
                                <h4>Contacto</h4>
                                <ul>
                                    <li>
                                        <FontAwesomeIcon className="icon" icon={faEnvelope} />
                                        atencion1@autopaquete.com
                                    </li>
                                    <li>
                                        <FontAwesomeIcon className="icon" icon={faPhoneAlt} />
                                        01 (33) 1542 1033
                                    </li>
                                    <li>
                                        <FontAwesomeIcon className="icon" icon={faComment} />
                                        WhatsApp: +52 (33) 2297 7746
                                    </li>
                                    <li>
                                        <FontAwesomeIcon className="icon" icon={faLocationArrow} />
                                        Guadalajara, Jalisco.
                                    </li>
                                </ul>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </StyledContact>
    );
};

export default ContactPage;
