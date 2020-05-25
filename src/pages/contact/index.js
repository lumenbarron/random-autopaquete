import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { Input, Textarea } from 'react-rainbow-components';
import Button from 'react-bootstrap/Button';
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

const containerStyles = {
    maxWidth: 700,
};

const ContactPage = () => {
    return (
        <StyledContact>
            <div className="back">
                <h1>Contacto</h1>

                <div>
                    <form>
                        <div className="rainbow-align-content_center rainbow-flex_wrap">
                            <Input
                                id="name"
                                label="Nombre(s)"
                                name="name"
                                className="rainbow-p-around_medium"
                                style={{ width: '45%' }}
                            />
                            <Input
                                id="lastname"
                                label="Apellido(s)"
                                name="lastname"
                                className="rainbow-p-around_medium"
                                style={{ width: '45%' }}
                            />
                        </div>
                        <div className="rainbow-align-content_center rainbow-flex_wrap">
                            <Input
                                id="name"
                                label="Teléfono"
                                name="telefono"
                                className="rainbow-p-around_medium"
                                style={{ width: '45%' }}
                            />
                            <Input
                                id="lastname"
                                label="Correo"
                                name="correo"
                                className="rainbow-p-around_medium"
                                style={{ width: '45%' }}
                            />
                        </div>

                        <div>
                            <Textarea
                                id="example-textarea-1"
                                label="Mensaje"
                                rows={7}
                                style={containerStyles}
                                className="message"
                            />
                            ;
                        </div>
                        <div className="rainbow-align-content_center rainbow-flex_wrap">
                            <Button className="boton" type="submit">
                                Unirse
                            </Button>
                        </div>
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
