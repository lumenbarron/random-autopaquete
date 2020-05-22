import React from 'react';
import PropTypes from 'prop-types';
import Header from '../header';
import Footer from '../footer';
import { StyledMain } from './styled';

function Layout({ children }) {
    return (
        <StyledMain>
            <Header />
            <div>{children}</div>
            <Footer />
        </StyledMain>
    );
}

Layout.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    layoutType: PropTypes.oneOf(['header-footer', 'sidebar-only', 'empty']),
};

Layout.defaultProps = {
    children: undefined,
    layoutType: 'header-footer',
};

export default Layout;
