import styled from 'styled-components';

export const StyledStatement = styled.div`
    flex: 1 1;
    background-color: #f7f7f7;
`;

export const StatementContainer = styled.div`
    background-color: white;
    margin:5rem;
    padding:2rem;
    border-radius: 3rem;

    color: crimson;

    -webkit-box-shadow: 0px 0px 16px -4px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 0px 0px 16px -4px rgba(0, 0, 0, 0.75);
    box-shadow: 0px 0px 16px -4px rgba(0, 0, 0, 0.75);

    h1 {
        font-weight: 700;
    }

    tr {
        font-weight: 500;
    }

    th{
        text-align: center !important;
    }

    .btn-new {
    background-color: #AB0000;
    color: #fff;
    border-radius: 25px;
    padding: 8px 16px;
    }

    .btn-new:hover {
    background-color: #C94141;
    color: white;
    padding: 8px 16px;
    }

    .row-header {
        display: flex;
        justify-content: space-between;
        align-content: center;
        flex-direction: row;
        align-items: center;
        padding: 0 2rem;
        button {
            margin: 0;
            font-size: 0.8rem !important;
            margin-right: 2rem;
            background-color: #ab0000;
            a {
                color: white;
            }
    }
`;

export const StyleHeader = styled.div`
    background: gainsboro;
    margin: -2rem;
    padding: 1rem;
    padding-left: 3rem;
    margin-bottom: 0;

    .row-header {
        display: flex;
        justify-content: space-between;
        align-content: center;
        flex-direction: row;
        align-items: center;
    }
    h2 {
        font-size: 1rem !important;
        font-weight: bold;
        margin-bottom: 0 !important;
    }
    button {
        margin: 0;
        font-size: 0.8rem !important;
        margin-right: 2rem;
        background-color: #ab0000;
        a {
            color: white;
        }
    }
`;
