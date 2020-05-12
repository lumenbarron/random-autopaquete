import React from 'react';
import PropTypes from 'prop-types';
import StyledPageContent from './styled';

function PageContent(props) {
    const { children } = props;

    return <StyledPageContent>{children}</StyledPageContent>;
}

PageContent.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

PageContent.defaultProps = {
    children: undefined,
};

export default PageContent;
