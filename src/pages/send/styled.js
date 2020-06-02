import styled from 'styled-components';
import { RadioGroup } from 'react-rainbow-components';

export const StyledSendPage = styled.div`
    flex: 1 1;
    padding: 3rem;

    background-color: #f7ece2;
    min-height: 100vh;

    @media (max-width: 768px) {
        padding: 3rem 0;
    }
`;

export const StyledPaneContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin: 3rem;

    @media (max-width: 768px) {
        margin: 3rem auto;
    }
`;

const StyledPane = styled.div.attrs(props => {
    return props.theme.rainbow.palette;
})`
    background: ${props => props.background.main};
    color: ${props => props.text.label};
    padding: 2rem;
    border-radius: 0.875rem;
    color: crimson;
    box-shadow: 0px 0px 16px -4px rgba(0, 0, 0, 0.75);
    margin: 1rem;
    display: flex;
    flex-wrap: wrap;
    min-height: 30vh;
    min-width: 330px;
    justify-content: flex-start;
    flex-direction: column;

    h4 {
        text-align: center;
    }
`;

export const StyledLeftPane = styled(StyledPane)`
    flex: 1 1;
`;

export const StyledRightPane = styled(StyledPane)`
    flex: 3 3;
`;

export const StyledRadioGroup = styled(RadioGroup)`
    max-height: 465px;
    overflow-y: scroll;

    & label span {
        display: inline-flex;
        flex-direction: column;
        justify-content: unset;
        vertical-align: unset;
        font-size: 0.8rem;
    }
    & > div > div {
        padding: 0.75rem 0;
        width: 95%;
    }
    & > div > div:not(:last-child) {
        border-bottom: 1px solid gainsboro;
    }
`;

export const HelpLabel = styled.span`
    margin-top: 25px;
    color: gray;
`;

export const DownloadContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin: 5rem auto;
    text-align: center;
    width: 300px;
`;
