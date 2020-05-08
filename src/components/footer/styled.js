import styled from 'styled-components';
import theme from '../../theme';

export const StyledFooter = styled.div`
    .main-footer {
        color: #fff;
        background-color: ${theme.colors.primary};
        padding-top: 3em;
        position: relative;
        bottom: 0;
        width: 100%;
        height: 350px;
        line-height: 25px;
    }
    div {
        text-align: center;
    }
    .responsive {
        position: relative;
    }

    .footertwo {
        background-color: #2f2e2e;
        color: #fff;
        height: 40px;
        align-items: left !important;
    }

    p {
        color: #fff !important;
    }

    a {
        text-decoration: none;
        text-decoration-color: #fff;
    }
`;
