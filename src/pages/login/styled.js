import styled from 'styled-components';

export const StyledLoginPage = styled.div`
    display: flex;
    flex-wrap: wrap;
    padding: 6rem;

    h1 {
        color: #c94141 !important;
        font-weight: 600;
    }
    .boton {
        background-color: #ab0000;
        border: none;
        border-radius: 22px;
    }

    .boton:hover {
        background-color: #c94141;
        color: white;
    }
`;

export const StyledLoginSection = styled.div`
    min-width: 345px;
    flex: 1 1;
    padding: calc(3rem - 1vw);
`;
