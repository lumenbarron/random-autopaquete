import React from 'react';

import { Table, Column } from 'react-rainbow-components';
import styled from 'styled-components';

import { StyledAusers } from './styled';

const containerStyles = { height: 312 };
const containerTableStyles = { height: 256 };

const StyledTable = styled(Table)`
    color: #1de9b6;
`;

const StyledColumn = styled(Column)`
    color: #1de9b6;
`;

const AusersPage = () => {
    return (
        <StyledAusers>
            <div className="back">
                <h1>Usuarios</h1>

                <div className="rainbow-p-bottom_xx-large">
                    <div style={containerStyles}>
                        <StyledTable pageSize={10} keyField="id" style={containerTableStyles}>
                            <StyledColumn header="Nombre " field="name" />
                            <StyledColumn header="Status" field="status" />
                            <StyledColumn header="Crédito disponible" field="Availablecredit" />
                            <StyledColumn header="Correo" field="email" />
                            <StyledColumn header="Comentarios" field="comments" />
                        </StyledTable>
                    </div>
                </div>
            </div>
        </StyledAusers>
    );
};

export default AusersPage;
