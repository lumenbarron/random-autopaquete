import styled from 'styled-components';

export const StyledComment = styled.p`
    border-bottom: 1px solid gainsboro;
    padding: 1rem;
    & .date {
        font-size: 0.7rem;
        display: block;
        text-align: right;
    }
`;
