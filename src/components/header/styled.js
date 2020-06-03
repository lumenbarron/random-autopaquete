import styled from 'styled-components';

export const StyledMain = styled.div`
    display: flex;
    padding: 35px 100px;
    justify-content: space-between;

    @media screen and (max-width: 991px) {
        flex-direction: column;
        padding: 35px 20px;
    }
`;
