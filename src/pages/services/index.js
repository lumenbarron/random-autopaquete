import React from 'react';
import ReactPlayer from 'react-player';
import { StyledServices } from './styled';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
const ServicesPage = () => {
    return (
        <StyledServices>
            <div>
                <ReactPlayer className="videotwo" url="./assets/videos/video.mp4" playing />
                <div className="white-spacetwo" />
                <h1> Nuestros servicios</h1>
                <div className="white-spacetwo" />
                <h2>Paqueterías para empresas + de 20 envíos</h2>
                <div className="white-spacetwo" />
                <Container>
                    <Row>
                        <Col>
                            <div>
                                <img src="./assets/box-check.png" alt="Plataforma fácil de usar" />
                                <div className="white-spacetwo" />
                                <p>Plataforma fácil de usar</p>
                            </div>
                        </Col>
                        <Col>
                            <div>
                                <img src="./assets/world.png" alt="Tus envíos a mejor precio" />
                                <div className="white-spacetwo" />
                                <p>Tus envíos a mejor precio</p>
                            </div>
                        </Col>
                        <Col>
                            {' '}
                            <div>
                                <img
                                    src="/assets/warehouse.png"
                                    alt="Organiza y controla tus envíos fácilmente"
                                />
                                <div className="white-spacetwo" />
                                <p>Organiza y controla tus envíos fácilmente</p>
                            </div>
                        </Col>
                        <Col>
                            {' '}
                            <div>
                                <img src="/assets/truck.png" alt="Recolección sin costo" />
                                <div className="white-spacetwo" />
                                <p>Recolección sin costo</p>
                            </div>
                        </Col>
                    </Row>
                    <div className="white-spacetwo" />
                    <h2>Paqueterías para - de 20 envíos</h2>
                    <div className="white-spacetwo" />

                    <Row>
                        <Col>
                            <div>
                                <img
                                    src="./assets/box-swap.png"
                                    alt="Compara y elije la mejor opción de envío"
                                />
                                <div className="white-spacetwo" />
                                <p>Compara y elijela mejor opción de envío</p>
                            </div>
                        </Col>

                        <Col>
                            {' '}
                            <div>
                                <img
                                    src="./assets/box-safe.png"
                                    alt="Genera tu guía fácil y rápido"
                                />
                                <div className="white-spacetwo" />
                                <p>Genera tu guía fácil y rápido</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
                <div className="white-space" />
            </div>
            <div className="white-space" />
        </StyledServices>
    );
};

export default ServicesPage;
