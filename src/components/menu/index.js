import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { StyledButton, StyledMain } from './styled';

const Menu = () => {
    const [activeMenu, setActiveMenu] = useState(0);

    return (
        <StyledMain>
            <Nav fill className="justify-content-end" variant="pills" defaultActiveKey="/">
                <Nav.Item>
                    <Link to="/enviar">
                        <StyledButton
                            label="Enviar"
                            variant={activeMenu === 0 ? 'brand' : 'base'}
                            onClick={() => setActiveMenu(0)}
                            wide
                            active={activeMenu === 0}
                        />
                    </Link>
                </Nav.Item>
                <Nav.Item>
                    <Link to="/servicios">
                        <StyledButton
                            label="Servicios"
                            variant={activeMenu === 1 ? 'brand' : 'base'}
                            onClick={() => setActiveMenu(1)}
                            wide
                            active={activeMenu === 1}
                        />
                    </Link>
                </Nav.Item>
                <Nav.Item>
                    <Link to="/cotizacion">
                        <StyledButton
                            label="Cotizacion"
                            variant={activeMenu === 2 ? 'brand' : 'base'}
                            onClick={() => setActiveMenu(2)}
                            wide
                            active={activeMenu === 2}
                        />
                    </Link>
                </Nav.Item>
                <Nav.Item>
                    <Link to="/login">
                        <StyledButton
                            label="Mi cuenta"
                            variant={activeMenu === 3 ? 'brand' : 'outline-brand'}
                            onClick={() => setActiveMenu(3)}
                            wide
                            active={activeMenu === 3}
                        />
                    </Link>
                </Nav.Item>
            </Nav>
        </StyledMain>
    );
};

export default Menu;

/*
<Nav className="justify-content-end" activeKey="/home">
    <Nav.Item>
      <Nav.Link href="/home">Active</Nav.Link>
    </Nav.Item>
    <Nav.Item>
      <Nav.Link eventKey="link-1">Link</Nav.Link>
    </Nav.Item>
    <Nav.Item>
      <Nav.Link eventKey="link-2">Link</Nav.Link>
    </Nav.Item>
    <Nav.Item>
      <Nav.Link eventKey="disabled" disabled>
        Disabled
      </Nav.Link>
    </Nav.Item>
  </Nav>
  */
