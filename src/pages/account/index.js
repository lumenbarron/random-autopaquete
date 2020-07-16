import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useFirebaseApp, useUser } from 'reactfire';
import formatMoney from 'accounting-js/lib/formatMoney';
import { StyledAccount } from './styled';

const AccountPage = () => {
    const user = useUser();
    const firebase = useFirebaseApp();
    const db = firebase.firestore();

    const [creditAmount, setCreditAmount] = useState();

    useEffect(() => {
        if (user) {
            const docRef = db.collection('profiles').where('ID', '==', user.uid);

            const cancelSnapshot = docRef.onSnapshot(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    setCreditAmount(doc.data().saldo);
                });
            });

            return cancelSnapshot;
        }
        return null;
    }, [creditAmount]);

    return (
        <StyledAccount>
            <div className="back">
                <div>
                    <h1>Créditos</h1>
                    <h2>Saldo Actual</h2>
                    <h2>{formatMoney(creditAmount, 2)}</h2>
                </div>
                <Container className="imgtext">
                    <Row>
                        <Col>
                            <Row>
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
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <Col className="spaceline">
                                    <img className="lineimg" src="/assets/greyline.png" alt="" />
                                </Col>
                                <Col>
                                    <img
                                        className="boximg"
                                        src="/assets/contact-email.png"
                                        alt=""
                                    />

                                    <div className="whitespace" />
                                    <h3>En caso de requerir factura solicitarlo en el correo</h3>
                                    <a href="mailto:atencion1@autopaquete.com">
                                        atencion1@autopaquete.com
                                    </a>
                                </Col>
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <Col className="spaceline">
                                    <img className="lineimg" src="/assets/greyline.png" alt="" />
                                </Col>
                                <Col>
                                    <img
                                        className="boximg"
                                        src="/assets/laptop-computer.png"
                                        alt=""
                                    />

                                    <div className="whitespace" />
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
