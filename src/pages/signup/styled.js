import styled from 'styled-components';

export const StyledLoginPage = styled.div`
    display: flex;
    flex-wrap: wrap;
    padding:  6rem;

    @media (max-width: 426px) {
        padding:  0;
      }

    h1 {
        color: #c94141 !important;
        font-weight: 600;
        text-align: center;
    }

    .ini-form {
        border-radius: 25px;
    }

    .boton {
        background-color: #ab0000;
        border: none;
        border-radius: 25px;
        color: #fff;
    }

    .alert-error {
    margin-bottom: 1rem!important ;
    margin-left: 1.2rem;
    color: crimson;
    }

    .restore-pass{
    margin-bottom: 1rem!important ;
    margin-left: 1.2rem;
    color: #54d561;
    } 

    .remember-pass {
        margin-left:1rem;
    }

    .boton:hover {
        background-color: #c94141;
        color: white;

`;

export const StyledLoginSection = styled.div`
    min-width: 345px;
    flex: 1 1;
    padding: calc(3rem - 1vw);
`;
