import React from 'react';
import { Column, Badge, TableWithBrowserPagination, Input } from 'react-rainbow-components';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const StyledBadge = styled(Badge)`
    color: #09d3ac;
`;
const StatusBadge = ({ value }) => <StyledBadge label={value} variant="lightest" />;
const containerStyles = { height: 312 };
const containerTableStyles = { height: 256 };

const RecordPage = () => {
    return (
        <div>
            <div>
                <h1>Mis envíos</h1>

                <div className="rainbow-align-content_center rainbow-p-vertical_x-large rainbow-flex_wrap">
                    <Input
                        className="rainbow-p-around_medium"
                        placeholder="Buscar"
                        icon={<FontAwesomeIcon icon={faSearch} className="rainbow-color_gray-3" />}
                    />
                </div>

                <div className="rainbow-p-bottom_xx-large">
                    <div style={containerStyles}>
                        <TableWithBrowserPagination
                            pageSize={10}
                            keyField="id"
                            style={containerTableStyles}
                        >
                            <Column header="Fecha " field="date" />
                            <Column header="Guía" field="guide" />
                            <Column header="Origen" field="origin" />
                            <Column header="Destino" field="Destination" />
                            <Column header="Peso" field="weight" />
                            <Column header="Servicio" field="service" />
                            <Column header="Status" field="status" component={StatusBadge} />
                            <Column header="Costo" field="cost" />
                        </TableWithBrowserPagination>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecordPage;
