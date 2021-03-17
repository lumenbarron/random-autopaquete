import styled from 'styled-components';

export const StyledAccount = styled.div`
    flex: 1 1;

    .back {
        background-color: #f7f7f7;
        padding: 3rem;
        min-height: 100vh;
    }

    .imgtext {
        margin-top: 20vh;
    }

    .imgtext > .row > .col {
        min-width: 300px;
    }

    h1 {
        color: #ab0000;
        font-weight: 700;
        padding-left: 100px;
        padding-top: 50px;
    }
    .name {
        text-transform: capitalize;
    }
    h2 {
        color: #6b6b6b !important;
        font-weight: 600;
        padding-left: 100px;
    }

    h3 {
        font-weight: 700;
        font-size: 18px !important;
    }

    a {
        color: #6b6b6b !important;
    }

    .boximg {
        width: 70px;
        height: 60px;
    }

    .lineimg {
        height: 250px;
    }

    .spaceline {
        max-width: 50px !important;
    }

    .whitespace {
        height: 25px;
    }

    .alert-error {
        color: red;
        padding-left: 100px;
    }
`;
