import React from 'react';
import { Button } from 'react-rainbow-components';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { StyledHome, StyledCard } from './styled';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <StyledHome>
            <Container
                className="rainbow-m-vertical_medium"
                style={{ marginBottom: '-4rem', marginTop: '3.5rem' }}
            >
                <Row className="content">
                    <Col>
                        <h1 className="title">
                            La plataforma que te permite una excelente logística de envíos.
                        </h1>
                        <p className="text">
                            Autopaquete es la plataforma gratuita que te permitirá gestionar tus
                            envíos al mejor precio y de una manera muy sencilla.
                        </p>
                        <Link to="/login">
                            <Button
                                className="rainbow-m-vertical_medium"
                                shaded
                                label="¡Comienza ya!"
                                variant="brand"
                            />
                        </Link>
                    </Col>

                    <Col>
                        <img
                            src="./assets/intro-img.png"
                            alt="La plataforma que te permite una excelente logística de envíos"
                        />
                    </Col>
                </Row>
            </Container>
            {/* <img src="/assets/nback.svg" style={{ width: '100%' }} />
            <div className="nback">
                <Container>
                    <Row>
                        <Col>
                            <img src="./assets/truck-2.png" alt="Nosotros" />
                        </Col>
                        <Col>
                            <div>
                                <div />
                                <div>
                                    <h1 className="title">Nosotros</h1>
                                    <p className="ntext">
                                        Somos una empresa 100% mexicana con más de 3 años de
                                        experiencia en el medio de transporte y paquetería,
                                        conocemos la importancia de un servicio personalizado y
                                        adecuado a las necesidades específicas de usted y su
                                        empresa, con nosotros encontrará diferentes opciones para
                                        sus envíos a un mejor precio.
                                    </p>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div> */}
            {/* <div
                style={{
                    background: 'linear-gradient(45deg, #bb1b1f, #7c0004)',
                }}
            >
                <img src="/assets/back-cards.svg" style={{ width: '100%' }} />
                <div
                    style={{
                        display: 'flex',
                        width: '50%',
                        margin: '-14rem auto -3rem auto',
                        flexWrap: 'wrap',
                    }}
                >
                    <StyledCard className="rainbow-flex rainbow-flex_column rainbow-align_center rainbow-justify_space-around rainbow-p-vertical_small rainbow-p-horizontal_large rainbow-m-horizontal_large">
                        <img src="/assets/icon-box.png" />
                        <h4>Mensajería Personal</h4>
                        <ul>
                            <li>Manda hasta 20 paquetes sin registrarte.</li>
                            <li>Genera tu guía en 3 sencillos pasos.</li>
                            <li>Compara precios y elige la mejor opción.</li>
                        </ul>
                    </StyledCard>
                    <StyledCard className="rainbow-flex rainbow-flex_column rainbow-align_center rainbow-justify_space-around rainbow-p-vertical_small rainbow-p-horizontal_large rainbow-m-horizontal_large">
                        <img src="/assets/icon-box.png" />
                        <h4>Mensajería Empresarial</h4>
                        <ul>
                            <li>Encuentra los mejores precios con nuestra plataforma gratuita.</li>
                            <li>
                                Organiza tu empresa de la manera más fácil monitoreando todos tus
                                paquetes en tiempo real.
                            </li>
                            <li>Opera todos tus paquetes desde un mismo lugar.</li>
                        </ul>
                    </StyledCard>
                </div>
                <img
                    src="/assets/back-cards-below.svg"
                    style={{ width: '100%', marginBottom: '-1px' }}
                />
            </div> */}
            {/* <div style={{ background: 'rgb(242,242,242)', padding: '5rem 0' }}>
                <Container>
                    <Row className="justify-content-md-center">
                        <Col xs lg="2">
                            <div style={{ textAlign: 'center' }}>
                                <img
                                    className="tmedium"
                                    src="./assets/check-table.png"
                                    alt="Guías a crédito"
                                />
                                <p className="rainbow-m-vertical_medium">Guías a crédito</p>
                            </div>
                        </Col>
                        <Col md="auto">
                            <div style={{ textAlign: 'center' }}>
                                <img
                                    className="tmedium"
                                    src="./assets/box-check.png"
                                    alt="Soluciones logísticas"
                                />
                                <p className="rainbow-m-vertical_medium">Soluciones logísticas</p>
                            </div>
                        </Col>
                        <Col xs lg="2">
                            <div style={{ textAlign: 'center' }}>
                                <img
                                    className="tmedium"
                                    src="./assets/pin-check.png"
                                    alt="Convenios corporativos"
                                />
                                <p className="rainbow-m-vertical_medium">Convenios corporativos</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            <h1 className="title timeline-header">¿Cómo funciona?</h1> */}
            {/* <div className="timeline">
                <ul>
                    <li>
                        <div className="tcontent">
                            <h3>Ahorra tiempo con nuestra plataforma fácil de usar</h3>
                            <p>
                                Autopaquete te brinda la oportunidad de crear guías, monitorear los
                                status de tus pedidos, comparar entre los servicios de envíos y
                                mucho más de una manera muy rápida y fácil de usar.
                            </p>
                        </div>
                        <div className="time">
                            <img src="./assets/clock.png" alt="clock" />
                        </div>
                    </li>
                    <li>
                        <div className="tcontent">
                            <h3>Controla el status de tus pedidos desde nuestra plataforma</h3>
                            <p>
                                En nuestra plataforma podrás revisar el status de todos tus pedidos.
                            </p>
                        </div>
                        <div className="time">
                            <img src="./assets/localizacion.png" alt="localizacion" />
                        </div>
                    </li>
                    <li>
                        <div className="tcontent">
                            <h3>Compara precios en los diferentes servicios de paqueterías</h3>
                            <p>
                                Te brindamos la opción para que compares los precios reales del
                                momento y elijas la mejor opción.
                            </p>
                        </div>
                        <div className="time pt-5">
                            <img src="./assets/airplane.png" alt="airplane" />
                        </div>
                    </li>
                    <li>
                        <div className="tcontent">
                            <h3>Añade usuarios brindando accesos personalizados.</h3>
                            <p>
                                Trabaja con más personas creando distintos usuarios que podrán
                                cumplir distintas funcionalidades dentro de la plataforma.
                            </p>
                        </div>
                        <div className="time tiny">
                            <img src="./assets/user-box.png" alt="user-box" />
                        </div>
                    </li>
                </ul>
            </div> */}
            {/* <div className="backsilder">
                <h1 className="nclients">Nuestros clientes</h1>
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
            </div> */}
        </StyledHome>
    );
};

export default HomePage;
