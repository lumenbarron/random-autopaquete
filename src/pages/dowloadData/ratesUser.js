import React from 'react';
import { CSVLink } from 'react-csv';
import { Button } from 'react-rainbow-components';

export default function ExportRatesCSV({ data }) {
    //console.log('data csv', data);
    const headers = [
        { label: 'Paqueteria', key: 'entrega' },
        { label: 'Kg Min', key: 'min' },
        { label: 'Kg Max', key: 'max' },
        { label: 'Precio', key: 'precio' },
        { label: 'Kg Extra', key: 'kgExtra' },
    ];
    return (
        <Button
            variant="destructive"
            className="rainbow-m-around_medium"
            style={{ backgroundColor: '#ab0000' }}
        >
            <CSVLink data={data} headers={headers} filename={'tarifas.csv'} target="_blank">
                Descargar archivo
            </CSVLink>
        </Button>
    );
}
