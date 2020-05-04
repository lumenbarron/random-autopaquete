import React from 'react';
import Logo from '../logo';
import Menu from '../menu';
import { StyledMain } from './styled';

const Header = () => {
    return (
        <StyledMain>
            <Logo />
            <Menu />
        </StyledMain>
    );
};

export default Header;
