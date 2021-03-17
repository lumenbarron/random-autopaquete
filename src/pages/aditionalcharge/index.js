import React from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ContentCharge from './contentcharge';
import ContentCharge2 from './contentcharge2';
import ContentCharge3 from './contentcharge3';
import { StyledPackage } from './style';

export default function ChargePage() {
    return (
        <StyledPackage>
            <div className="back">
                <Container>
                    <div className="pb-4">
                        <h1>Recargos Adicionales</h1>
                        <p className="main-subtitle">
                            Para Autopaquete es un gusto poder servirle con nuestros servicios, sin
                            embargo, hay recargos adicionales a su envío que continuación se los
                            desglozamos para que los tenga en cuenta:
                        </p>
                    </div>
                    <ContentCharge3
                        title="Zona Extendida"
                        description="Empaque que sus destinos sean de difícil acceso o complejidad o que el tiempo de tránsito sea mayor a 5 días hábiles."
                        rate1="$150.00"
                        rate2="$110.00"
                        rate3="$130.00"
                    />
                    <ContentCharge2
                        title="Dimensión"
                        description="Empaque que excedan el máximo de medidas en su lado más largo
                            (para Fedex 120cm y Redpack 100cm) :"
                        rate1="$280.00"
                        rate2="$110.00"
                        rate3="$210.00"
                    />
                    <ContentCharge
                        title="Peso"
                        description="Empaque que excedan el máximo de peso (para Fedex 30 kg y Redpack Express 50 kg) :"
                        rate1="$110.00"
                        rate2="$210.00"
                    />
                    <Row className="mb-4">
                        <Col className="spaceline p-0">
                            <img className="lineimg" src="/assets/greyline.png" alt="" />
                        </Col>
                        <Col className="ml-3">
                            <Row className="mb-3">
                                <h4>Devoluciones</h4>
                                <p className="subtitle mb-2">
                                    Empaquetes que no se puede entregar por razones agenas a las
                                    paquterías y es devuelto a su origen.
                                </p>
                                <p className="supplier">Mismo costo del envío.</p>
                            </Row>
                            {/* <Row className="container-package">
                                <div className="container-description2 mb-2">
                                    <p className="supplier">Fedex</p>
                                    <p className="price">Mismo costo del envío.</p>
                                </div>
                                <div className="container-description">
                                    <p className="supplier">Redpack</p>
                                    <p className="price">$90.00</p>
                                </div>
                            </Row> */}
                        </Col>
                    </Row>
                    <ContentCharge3
                        title="Corrección de domicilio/destino "
                        description="Si la dirección del destinatario está incompleta o es incorrecta y si el teléfono no es válido se aplicará un cargo por los cambios antes de que sea entregado."
                        rate1="$70.00 "
                        rate2="$60.00 "
                        rate3="$90.00"
                    />
                    {/* <ContentCharge
                        title="Corrección de domicilio/destino "
                        description="Si la dirección del destinatario está incompleta o es incorrecta y si el teléfono no es válido se aplicará un cargo por los cambios antes de que sea entregado."
                        rate1="$70.00 "
                        rate2="$85.00"
                    /> */}
                    <Row className="mb-4">
                        <Col className="spaceline p-0">
                            <img className="lineimg2" src="/assets/greyline.png" alt="" />
                        </Col>
                        <Col className="ml-3">
                            <Row className="mb-3">
                                <h4>Seguro Opcional</h4>
                                <p className="subtitle">
                                    El seguro cubre el valor declarado del contenido previo pago del
                                    deducible (por encima de la responsabilidad estándar). Cubriendo
                                    la cantidad necesaria para reparar o reemplazar un envío en caso
                                    de pérdida a daño. Ofrecemos asegurar su empaque bajo las
                                    siguientes condiciones:
                                </p>
                            </Row>
                            <Row className="">
                                <ul>
                                    <li className="supplier">
                                        • Protección de su envío con tan sólo el 2% del valor
                                        declarado 20% de deducible.
                                    </li>
                                    <li className="supplier">• 20% de deducible.</li>
                                    <li className="supplier">
                                        • Cobertura hasta por $ 60,000.00 por guía.
                                    </li>
                                    <li className="supplier">• Póliza de Seguro por $ 40.00</li>
                                </ul>
                            </Row>
                        </Col>
                    </Row>
                    <Row className="mb-4">
                        <Col className="spaceline p-0">
                            <img className="lineimg" src="/assets/greyline.png" alt="" />
                        </Col>
                        <Col className="ml-3">
                            <Row className="mb-3">
                                <h4>
                                    Recolección Sabatina o días festivos
                                    <p className="supplier">(Sólo aplica para FEDEX)</p>
                                </h4>
                                <p className="subtitle">
                                    Si requieres que el empaque sea recolectado en sábado y tu
                                    Código Postal tiene cobertura, esté tendrá un cargo extra de{' '}
                                    <b className="supplier">$220</b> por envío.
                                </p>
                            </Row>
                        </Col>
                    </Row>
                    <Row className="mb-4">
                        <Col className="spaceline p-0">
                            <img className="lineimg" src="/assets/greyline.png" alt="" />
                        </Col>
                        <Col className="ml-3">
                            <Row className="mb-3">
                                <h4>
                                    Visita adicional de entrega
                                    <p className="supplier">(Sólo aplica para REDPACK)</p>
                                </h4>
                                <p className="subtitle">
                                    Si REDPACK efectúa más de dos intentos de entrega en servicios
                                    nacionales tendrá un cargo extra de
                                    <b className="supplier">$45</b> por empaque.
                                </p>
                            </Row>
                        </Col>
                    </Row>
                    <Row className="mb-4">
                        <Col className="spaceline p-0">
                            <img className="lineimg" src="/assets/greyline.png" alt="" />
                        </Col>
                        <Col className="ml-3">
                            <Row className="mb-3">
                                <h4>
                                    Manejo especial
                                    <p className="supplier">(Sólo aplica para ESTAFETA)</p>
                                </h4>
                                <p className="subtitle">
                                    Si ESTAFETA requiere de algún manejo especial por tipo de
                                    empaque, volumen o fragilidad tendrá un cargo extra de
                                    <b className="supplier">$60</b> por empaque.
                                </p>
                            </Row>
                        </Col>
                    </Row>
                    <Row className="mb-4">
                        <p className="">
                            Precios expresados en Moneda Nacional. No incluye IVA. Sujeto a cambios
                            sin previo aviso.Precios vigentes a partir de 1 Enero del 2021.
                        </p>
                    </Row>
                </Container>
            </div>
        </StyledPackage>
    );
}
