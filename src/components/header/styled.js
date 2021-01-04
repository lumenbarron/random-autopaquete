import styled from 'styled-components';

export const StyledMain = styled.div`
    display: flex;
    padding: 35px 100px;
    justify-content: space-between;
    width: 100% @media screen and (max-width: 991px) {
        padding: 35px 20px;
    }
    @media screen and (max-width: 450px) {
        padding: 35px 20px;
        flex-direction: column;
    }
`;
