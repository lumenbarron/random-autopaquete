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

    h4 {
        color: #c94141;
        font-weight: 600;
        font-size: 24px !important;
        width: 100%;
    }

    ul {
        line-height: 2rem;
    }

    .main-subtitle {
        font-size: 18px;
    }

    .subtitle {
        font-size: 20px;
        color: #6b6b6b;
    }

    .price {
        color: #c94141;
        font-size: 22px;
        font-weight: 600;
    }

    .supplier {
        color: #c94141;
        font-size: 22px;
        font-weight: 400;
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
        justify-content: flex-start;
        align-items: flex-start;
        flex-direction: column;
    }

    .container-description {
        display: flex;
        justify-content: space-between;
        width: 200px;
    }

    .container-description2 {
        display: flex;
        justify-content: space-between;
        width: 350px;
    }

    .lineimg {
        height: 180px;
    }

    .lineimg2 {
        height: 225px;
    }

    .spaceline {
        max-width: 20px !important;
    }
`;
