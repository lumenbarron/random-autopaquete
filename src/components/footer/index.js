import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faClock,
    faEnvelope,
    faPhoneAlt,
    faLocationArrow,
    faComment,
} from '@fortawesome/free-solid-svg-icons';
import { StyledFooter } from './styled';

const Footer = () => {
    return (
        <StyledFooter>
            <div className="main-footer">
                <div className="container">
                    <div className="row">
                        {/* Column 1 */}
                        <div className="col">
                            <img src="assets/truck-white.png" alt="LogoFooter" />
                        </div>
                        {/* Column 2 */}
                        <div className="col">
                            <h4>Horario</h4>
                            <ul>
                                <li>Lunes - Viernes</li>
                                <li>
                                    <FontAwesomeIcon icon={faClock} />9 am - 5 pm
                                </li>
                            </ul>
                        </div>
                        {/* Column 3 */}
                        <div className="col col3">
                            <h4>Contacto</h4>
                            <ul>
                                <li>
                                    <FontAwesomeIcon icon={faEnvelope} />
                                    atencion1@autopaquete.com
                                </li>
                                <li>
                                    <FontAwesomeIcon icon={faPhoneAlt} />
                                    01 (33) 1542 1033
                                </li>
                                <li>
                                    <FontAwesomeIcon icon={faComment} />
                                    WhatsApp: +52 (33) 2297 7746
                                </li>
                                <li>
                                    <FontAwesomeIcon icon={faLocationArrow} />
                                    Guadalajara, Jalisco.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footertwo">
                <p>
                    <a href="/terminos-y-condiciones">Términos y Condiciones</a> |{' '}
                    <a href="/aviso-de-privacidad">Aviso de Privacidad</a> Hecho por
                    <a href="https://sitiorandom.com"> Sitio Random</a>
                </p>
            </div>
        </StyledFooter>
    );
};

export default Footer;
