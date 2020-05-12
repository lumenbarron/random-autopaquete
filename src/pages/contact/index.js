import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
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
        <StyledContact className="container">
            <div>
                <h1>Contacto</h1>

                <div />

                <div className="col">
                    <h4>Horario</h4>
                    <ul>
                        <li> Lunes - Viernes</li>
                        <li>
                            <FontAwesomeIcon className="icon" icon={faClock} />9 am - 5 pm
                        </li>
                    </ul>
                </div>

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
            </div>
        </StyledContact>
    );
};

export default ContactPage;
