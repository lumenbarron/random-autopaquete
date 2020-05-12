import styled from 'styled-components';
import theme from '../../theme';

export const StyledFooter = styled.div`
    .main-footer {
        color: #fff;
        background: linear-gradient(#780000, ${theme.colors.primary});
        padding-top: 5em;
        position: relative;
        bottom: 0;
        width: 100%;
        height: 330px;
        line-height: 25px;
    }
    div {
        text-align: center;
    }

    .row img {
        width: 200px;
        height: auto;
    }

    .footertwo {
        background-color: #2f2e2e;
        color: #fff;
        height: 50px;
        padding-top: em;
    }

    .footertwo p a {
        color: #fff;
    }

    p {
        color: #fff !important;
    }

    .col ul li,
    h4 {
        text-align: left;
    }
`;
