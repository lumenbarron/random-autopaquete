import React from 'react';
import { AvatarMenu } from 'react-rainbow-components';
import Logo from '../logo';
import Menu from '../menu';
import { StyledMain } from './styled';

const Header = () => {
    return (
        <StyledMain>
            <Logo />

            <Menu />
            <AvatarMenu />
        </StyledMain>
    );
};

export default Header;
