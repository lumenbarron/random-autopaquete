import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { Input, Textarea } from 'react-rainbow-components';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import { useUser, useFirebaseApp } from 'reactfire';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
    faClock,
    faEnvelope,
    faPhoneAlt,
    faLocationArrow,
    faComment,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import { StyledContact } from './styled';

const inputStyles = {
    width: 400,
};

const containerStyles = {
    maxWidth: 1200,
};

const ContactPage = () => {
    const firebase = useFirebaseApp();
    const db = firebase.firestore();

    const [name, setName] = useState();
    const [lastName, setLastName] = useState();
    const [phone, setPhone] = useState();
    const [message, setMessage] = useState();
    const [sent, setSent] = useState(false);
    const [sending, setSending] = useState(true);

    const [host, setHost] = useState();
    const [receiverEmail, setReceiverEmail] = useState();
    const [pass, setPass] = useState();

    const user = useUser();
    const userEmail = user.providerData[0].email;
    useEffect(() => {
        db.collection('email_configuration')
            .where('email', '==', 'contacto@autopaquete.com.mx')
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    setHost(doc.data().host);
                    setReceiverEmail(doc.data().email);
                    setPass(doc.data().password);
                });
            })
            .catch(function(error) {
                console.log('Error getting documents: ', error);
            });
    }, []);

    function sendEmail() {
        setSending(true);
        user.getIdToken().then(idToken => {
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'json';
            xhr.contentType = 'application/json';
            xhr.onload = () => {
                setSent(true);
                setSending(false);
            };
            xhr.open('POST', '/contacto/send');
            xhr.setRequestHeader('Authorization', `Bearer ${idToken}`);
            xhr.send(JSON.stringify({ name, lastName, phone, message, host, receiverEmail, pass }));
        });
    }

    return (
        <StyledContact>
            <div className="back rainbow-align-content_left">
                <h1 className="title">Contacto</h1>
                <div>
                    <div className="rainbow-align-content_center rainbow-p-vertical_x-large rainbow-flex_wrap contact-form">
                        <Input
                            className="rainbow-p-around_medium"
                            style={inputStyles}
                            label="Nombre (s)"
                            icon={
                                <FontAwesomeIcon icon={faUser} className="rainbow-color_gray-3" />
                            }
                            onChange={ev => setName(ev.target.value)}
                        />
                        <Input
                            className="rainbow-p-around_medium"
                            style={inputStyles}
                            label="Apellido (s)"
                            icon={<FontAwesomeIcon icon={faUser} />}
                            onChange={ev => setLastName(ev.target.value)}
                        />
                    </div>
                    <div className="rainbow-align-content_center rainbow-p-vertical_x-large rainbow-flex_wrap contact-form">
                        <Input
                            className="rainbow-p-around_medium"
                            style={inputStyles}
                            label="Teléfono"
                            icon={
                                <FontAwesomeIcon
                                    icon={faPhoneAlt}
                                    className="rainbow-color_gray-3"
                                />
                            }
                            onChange={ev => setPhone(ev.target.value)}
                        />
                        <Input
                            className="rainbow-p-around_medium"
                            style={inputStyles}
                            label="Correo"
                            value={userEmail}
                            icon={
                                <FontAwesomeIcon
                                    icon={faEnvelope}
                                    className="rainbow-color_gray-3"
                                />
                            }
                        />
                    </div>
                    <div>
                        <Textarea
                            id="example-textarea-1"
                            label="Mensaje"
                            rows={4}
                            style={containerStyles}
                            className="rainbow-m-vertical_x-large rainbow-p-horizontal_medium rainbow-m_auto contact-form"
                            onChange={ev => setMessage(ev.target.value)}
                        />
                    </div>
                    <Button className="boton" type="submit" onClick={sendEmail} disabled={!sending}>
                        Enviar
                    </Button>
                    {sent && <p>Mensaje enviado, ¡Gracias!</p>}
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
                                        soporte.logistica1@autopaquete.com
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
