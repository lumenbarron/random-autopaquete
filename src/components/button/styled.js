import styled from 'styled-components';
import { Button } from 'react-bootstrap';
import theme from '../../theme';

export const StyledButton = styled(Button).attrs(props => {
    let backgroundColor = theme.colors.primary;

    if (props.backgroundColor === 'secondary') {
        backgroundColor = theme.colors.secondary;
    }

    return {
        backgroundcolor: backgroundColor,
    };
})`
    color: white;
    border-radius: 50px !important;
    border: 0 !important;
    background: ${props => props.backgroundcolor} !important;
    border: 2px solid ${props => props.backgroundcolor} !important;

    ${props =>
        props.outline &&
        `
            color: ${theme.colors.mainFont} !important;
            background: none !important;
            border: 2px solid ${props.backgroundcolor} !important;
    `};

    ${props =>
        props.wide &&
        `
            width: 120px;
    `};
`;
