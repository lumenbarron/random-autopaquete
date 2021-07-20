import React from 'react';
import { CSVLink } from 'react-csv';
import { Button } from 'react-rainbow-components';

export default function ExportReactStatementCSV({ data }) {
    const headers = [
        { label: 'ID', key: 'id' },
        { label: 'Fecha', key: 'date' },
        { label: 'Concepto', key: 'concept' },
        { label: 'Referencia', key: 'reference' },
        { label: 'Monto', key: 'monto' },
        { label: 'Saldo', key: 'saldo' },
    ];
    return (
        <Button
            variant="destructive"
            className="rainbow-m-around_medium"
            style={{ backgroundColor: '#ab0000' }}
        >
            <CSVLink
                data={data}
                headers={headers}
                filename={'estado-de-cuenta.csv'}
                target="_blank"
            >
                Descargar archivo
            </CSVLink>
        </Button>
    );
}
