import styled from 'styled-components';

export const StyledAdmin = styled.div`
    .back {
        font-family: Roboto, sans-serif;
        margin: 0;
        background: url(/assets/backadmin.png);
        background-size: cover;
        background-repeat: no-repeat;
        width: 100%;
        height: 100%;
        position: absolute;
        display: flex;
        justify-content: center;
        flex-direction: column;
    }
    * {
        box-sizing: border-box;
    }
    .contenedor {
        width: 100%;
        padding: 25px;
    }

    div.formulario {
        background: #fff;
        padding: 3px;
    }

    img {
        display: block;
        margin: auto;
    }
    input[type='text'],
    input[type='password'] {
        font-size: 20px;
        width: 100%;
        padding: 10px;
        border: none;
    }
    .input-contenedor {
        margin-bottom: 15px;
        border: 1px solid #fff;
    }

    .button {
        border: none;
        width: 100%;
        color: white;
        font-size: 20px;
        background: #bb4b46;
        padding: 15px 20px;
        border-radius: 45px;
        cursor: pointer;
    }
    .button:hover {
        background: #ab0000;
    }
    p {
        text-align: center;
    }
    .link {
        text-decoration: none;
        color: #bb4b46;
        font-weight: 600;
    }
    .link:hover {
        color: cadetblue;
    }
    @media (min-width: 768px) {
        .formulario {
            margin: auto;
            width: 500px;
            border-radius: 2%;
        }
    }
`;
