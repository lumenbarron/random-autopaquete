import styled from 'styled-components';

export const StyledDirection = styled.div`
    flex: 1 1;
    background-color: #f7ece2;
`;

export const DirectionContainer = styled.div`
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
    float:right;
    }

    .alert-error {
        margin-bottom: .7rem;
    }

    .direction-accordion{
        background:#EFF1F5;
        margin-top:2rem;
    }

    .btn-new:hover {
    background-color: #C94141;
    color: white;
    padding: 8px 16px;
`;
