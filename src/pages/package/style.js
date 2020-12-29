import styled from 'styled-components';

export const StyledPackage = styled.div`
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
        padding-top: 30px;
    }

    h2 {
        color: #6b6b6b !important;
        font-weight: 600;
        padding-left: 100px;
    }

    h3 {
        font-weight: 400;
        font-size: 28px !important;
    }

    h4 {
        color: #c94141;
        font-weight: 600;
        font-size: 24px !important;
    }

    .subtitle {
        font-size: 20px;
    }

    .price {
        color: #c94141;
    }

    .img-package {
        max-width: fit-content;
        height: 191px;
    }

    a {
        color: #6b6b6b !important;
    }

    .boximg {
        width: 70px;
        height: 60px;
    }

    .description {
        font-size: 1rem;
        text-align: center;
    }

    .container-package {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .lineimg {
        height: 250px;
    }

    .spaceline {
        max-width: 20px !important;
    }

    .whitespace {
        height: 25px;
    }

    .alert-error {
        color: red;
        padding-left: 100px;
    }
`;
