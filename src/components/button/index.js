import React from 'react';
import PropTypes from 'prop-types';
import { StyledButton } from './styled';

const Button = props => {
    const { backgroundColor, fill, label, outline, size, wide } = props;

    return (
        <StyledButton
            backgroundColor={backgroundColor}
            fill={fill ? 1 : 0}
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
    fill: PropTypes.bool,
    label: PropTypes.string,
    outline: PropTypes.bool,
    wide: PropTypes.bool,
    size: PropTypes.string,
};

Button.defaultProps = {
    backgroundColor: 'primary',
    fill: true,
    label: '',
    outline: false,
    size: 'medium',
    wide: true,
};

export default Button;
