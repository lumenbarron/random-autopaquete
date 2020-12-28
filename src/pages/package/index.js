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
                    <Row>
                        <Col></Col>
                        <Col></Col>
                    </Row>
                    <Row>
                        <Col>
                            <ContentDescription
                                img="/assets/measures.png"
                                title=""
                                description="Te recomendamos colocar la medidas más GRANDE como el largo de tu paquete
"
                            />
                            {/* <Row>
                                <Col className="spaceline">
                                    <img className="lineimg" src="/assets/greyline.png" alt="" />
                                </Col>
                                <Col>
                                    <img
                                        className="boximg"
                                        src="/assets/briefcase-money.png"
                                        alt=""
                                    />

                                    <div className="whitespace" />
                                    <h3>Pago en banco o transferencia</h3>
                                    <p>
                                        INFORMACIÓN BANCARIA AUTOPAQUETE SERVICIOS SA DE CV BBVA
                                        BANCOMER
                                        <br />
                                        CIB: 012320001136203875
                                        <br />
                                        Cuenta: 0113620387
                                        <br />
                                        La cantidad mínima para realizar un deposito es de $10,000
                                    </p>
                                </Col>
                            </Row> */}
                        </Col>
                    </Row>
                </Container>
            </div>
        </StyledPackage>
    );
}
