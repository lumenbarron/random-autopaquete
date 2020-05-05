import styled from 'styled-components';

export const StyledMain = styled.div`
    display: flex;
    padding: 35px 0;
    justify-content: space-between;

    @media screen and (max-width: 991px) {
        flex-direction: column;
    }
`;
