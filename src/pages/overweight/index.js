import React from 'react';
import { Column, Badge, TableWithBrowserPagination } from 'react-rainbow-components';
import styled from 'styled-components';

const containerStyles = { height: 312 };
const containerTableStyles = { height: 256 };

const OverweightPage = () => {
    return (
        <div>
            <div>
                <h1>Sobrepeso</h1>

                <div className="rainbow-p-bottom_xx-large">
                    <div style={containerStyles}>
                        <TableWithBrowserPagination
                            pageSize={10}
                            keyField="id"
                            style={containerTableStyles}
                        >
                            <Column header="Fecha " field="date" />
                            <Column header="Paquete (Guía)" field="guide" />
                            <Column header="Kilos Declarados" field="kdeclared" />
                            <Column header="Kilos reales" field="kreal" />
                            <Column header="Kilos cobrados" field="Kcollected" />

                            <Column header="Cargos" field="charge" />
                        </TableWithBrowserPagination>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverweightPage;
