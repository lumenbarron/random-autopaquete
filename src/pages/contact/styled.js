import styled from 'styled-components';

export const StyledContact = styled.div`
    flex: 1 1;
    background-color: #f7ece2;
    display: flex;
    -ms-flex-pack: left;
    justify-content: left;
    -ms-flex-line-pack: left;
    align-content: left;
    -ms-flex-align: left;
    align-items: left;

    .back {
        min-height: 100%;
        margin: 0 5rem;
        position: absolute;
        display: flex;
        justify-content: center;
        flex-direction: column;
        margin-top: -5px;
    }

    h1 {
        color: #c94141;
        font-weight: 700;
        margin-left: 1rem;
    }

    li {
        font-size: 0.9rem;
        text-align: left;
        width: 300px;
    }

    col ul,
    h4 {
        text-align: left;
        padding-right: 100px;
    }

    h4 {
        color: #c94141;
        font-weight: 600;
    }

    .icon {
        margin: 0px 10px;
        color: #fcb043;
    }

    .boton {
        background-color: #ab0000;
        border: none;
        border-radius: 25px;
        float: right;
    }

    .message {
        padding-left: 120px;
    }
    button {
        margin-bottom: 1rem;
        margin-left: 1rem;

        padding-left: 1rem;
        width: 7rem;
    }

    .contact-form {
        padding: 10px;
    }
`;
