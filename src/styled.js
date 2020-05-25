import styled from 'styled-components';
import { Column, TableWithBrowserPagination } from 'react-rainbow-components';

const StyledColumn = styled(Column)``;

const StyledTable = styled(TableWithBrowserPagination)`
    th {
        font-weight: normal;
    }
`;

export { StyledColumn, StyledTable };
