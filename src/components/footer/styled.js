import styled from 'styled-components';
import theme from '../../theme';

export const StyledFooter = styled.div`
    & > img {
        width: 100%;
        margin-top: -10%;
        margin-bottom: -14%;
    }
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
        padding-top: 1em;
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

    .icon {
        margin: 0px 10px;
    }
`;
