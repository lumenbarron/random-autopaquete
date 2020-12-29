import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { StyledPackage } from './style';

export default function ContentDescription(props) {
    return (
        <Row>
            <Col className="spaceline p-0">
                <img className="lineimg" src="/assets/greyline.png" alt="" />
            </Col>
            <Col className="container-package">
                <img className="mb-3" src={props.img} alt="" />
                <div className="d-flex">
                    <img className="mr-1" src={props.icon} alt="icon-number" />
                    <p className="description">{props.description}</p>
                </div>
                <div className="whitespace" />
            </Col>
        </Row>
    );
}
