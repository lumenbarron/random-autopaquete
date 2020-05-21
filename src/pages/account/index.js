import React from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { StyledAccount } from './styled';

const AccountPage = () => {
    return (
        <StyledAccount>
            <div className="back">
                <div>
                    <h1>Créditos</h1>
                    <h2>Saldo Actual</h2>
                    <h2>$10,000</h2>
                </div>
                <Container>
                    <Row>
                        <Col>
                            <Row>
                                <Col>
                                    <img src="/assets/greyline.png" alt="" />
                                </Col>
                                <Col>
                                    <img src="/assets/briefcase-money.png" alt="" />

                                    <h3>Pago en banco o transferencia</h3>
                                    <p>
                                        INFORMACIÓN BANCARIA AUTOPAQUETE SERVICIOS SA DE CV BBVA
                                        BANCOMER CIB: 012320001136203875 Cuenta: 0113620387
                                    </p>
                                </Col>
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <Col>
                                    <img src="/assets/greyline.png" alt="" />
                                </Col>
                                <Col>
                                    <img src="/assets/contact-email.png" alt="" />

                                    <h3>En caso de requerir factura solicitarlo en el correo</h3>
                                    <a href="mailto:atencion1@autopaquete.com">
                                        atencion1@autopaquete.com
                                    </a>
                                </Col>
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <Col>
                                    <img src="/assets/greyline.png" alt="" />
                                </Col>
                                <Col>
                                    <img src="/assets/laptop-computer.png" alt="" />

                                    <h3>
                                        El equipo de autopaquete se encargará de que tus créditos se
                                        vean reflejados en la plataforma
                                    </h3>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>
        </StyledAccount>
    );
};

export default AccountPage;
