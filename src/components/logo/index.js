import React from 'react';
import { Link } from 'react-router-dom';
import { Image } from 'react-bootstrap';
import { StyledMain } from './styled';

const Logo = () => {
    return (
        <StyledMain>
            <Link to="/">
                <Image src="assets/logo.png" className="responsive" />
            </Link>
        </StyledMain>
    );
};

export default Logo;
