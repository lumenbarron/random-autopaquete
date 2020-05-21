import React from 'react';
import PropTypes from 'prop-types';
import Header from '../header';
import Footer from '../footer';
import { StyledMain } from './styled';

function Layout(props) {
    const { children, layoutType } = props;

    const isHeaderFooter = layoutType === 'header-footer';
    const isSidebarOnly = layoutType === 'sidebar-only';
    const isEmpty = layoutType === 'empty';

    console.log('isHeaderFooter', isHeaderFooter);
    console.log('isSidebarOnly', isSidebarOnly);
    console.log('isEmpty', isEmpty);
    console.log('children', children);

    return (
        <StyledMain>
            {isHeaderFooter ? <Header /> : undefined}
            {isHeaderFooter ? <div>{children}</div> : undefined}
            {isHeaderFooter ? <Footer /> : undefined}

            {isSidebarOnly ? (
                <div>
                    <div>sidebar</div>
                    <div>{children}</div>
                </div>
            ) : (
                undefined
            )}

            {isEmpty ? <div>{children}</div> : undefined}
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
