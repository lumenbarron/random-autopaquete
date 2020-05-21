import React from 'react';
import { StyledColumn, StyledTable } from '../../styled';
import { StyledOverweight } from './styled';

const containerStyles = { height: 312 };
const containerTableStyles = { height: 256 };

const OverweightPage = () => {
    return (
        <StyledOverweight>
            <div className="back">
                <h1>Sobrepeso</h1>

                <div className="rainbow-p-bottom_xx-large">
                    <div style={containerStyles}>
                        <StyledTable pageSize={10} keyField="id" style={containerTableStyles}>
                            <StyledColumn header="Fecha " field="date" />
                            <StyledColumn header="Paquete (Guía)" field="guide" />
                            <StyledColumn header="Kilos Declarados" field="kdeclared" />
                            <StyledColumn header="Kilos reales" field="kreal" />
                            <StyledColumn header="Kilos cobrados" field="Kcollected" />

                            <StyledColumn header="Cargos" field="charge" />
                        </StyledTable>
                    </div>
                </div>
            </div>
        </StyledOverweight>
    );
};

export default OverweightPage;
