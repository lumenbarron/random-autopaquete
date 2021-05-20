import styled from 'styled-components';

export const StyledRecord = styled.div`
    flex: 1 1;
    padding: 3rem;
    background-color: #f7f7f7;

    h1 {
        color: #ab0000;
        font-weight: 700 !important;
        padding-top: 30px;
    }

    .content-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0;
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

export const RecordContainer = styled.div`
    background-color: white;
    padding: 2rem;
    border-radius: 3rem;

    color: crimson;

    -webkit-box-shadow: 0px 0px 16px -4px rgba(0, 0, 0, 0.75);
    -moz-box-shadow: 0px 0px 16px -4px rgba(0, 0, 0, 0.75);
    box-shadow: 0px 0px 16px -4px rgba(0, 0, 0, 0.75);

    h1 {
        font-weight: 700;
        color: #ab0000;
    }

    tr {
        font-weight: 500;
    }

    th {
        text-align: center !important;
    }

    .btn-new {
        background-color: #ab0000;
        color: #fff;
        border-radius: 25px;
        padding: 8px 16px;
    }

    .btn-new:hover {
        background-color: #c94141;
        color: white;
        padding: 8px 16px;
    }

    #main-title {
        color: #ab0000;
    }

    .create-button {
        border-color: transparent;
        background-color: #00652e;
        color: white;
    }
`;
