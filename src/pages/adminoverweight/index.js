import React from 'react';

import { Table, Column } from 'react-rainbow-components';
import styled from 'styled-components';

import { StyledAdminoverweight } from './styled';

const containerStyles = { height: 312 };
const containerTableStyles = { height: 256 };

const StyledTable = styled(Table)`
    color: #1de9b6;
`;

const StyledColumn = styled(Column)`
    color: #1de9b6;
`;

const AdminoverweightPage = () => {
    return (
        <StyledAdminoverweight>
            <div className="back">
                <h1>Sobrepeso</h1>

                <div className="rainbow-p-bottom_xx-large">
                    <div style={containerStyles}>
                        <StyledTable pageSize={10} keyField="id" style={containerTableStyles}>
                            <StyledColumn header="Número de Guía" field="guide" />
                            <StyledColumn header="Usuario" field="user" />
                            <StyledColumn header="Fecha " field="date" />
                            <StyledColumn header="Kilos Declarados" field="kdeclared" />
                            <StyledColumn header="Kilos reales" field="kreal" />
                            <StyledColumn header="Cargos Adicionales" field="cadd" />
                        </StyledTable>
                    </div>
                </div>
            </div>
        </StyledAdminoverweight>
    );
};

export default AdminoverweightPage;
