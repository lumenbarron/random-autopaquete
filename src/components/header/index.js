import React from 'react';
import Logo from '../logo';
import Menu from '../menu';
import { StyledMain } from './styled';
import { Navbar } from 'react-bootstrap';

const Header = () => {
    return (
        <StyledMain>
            <Logo />
            <Menu />
        </StyledMain>
    );
};

export default Header;
