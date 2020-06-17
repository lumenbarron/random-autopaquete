import styled from 'styled-components';

export const StyledContact = styled.div`
    .back {
        background-color: #f7ece2;
        width: 100%;
        min-height:100%;
        margin: 0;
        position: absolute;
        display: flex;
        justify-content: center;
        flex-direction: column;  
    }

    h1 {
        color: #c94141;
        font-weight: 700;
        padding-left: 100px;
        padding-top: 50px;
    }

    li {
        font-size: 0.9rem;
        text-align: left;
        width: 300px;
    }

    col ul,
    h4 {
        text-align: left;
        padding-right:100px;
    }

    h4 {
        color: #c94141;
        font-weight: 600;
    }



    .icon {
        margin: 0px 10px;
        color: #fcb043;
        margin: 0px 10px;
    }

    .boton {
        background-color: #ab0000;
        border: none;
        border-radius: 25px;
    }

    .boton:hover {
        background-color: #c94141;
        color: white;
    }

    .message {
        padding-left: 120px;
    }
`;
