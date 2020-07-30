import styled from 'styled-components';

export const StyledOverweight = styled.div`
    flex: 1 1;
    background-color: #f7f7f7;

    & .back {
        background: white;
        margin: 5rem;
        padding: 2rem;
        border-radius: 3rem;

        color: crimson;

        -webkit-box-shadow: 0px 0px 16px -4px rgba(0, 0, 0, 0.75);
        -moz-box-shadow: 0px 0px 16px -4px rgba(0, 0, 0, 0.75);
        box-shadow: 0px 0px 16px -4px rgba(0, 0, 0, 0.75);

        h1 {
            font-weight: 700;
            font-size: 1.5rem;
        }
    }
`;
