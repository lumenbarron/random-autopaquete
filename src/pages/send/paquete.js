import React, { useState } from 'react';
import { Input, CheckboxToggle, Button } from 'react-rainbow-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import {
    StyledLeftPane,
    StyledRightPane,
    StyledPaneContainer,
    StyledRadioGroup,
    HelpLabel,
} from './styled';

// TODO: CAMBIAR A LOS DATOS REALES DEL USUARIO
const packaging = [
    {
        name: 'Caja 20x20x20',
        height: '20',
        width: '20',
        depth: '20',
        weight: '5',
    },
    {
        name: 'Caja 20x20x20',
        height: '20',
        width: '20',
        depth: '20',
        weight: '5',
    },
    {
        name: 'Caja 20x20x20',
        height: '20',
        width: '20',
        depth: '20',
        weight: '5',
    },
    {
        name: 'Caja 20x20x20',
        height: '20',
        width: '20',
        depth: '20',
        weight: '5',
    },
];

const PackagingRadioOption = ({ data }) => {
    return (
        <>
            <span>
                <b>{data.name}</b>
            </span>
            <p>
                Dimensiones: {data.height}x{data.width}x{data.depth} cm
            </p>
            <p>Peso: {data.weight} kgs</p>
        </>
    );
};

export const PaqueteComponent = ({ onSave }) => {
    const [value, setValue] = useState(null);

    const options = packaging.map((val, idx) => {
        return {
            value: idx + '',
            label: <PackagingRadioOption data={val} />,
        };
    });

    return (
        <StyledPaneContainer>
            <StyledLeftPane>
                <h4>Mis empaques</h4>
                <StyledRadioGroup
                    id="radio-group-component-1"
                    options={options}
                    value={value}
                    className="rainbow-m-around_small"
                    onChange={e => setValue(e.target.value)}
                />
            </StyledLeftPane>
            <StyledRightPane>
                <h4>Datos de empaque</h4>
                <div className="rainbow-align-content_center rainbow-flex_wrap">
                    <Input
                        id="nombre"
                        label="Nombre"
                        name="nombre"
                        className="rainbow-p-around_medium"
                        style={{ flex: '1 1', minWidth: '200px' }}
                    />
                    <div style={{ flex: '1 1', minWidth: '300px' }}>
                        <p style={{ textAlign: 'center' }}>Dimensiones</p>
                        <div style={{ display: 'flex' }}>
                            <Input
                                id="height"
                                name="height"
                                className="rainbow-p-around_medium"
                                style={{ width: '30%' }}
                            />
                            <HelpLabel>x</HelpLabel>
                            <Input
                                id="width"
                                name="width"
                                className="rainbow-p-around_medium"
                                style={{ width: '30%' }}
                            />
                            <HelpLabel>x</HelpLabel>
                            <Input
                                id="depth"
                                name="depth"
                                className="rainbow-p-around_medium"
                                style={{ width: '30%' }}
                            />
                            <HelpLabel>cm</HelpLabel>
                        </div>
                    </div>
                </div>
                <div className="rainbow-align-content_center rainbow-flex_wrap">
                    <Input
                        id="peso"
                        label="Peso"
                        name="peso"
                        className="rainbow-p-around_medium"
                        style={{ flex: '1 1' }}
                    />
                    <HelpLabel>kgs</HelpLabel>
                    <Input
                        id="contenido"
                        label="Descripción del Contenido"
                        name="contenido"
                        className="rainbow-p-around_medium"
                        style={{ flex: '1 1' }}
                    />
                </div>
                <div className="rainbow-align-content_center rainbow-flex_wrap">
                    <Input
                        id="cantidad"
                        label="Cantidad"
                        name="cantidad"
                        className="rainbow-p-around_medium"
                        style={{ flex: '1 1' }}
                    />
                    <CheckboxToggle
                        id="asegurar"
                        label="¿Desea asegurar?"
                        style={{ display: 'flex', flexDirection: 'column-reverse' }}
                    />
                    <Input
                        id="valor"
                        label="Valor del Contenido"
                        name="valor"
                        className="rainbow-p-around_medium"
                        style={{ flex: '1 1' }}
                    />
                </div>
                <div style={{ textAlign: 'right' }}>
                    <CheckboxToggle id="guardar" label="Guardar" />
                </div>
                <Button variant="brand" className="rainbow-m-around_medium" onClick={onSave}>
                    Continuar
                    <FontAwesomeIcon icon={faArrowRight} className="rainbow-m-left_medium" />
                </Button>
            </StyledRightPane>
        </StyledPaneContainer>
    );
};
