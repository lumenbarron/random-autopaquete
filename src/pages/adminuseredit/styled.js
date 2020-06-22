import styled from 'styled-components';

export const StyledUserEdit = styled.div`
    flex: 1 1;

    & .back {
        margin: 5rem;
    }

    .btn-confirm {
        background-color: #ab0000;
        color: #fff;
        border-radius: 25px;
        padding: 8px 16px;
        float: right;
        margin-top: 1rem;
    }

    .btn-confirm:hover {
        background-color: #c94141;
        color: white;
        padding: 8px 16px;
    }
`;

export const StyledPanel = styled.div`
    padding: 2rem;
    margin-top: 2rem;
    margin-bottom: 2rem;

    color: crimson;

    box-shadow: 0px 0px 16px -4px rgba(0, 0, 0, 0.75);

    h1 {
        font-weight: 700;
        font-size: 1.5rem;
    }

    & > h2 {
        background: gainsboro;
        margin: -2rem;
        padding: 1rem;
        padding-left: 3rem;
        margin-bottom: 0;
        font-size: 1rem !important;
        font-weight: bold;
    }

    & > .rainbow-flex > div  {
        padding: 1rem;
        min-width: 200px;
    }
`;
