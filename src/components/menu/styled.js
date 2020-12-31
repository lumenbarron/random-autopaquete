import styled from 'styled-components';
import { Button, AvatarMenu } from 'react-rainbow-components';
import theme from '../../theme';

export const StyledMain = styled.div`
    width: 100%;
    max-width: 400px;
    @media screen and (max-width: 991px) {
    }
`;

export const StyledButton = styled(Button)`
    width: auto;
    text-transform: uppercase;
    @media screen and (max-width: 991px) {
        max-width: 200px;
    }

    ${props =>
        !props.active &&
        `
        color: ${theme.colors.mainFont};
    `}

    ${props =>
        props.wide &&
        `
        padding: 0 30px;
    `}
`;

export const StyledAvatarMenu = styled(AvatarMenu)``;
