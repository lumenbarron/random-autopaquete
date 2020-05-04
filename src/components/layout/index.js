import React from 'react';
import PropTypes from 'prop-types';
import Header from '../header';
import Footer from '../footer';
import { StyledMain } from './styled';

const Layout = ({ children }) => (
    <>
        <StyledMain>
            <Header />
            <div>{children}</div>
            <Footer />
        </StyledMain>
    </>
);

Layout.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

Layout.defaultProps = {
    children: undefined,
};

export default Layout;
