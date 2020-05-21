import React from 'react';
import { Button } from 'react-rainbow-components';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { StyledHome } from './styled';

const HomePage = () => {
    return (
        <StyledHome>
            <Container>
                <Row>
                    <Col>
                        <h1>La plataforma que te permite una excelente logística de envíos.</h1>
                        <p>
                            Autopaquete es la plataforma gratuita que te permitirá gestionar tus
                            envíos al mejor precio y de una manera muy sencilla.
                        </p>
                        <Button className="button" shaded label="¡Comienza ya!" />
                    </Col>

                    <Col>
                        <img
                            className="responsive"
                            src="./assets/intro-img.png"
                            alt="La plataforma que te permite una excelente logística de envíos"
                        />
                    </Col>
                </Row>
            </Container>
            <Container>
                <Row>
                    <Col>
                        <img src="./assets/truck-2.png" alt="Nosotros" />
                    </Col>
                    <Col>
                        <div className="flex">
                            <div />
                            <div>
                                <h1>Nosotros</h1>
                                <p>
                                    Somos una empresa 100% mexicana con más de 3 años de experiencia
                                    en el medio de transporte y paquetería, conocemos la importancia
                                    de un servicio personalizado y adecuado a las necesidades
                                    específicas de usted y su empresa, con nosotros encontrará
                                    diferentes opciones para sus envíos a un mejor precio.
                                </p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>

            <Container>
                <Row className="justify-content-md-center">
                    <Col xs lg="2">
                        <div>
                            <img src="./assets/check-table.png" alt="Guías a crédito" />
                            <p>Guías a crédito</p>
                        </div>
                    </Col>
                    <Col md="auto">
                        <div>
                            <img src="./assets/box-check.png" alt="Soluciones logísticas" />
                            <p>Soluciones logísticas</p>
                        </div>
                    </Col>
                    <Col xs lg="2">
                        <div>
                            <img src="./assets/pin-check.png" alt="Convenios corporativos" />
                            <p>Convenios corporativos</p>
                        </div>
                    </Col>
                </Row>
            </Container>
            <div>
                <h1>Nuestros clientes</h1>
                <div className="wrapper">
                    <div className="slider">
                        <div className="slide">
                            <img src="./assets/logo-rappi.png" alt="" />
                            <img src="./assets/logo-sello-rojo.png" alt="" />
                            <img src="./assets/logo-cloe.png" alt="" />
                            <img src="./assets/logo-chai.png" alt="" />
                            <img src="./assets/logo-artmosfera.png" alt="" />
                            <img src="./assets/logo-linguatectv.png" alt="" />
                            <img src="./assets/logo-peter-piper.png" alt="" />
                            <img src="./assets/logo-dentimex.png" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </StyledHome>
    );
};

export default HomePage;
