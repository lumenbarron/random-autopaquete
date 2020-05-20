import styled from 'styled-components';

export const StyledQuote = styled.div`
    .title {
        color: #bb4b46;
        text-align: center;
        font-weight: 600;
    }

    .formulario {
        margin: 2rem auto;
        padding: 2rem;
    }


    label {
        padding: 1rem 0 0.25rem;
        font-size: 14px;
        color: Black;
    }

    input {
        width: 100%;
        border: 2px solid #b2b2b2;
        padding: 0.5rem;
        font-size: 18px;
        border-radius: 35px;
    }

    input:hover {
        border: 2px solid;
    }

    .boton {
        border: 0;
        background: #ab0000;
        border-radius: 20px;
        padding: 0.5rem;
        color: white;
        margin: 1rem 0;
        text-transform: uppercase;
    }

    .boton:hover {
        background: #bb4b46;
        color: white;
    }

    img {
        margin-top: 90px;
        min-width: 600px;
    }

    .white-space {
        height: 100px;
    }
`;
