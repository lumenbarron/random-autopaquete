import styled from 'styled-components';
import theme from '../../theme';

export const StyledMain = styled.div`
    font-family: 'Montserrat', sans-serif;
    background: ${theme.colors.mainBackground};
    color: ${theme.colors.mainFont};
    font-size: 14px;
    line-height: 1.5em;
    width: 100%;

    margin: 0 auto;
    box-sizing: border-box;

    h1,
    h2,
    h3 {
        color: ${theme.colors.heading};
    }

    h1 {
        font-size: 35px;
        margin-bottom: 30px;
    }

    h2 {
        font-size: 28px;
        margin-bottom: 20px;
    }

    h3 {
        font-size: 24px;
        margin-bottom: 15px;
    }

    h4 {
        font-size: 20px;
        margin-bottom: 12px;
    }

    p {
        color: ${theme.colors.mainFont};
        line-height: 1.4em;
    }

    img.responsive {
        width: 100%;
        height: auto;
    }

    a {
        color: ${theme.colors.primary};

        :hover {
            text-decoration: none;
        }
    }
    .chip-aprobado {
        border-color: #277cea;
    }

    .chip-revision {
        border-color: #b1aba9;
    }

    .chip-falta-info {
        border-color: #fcb654;
    }
`;
