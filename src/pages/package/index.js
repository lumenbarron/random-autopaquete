import React from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ContentDescription from './content';
import { StyledPackage } from './style';

export default function PackagePage() {
    return (
        <StyledPackage>
            <div className="back">
                <div>
                    <h1>Recomendaciones generales sobre medidas y paquetes</h1>
                </div>
                <Container className="imgtext">
                    <Row className="pb-4">
                        <Col lg={6}>
                            <Row>
                                <Col className="spaceline">
                                    <img className="lineimg" src="/assets/greyline.png" alt="" />
                                </Col>
                                <Col>
                                    <p className="description mb-5">
                                        Te recomendamos colocar la medidas más <b>GRANDE</b> como el
                                        largo de tu paquete
                                    </p>
                                    <img className="" src="/assets/measures.png" alt="package" />
                                    <div className="whitespace" />
                                </Col>
                            </Row>
                        </Col>
                        <Col lg={6}>
                            <Row>
                                <Col className="spaceline">
                                    <img className="lineimg" src="/assets/greyline.png" alt="" />
                                </Col>
                                <Col>
                                    <p className="description">
                                        Para determinar el peso, se tomará lo que resulte{' '}
                                        <b>mayor entre el peso físico y peso volumétrico.</b> La
                                        fórmula del volumétrico es la siguiente:
                                    </p>
                                    <img className="" src="/assets/volumetric.png" alt="package" />
                                    <div className="whitespace" />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12} className="mb-4">
                            <h3>Sólo aplica para FEDEX</h3>
                            <h4>Empaque</h4>
                            <p className="subtitle">
                                {' '}
                                La mercancía que esta empacada de la siguiente manera tendrá un
                                cargo extra de <b className="price"> $110 </b>por envío.
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={6}>
                            <ContentDescription
                                img="/assets/empaque-1.png"
                                icon="/assets/icon-1.svg"
                                description="La mercancía sobresalga del empaque principal."
                            />
                        </Col>
                        <Col lg={6}>
                            <ContentDescription
                                img="/assets/empaque-2.png"
                                icon="/assets/icon-2.svg"
                                description="El empaque principal sea metal, madera, lona, cuero, unicel
                                (p. ej., hieleras), plástico, playo, costal, espuma de poliestireno."
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={6}>
                            <ContentDescription
                                img="/assets/empaque-3.png"
                                icon="/assets/icon-3.svg"
                                description="Se encuentre en una caja cubierto con playo o plástico sin
                                ajustar a la misma."
                            />
                        </Col>
                        <Col lg={6}>
                            <ContentDescription
                                img="/assets/empaque-4.png"
                                icon="/assets/icon-4.svg"
                                description="Tenga forma cilíndrica, incluyendo, entre otros, tubos, latas,
                                cubetas, barriles, llantas."
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={6}>
                            <ContentDescription
                                img="/assets/empaque-5.png"
                                icon="/assets/icon-5.svg"
                                description="Tenga más de dos paquetes unidos (con dimensiones iguales o diferentes)."
                            />
                        </Col>
                        <Col lg={6}>
                            <ContentDescription
                                img="/assets/empaque-6.png"
                                icon="/assets/icon-6.svg"
                                description="Esté atado con soga, cuerda, cinta masking, cinta de papel,
                                fleje de metal."
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={6}>
                            <ContentDescription
                                img="/assets/empaque-7.png"
                                icon="/assets/icon-7.svg"
                                description="Contenga ruedas, manijas o correas (maletas)."
                            />
                        </Col>
                        <Col lg={6}>
                            <ContentDescription
                                img="/assets/empaque-8.png"
                                icon="/assets/icon-8.svg"
                                description="Las cajas estén dañadas, aplastadas, rotas o mojadas."
                            />
                        </Col>
                    </Row>
                </Container>
            </div>
        </StyledPackage>
    );
}
