import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { StyledPackage } from './style';

export default function ContentDescription(props) {
    return (
        <Row>
            <Col className="spaceline">
                <img className="lineimg" src="/assets/greyline.png" alt="" />
            </Col>
            <Col>
                <h3>{props.title}</h3>
                <p className="description">{props.description}</p>
                <img className="" src={props.img} alt="" />

                <div className="whitespace" />
            </Col>
        </Row>
    );
}
