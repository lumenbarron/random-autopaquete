import React, { useState } from 'react';
import { Input, CheckboxToggle, Button } from 'react-rainbow-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { StyledLeftPane, StyledRightPane, StyledPaneContainer, StyledRadioGroup } from './styled';

// TODO: CAMBIAR A LOS DATOS REALES DEL USUARIO
const addresses = [
    {
        name: 'Juan Hernández',
        address: 'Independencia 333',
        neighborhood: 'Col. Centro',
        city: 'Girasoles, Son.',
        references: 'afuera del centro',
        phone: '393939293',
        cp: '44444',
    },
    {
        name: 'Juan Hernández',
        address: 'Independencia 333',
        neighborhood: 'Col. Centro',
        city: 'Girasoles, Son.',
        references: 'afuera del centro',
        phone: '393939293',
        cp: '44444',
    },
    {
        name: 'Juan Hernández',
        address: 'Independencia 333',
        neighborhood: 'Col. Centro',
        city: 'Girasoles, Son.',
        references: 'afuera del centro',
        phone: '393939293',
        cp: '44444',
    },
    {
        name: 'Juan Hernández',
        address: 'Independencia 333',
        neighborhood: 'Col. Centro',
        city: 'Girasoles, Son.',
        references: 'afuera del centro',
        phone: '393939293',
        cp: '44444',
    },
];

const AddressRadioOption = ({ data }) => {
    return (
        <>
            <span>
                <b>{data.name}</b>
            </span>
            <p>{data.address}</p>
            <p>{data.neighborhood}</p>
            <p>{data.city}</p>
            <p>C.P. {data.cp}</p>
            <p>Tel {data.phone}</p>
        </>
    );
};

export const DestinoComponent = ({ onSave }) => {
    const [value, setValue] = useState(null);

    const options = addresses.map((val, idx) => {
        return {
            value: idx + '',
            label: <AddressRadioOption data={val} />,
        };
    });

    return (
        <StyledPaneContainer>
            <StyledLeftPane>
                <h4>Mis direcciones</h4>
                <Input
                    placeholder="Buscar"
                    iconPosition="right"
                    icon={<FontAwesomeIcon icon={faSearch} />}
                />
                <StyledRadioGroup
                    id="radio-group-component-1"
                    options={options}
                    value={value}
                    className="rainbow-m-around_small"
                    onChange={e => setValue(e.target.value)}
                />
            </StyledLeftPane>
            <StyledRightPane>
                <h4>Dirección de Destino</h4>
                <div className="rainbow-align-content_center rainbow-flex_wrap">
                    <Input
                        id="nombre"
                        label="Nombre"
                        name="nombre"
                        className="rainbow-p-around_medium"
                        style={{ width: '70%' }}
                    />
                    <Input
                        id="cp"
                        label="C.P."
                        name="cp"
                        className="rainbow-p-around_medium"
                        style={{ width: '30%' }}
                    />
                </div>
                <div className="rainbow-align-content_center rainbow-flex_wrap">
                    <Input
                        id="colonia"
                        label="Colonia"
                        name="colonia"
                        className="rainbow-p-around_medium"
                        style={{ flex: '1 1' }}
                    />
                    <Input
                        id="ciudad"
                        label="Ciudad y Estado"
                        name="ciudad"
                        className="rainbow-p-around_medium"
                        style={{ flex: '1 1' }}
                    />
                </div>
                <div className="rainbow-align-content_center rainbow-flex_wrap">
                    <Input
                        id="domicilio"
                        label="Calle y Número"
                        name="domicilio"
                        className="rainbow-p-around_medium"
                        style={{ flex: '1 1' }}
                    />
                    <Input
                        id="referencia"
                        label="Referencias del Lugar"
                        name="referencia"
                        className="rainbow-p-around_medium"
                        style={{ flex: '1 1' }}
                    />
                </div>
                <div className="rainbow-align-content_center rainbow-flex_wrap">
                    <Input
                        id="telefono"
                        label="Telefono"
                        name="telefono"
                        className="rainbow-p-around_medium"
                        style={{ width: '50%' }}
                    />
                    <div style={{ flex: '1 1', textAlign: 'right' }}>
                        <CheckboxToggle id="guardar" label="Guardar" />
                    </div>
                </div>
                <Button variant="brand" className="rainbow-m-around_medium" onClick={onSave}>
                    Continuar
                    <FontAwesomeIcon icon={faArrowRight} className="rainbow-m-left_medium" />
                </Button>
            </StyledRightPane>
        </StyledPaneContainer>
    );
};
