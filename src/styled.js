import styled from 'styled-components';
import { Column, TableWithBrowserPagination } from 'react-rainbow-components';

const StyledColumn = styled(Column)``;

const StyledTable = styled(TableWithBrowserPagination)`
    position: relative;
    background-color: rgb(255, 255, 255);
    color: rgb(42, 48, 57);
    background-clip: padding-box;
    box-shadow: rgb(215, 217, 226) 0px 1px 2px 0px;
    border-width: 0.0625rem;
    border-style: solid;
    border-color: rgb(215, 217, 226);
    border-image: initial;
    border-radius: 0.875rem;
    overflow: hidden;

    th {
        font-weight: normal;
    }
`;

export { StyledColumn, StyledTable };
