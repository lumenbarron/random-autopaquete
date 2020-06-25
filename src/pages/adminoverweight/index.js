import React from 'react';

import { Table, Column, Input, Button } from 'react-rainbow-components';
import styled from 'styled-components';
import FileSelector from '../../components/react-rainbow-beta/components/FileSelector';

import { StyledAdminoverweight } from './styled';

const StyledTable = styled(Table)`
    color: #1de9b6;
`;

const StyledColumn = styled(Column)`
    color: #1de9b6;
`;

const AdminOverweightPage = () => {
    return (
        <StyledAdminoverweight>
            <div className="back">
                <h1>Sobrepeso</h1>

                <div className="rainbow-m-vertical_medium">
                    <h5>Agregar Sobrepeso</h5>
                    <div className="rainbow-flex rainbow-flex_wrap rainbow-flex_row">
                        <Input
                            id="guia"
                            label="Numero de guia"
                            className="rainbow-p-around_medium"
                            style={{ flex: '1 1' }}
                        />
                        <Input
                            id="usuario"
                            label="Usuario"
                            className="rainbow-p-around_medium"
                            style={{ flex: '1 1' }}
                            readOnly
                        />
                        <Input
                            id="fecha"
                            label="Fecha"
                            className="rainbow-p-around_medium"
                            style={{ flex: '1 1' }}
                            readOnly
                        />
                        <Input
                            id="kgs"
                            label="Kgs Declarados"
                            className="rainbow-p-around_medium"
                            style={{ flex: '1 1' }}
                            readOnly
                        />
                        <Input
                            id="kgsReales"
                            label="Kgs Reales"
                            className="rainbow-p-around_medium"
                            style={{ flex: '1 1' }}
                        />
                        <Input
                            id="cargo"
                            label="Cargo"
                            className="rainbow-p-around_medium"
                            style={{ flex: '1 1' }}
                            readOnly
                        />
                        <div style={{ flex: '1 1 100%', height: '0' }}></div>
                        <FileSelector
                            className="rainbow-p-horizontal_medium rainbow-m_auto"
                            label="Archivo XLS de Sobrepesos"
                            placeholder="Sube o arrastra tu archivo aquí"
                            style={{ flex: '1 1 50%' }}
                        />
                        <Button label="Confirmar" style={{ flex: '1 1 50%' }} />
                    </div>
                </div>

                <div className="rainbow-p-bottom_xx-large">
                    <div>
                        <StyledTable
                            pageSize={10}
                            keyField="id"
                            emptyTitle="Oh no!"
                            emptyDescription="No hay ningun registro actualmente..."
                        >
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

export default AdminOverweightPage;
