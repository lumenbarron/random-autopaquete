import React, { useState, useEffect } from 'react';
import { Input, Button, RadioGroup, Textarea, Table, Column } from 'react-rainbow-components';
import formatMoney from 'accounting-js/lib/formatMoney.js';
import FileSelector from '../../../components/react-rainbow-beta/components/FileSelector';
import styled from 'styled-components';

const StyledTable = styled(Table)`
    color: #1de9b6;
`;

const StyledColumn = styled(Column)`
    color: #1de9b6;
`;

export default function Credito({ user }) {
    const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
    const [monto, setMonto] = useState('');
    const [comprobante, setComprobante] = useState('');
    const [transacciones, setTransacciones] = useState([]);

    useEffect(() => {}, [user]);

    return (
        <>
            <h2>Agregar Crédito</h2>
            <div className="rainbow-flex rainbow-flex_wrap">
                <div style={{ flex: '1 1' }}>
                    <Input
                        id="fecha"
                        label="Fecha"
                        className="rainbow-p-around_medium"
                        style={{ width: '100%' }}
                        value={date}
                        readOnly
                        type="date"
                    />
                </div>
                <div style={{ flex: '1 1' }}>
                    <Input
                        id="monto"
                        label="Monto"
                        className="rainbow-p-around_medium"
                        style={{ width: '100%' }}
                        value={monto}
                    />
                </div>
                <div style={{ flex: '1 1' }}>
                    <FileSelector
                        className="rainbow-p-horizontal_medium rainbow-m_auto"
                        label="Comprobante de pago"
                        placeholder="Sube o arrastra tu archivo aquí"
                        onChange={setComprobante}
                    />
                </div>
                <div style={{ flex: '1 1' }}>
                    <Button className="btn-confirm" label="Confirmar" />
                </div>
            </div>
            <StyledTable pageSize={10} keyField="id" data={transacciones} pageSize={10}>
                <StyledColumn header="Fecha " field="date" />
                <StyledColumn header="Monto" field="monto" />
                <StyledColumn header="Comprobante" field="comprobante" />
            </StyledTable>
        </>
    );
}
