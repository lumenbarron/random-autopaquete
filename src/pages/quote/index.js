import React from 'react';
import { StyledQuote } from './styled';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Input, Select } from 'react-rainbow-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPhoneAlt,
    faUser,
    faEnvelope,
    faBoxOpen,
    faBuilding,
} from '@fortawesome/free-solid-svg-icons';

const containerStyles = {
    maxWidth: 700,
};

const QuotePage = () => {
    const options = [
        { value: 'Hago envíos ocasionalmente', label: 'Hago envíos ocasionalmente' },
        { value: 'Hago de 20 a 100 envíos al mes', label: 'Hago de 20 a 100 envíos al mes' },
        { value: 'Hago de 100 a 200 envíos al mes', label: 'Hago de 100 a 200 envíos al mes' },
        { value: 'Hago más de 200 envíos al mes', label: 'Hago más de 200 envíos al mes' },
    ];
    return (
        <StyledQuote>
            <div>
                <h1 className="title">Solicitud de cotización</h1>
            </div>
            <Container>
                <Row>
                    <Col>
                        <div>
                            <Container>
                                <Row>
                                    <Col>
                                        <div>
                                            <div>
                                                <form
                                                    className="formulario"
                                                    action="https://incrementacrm.com/api/widget/web-form/c38333ae647c560bc985f8bcb1ecc96bea72c0fc"
                                                    method="post"
                                                    id="ClientWebFormForm"
                                                    acceptCharset="utf-8"
                                                >
                                                    <div>
                                                        <input
                                                            type="hidden"
                                                            name="_method"
                                                            value="POST"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="ClientFirstName">
                                                            Nombre(s)
                                                        </label>

                                                        <Input
                                                            icon={<FontAwesomeIcon icon={faUser} />}
                                                            name="data[Client][first_name]"
                                                            type="text"
                                                            id="ClientFirstName"
                                                            iconPosition="right"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor="ClientCompanyName">
                                                            Empresa
                                                        </label>
                                                        <Input
                                                            name="data[Client][company_name]"
                                                            type="text"
                                                            id="ClientCompanyName"
                                                            iconPosition="right"
                                                            icon={
                                                                <FontAwesomeIcon
                                                                    icon={faBuilding}
                                                                />
                                                            }
                                                        />
                                                    </div>

                                                    <div>
                                                        <label htmlFor="ClientPhone">
                                                            Teléfono
                                                        </label>
                                                        <Input
                                                            name="data[Client][phone]"
                                                            type="tel"
                                                            id="ClientPhone"
                                                            iconPosition="right"
                                                            icon={
                                                                <FontAwesomeIcon
                                                                    icon={faPhoneAlt}
                                                                />
                                                            }
                                                        />
                                                    </div>

                                                    <div>
                                                        <label htmlFor="ClientEmail">Email</label>
                                                        <Input
                                                            name="data[Client][email]"
                                                            type="email"
                                                            id="ClientEmail"
                                                            iconPosition="right"
                                                            icon={
                                                                <FontAwesomeIcon
                                                                    icon={faEnvelope}
                                                                />
                                                            }
                                                        />
                                                    </div>

                                                    <div>
                                                        <label for="ClientVolumenDeEnviosAlMes">
                                                            Volumen de Envíos al Mes
                                                        </label>
                                                        <select
                                                            className="volumen-envios"
                                                            name="data[Client][volumen_de_envios_al_mes]"
                                                            placeholder="Volumen de Envíos al Mes"
                                                            id="ClientVolumenDeEnviosAlMes"
                                                            label="Select Label"
                                                            style={{ width: 'auto' }}
                                                        >
                                                            <option value="Hago Envíos Ocasionalmente">
                                                                Hago Envíos Ocasionalmente
                                                            </option>
                                                            <option value="Hago de 20 a 100 Envíos al Mes">
                                                                Hago de 20 a 100 Envíos al Mes
                                                            </option>
                                                            <option value="Hago de 100 a 200 Envíos al Mes">
                                                                Hago de 100 a 200 Envíos al Mes
                                                            </option>
                                                            <option value="Hago Más de 200 Envíos al Mes">
                                                                Hago Más de 200 Envíos al Mes
                                                            </option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <input
                                                            className="boton"
                                                            type="submit"
                                                            value="Enviar"
                                                        />
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col>
                                        <div>
                                            <img src="./assets/quote.png" alt="Cotización.png" />
                                        </div>
                                    </Col>
                                </Row>
                            </Container>
                            <div className="white-space" />
                        </div>
                    </Col>
                </Row>
            </Container>
            <div className="white-space" />
        </StyledQuote>
    );
};

export default QuotePage;
