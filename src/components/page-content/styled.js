import styled from 'styled-components';
import theme from '../../theme';

const StyledPageContent = styled.div`
    p {
        line-height: 1.5 !important;
        font-size: 16px;
        color: ${theme.colors.mainFont} !important;
        margin-bottom: 30px;
    }

    h3 {
        color: red;
    }

    b {
        display: block;
        background: blue;
        padding: 20px;
        box-sizing: border-box;
    }
`;

export default StyledPageContent;
