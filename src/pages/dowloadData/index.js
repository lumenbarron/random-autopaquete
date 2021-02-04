import React from 'react';
import { CSVLink } from 'react-csv';
import { Button } from 'react-rainbow-components';

export default function ExportReactCSV({ data }) {
    // console.log('data csv', data);
    const headers = [
        { label: 'ID', key: 'id' },
        { label: 'Nombre', key: 'name' },
        { label: 'Fecha', key: 'package.creation_date' },
        { label: 'Guia', key: 'rastreo' },
        { label: 'Nombre Origen', key: 'sender_addresses.name' },
        { label: 'Telefono Origen', key: 'sender_addresses.phone' },
        { label: 'Calle Origen', key: 'sender_addresses.street_number' },
        { label: 'Colonia Origen', key: 'sender_addresses.neighborhood' },
        { label: 'Código Postal Origen', key: 'sender_addresses.codigo_postal' },
        { label: 'Referencias Origen', key: 'sender_addresses.place_reference' },
        { label: 'Nombre Destino', key: 'receiver_addresses.name' },
        { label: 'Telefono Destino', key: 'receiver_addresses.phone' },
        { label: 'Calle Destino', key: 'receiver_addresses.street_number' },
        { label: 'Colonia Destino', key: 'receiver_addresses.neighborhood' },
        { label: 'Código Postal Destino', key: 'receiver_addresses.codigo_postal' },
        { label: 'Referencias Destino', key: 'receiver_addresses.place_reference' },
        { label: 'Paquete', key: 'package.content_description' },
        { label: 'Largo', key: 'package.height' },
        { label: 'Ancho', key: 'package.width' },
        { label: 'Alto', key: 'package.depth' },
        { label: 'Peso Físico', key: 'package.weight' },
        { label: 'Peso Volumetrico', key: 'volumetricWeight' },
        { label: 'Servicios', key: 'supplierData.Supplier' },
        { label: 'Zona Extendida', key: 'supplierData.cargos.zonaExt' },
        { label: 'Cargo seguro', key: 'supplierData.cargos.insurance' },
        { label: 'Costo', key: 'supplierData.Supplier_cost' },
    ];
    return (
        <Button variant="destructive" className="rainbow-m-around_medium">
            <CSVLink
                data={data}
                headers={headers}
                filename={'historial-de-envios.csv'}
                target="_blank"
            >
                Descargar archivo
            </CSVLink>
        </Button>
    );
}
