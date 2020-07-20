import { Tabset } from 'react-rainbow-components';
import styled from 'styled-components';

export const StyledContainer = styled.div.attrs(props => {
    return props.theme.rainbow.palette;
})`
    color: ${props => props.text.main};
    margin: 3rem;
    margin-bottom: 10%;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

export const StyledTabContent = styled.div.attrs(props => {
    return props.theme.rainbow.palette;
})`
    background: ${props => props.background.main};
    color: ${props => props.text.label};
    width: 70vw;
    border-radius: 0 0 0.875rem 0.875rem;
    margin: auto;
    box-shadow: 0 1px 2px 0 #d7d9e2;
    display: flex;
`;

export const StyledTabset = styled(Tabset)`
    width: 70vw;
    margin: 0 auto;
    background: #f0f3f4 !important;
    .tabsets {
    }
`;

export const StyledForm = styled.form.attrs(props => {
    return props.theme.rainbow.palette;
})`
    display: flex;
    flex-wrap: wrap;
    width: 100%;

    .alert-error {
        margin-bottom: 1rem !important ;

        color: crimson;
    }
`;

export const StyledSubmit = styled.button.attrs(props => {
    return props.theme.rainbow.palette;
})`
    background-color: #ab0000;
    border: none;
    border-radius: 25px;

    padding: 0.5rem 2rem;
    color: white;

    &:hover {
        background-color: #c94141;
        color: white;
    }
`;
