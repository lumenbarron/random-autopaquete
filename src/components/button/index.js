import React from 'react';
import PropTypes from 'prop-types';
import { StyledButton } from './styled';

const Button = props => {
    const { backgroundColor, label, outline, size, wide } = props;

    return (
        <StyledButton
            backgroundColor={backgroundColor}
            outline={outline ? 1 : 0}
            size={size}
            wide={wide ? 1 : 0}
        >
            {label}
        </StyledButton>
    );
};

Button.propTypes = {
    backgroundColor: PropTypes.string,
    label: PropTypes.string,
    outline: PropTypes.bool,
    wide: PropTypes.bool,
    size: PropTypes.string,
};

Button.defaultProps = {
    backgroundColor: 'primary',
    label: '',
    outline: false,
    size: 'medium',
    wide: true,
};

export default Button;
