import React from 'react';
import { StyledQuote } from './styled';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const QuotePage = () => {
    return (
        <StyledQuote>
            <div>
                <h1 className="title">Solicitud de cotización</h1>
            </div>
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
                                <input type="hidden" name="_method" value="POST" />
                            </div>
                            <div>
                                <label htmlFor="ClientFirstName">Nombre(s)</label>
                                <input
                                    name="data[Client][first_name]"
                                    type="text"
                                    id="ClientFirstName"
                                />
                            </div>
                            <div>
                                <label htmlFor="ClientCompanyName">Empresa</label>
                                <input
                                    name="data[Client][company_name]"
                                    type="text"
                                    id="ClientCompanyName"
                                />
                            </div>

                            <div>
                                <label htmlFor="ClientPhone">Teléfono</label>
                                <input name="data[Client][phone]" type="tel" id="ClientPhone" />
                            </div>

                            <div>
                                <label htmlFor="ClientEmail">Email</label>
                                <input name="data[Client][email]" type="email" id="ClientEmail" />
                            </div>

                            <div>
                                <label htmlFor="ClientRealizasMasDe20EnviosAlMes">
                                    ¿Realizas más de 20 envíos al mes?
                                </label>
                                <input
                                    name="data[Client][realizas_mas_de_20_envios_al_mes]"
                                    type="text"
                                    id="ClientRealizasMasDe20EnviosAlMes"
                                />
                            </div>

                            <div>
                                <input className="boton" type="submit" value="Enviar" />
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
        </StyledQuote>
    );
};

export default QuotePage;
