import React from 'react';
import Nav from 'react-bootstrap/Nav';

const DirectionPage = () => {
    return (
        <div>
            <Nav variant="tabs" defaultActiveKey="/home">
                <Nav.Item>
                    <Nav.Link href="/historial"> Internacional</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-1">Nacional </Nav.Link>
                </Nav.Item>
                <Nav.Item></Nav.Item>
            </Nav>
        </div>
    );
};

export default DirectionPage;
