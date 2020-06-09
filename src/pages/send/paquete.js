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
import * as firebase from 'firebase';
import { useFirebaseApp, useUser } from 'reactfire';

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

    const firebase = useFirebaseApp();
    const db = firebase.firestore();
    const user = useUser();

    const [name, setName] = useState('');
    const [height, setHeight] = useState('');
    const [width, setWidth] = useState('');
    const [depth, setDepth] = useState('');
    const [weight, setWeight] = useState('');

    const [contentDescription, setContentDescription] = useState('');
    const [quantity, setQuantity] = useState('');
    const [insurance, setInsurance] = useState(false);
    const [contentValue, setContentValue] = useState('');

    const registerDirecction = () => {
        if (
            name.trim() === '' ||
            height.trim() === '' ||
            width.trim() === '' ||
            depth.trim() === '' ||
            weight.trim() === '' ||
            contentDescription.trim() === '' ||
            quantity.trim() === '' ||
            contentValue.trim() === '' ||
            quantity.trim() === ''
        ) {
            console.log('Espacios vacios');
            return;
        }
        const packageData = {
            ID: user.uid,
            name,
            Height: height,
            Width: width,
            Depth: depth,
            Weight: weight,
            Content_description: contentDescription,
            Quantity: quantity,
            Insurance: insurance,
            Content_value: contentValue,
        };

        const packageGuiaData = {
            pakage: {
                ID: user.uid,
                name,
                Height: height,
                Width: width,
                Depth: depth,
                Weight: weight,
                Content_description: contentDescription,
                Quantity: quantity,
                Insurance: insurance,
                Content_value: contentValue,
            },
        };
        onSave(packageData, packageGuiaData);
    };

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
                        onChange={e => setName(e.target.value)}
                    />
                    <div style={{ flex: '1 1', minWidth: '300px' }}>
                        <p style={{ textAlign: 'center' }}>Dimensiones</p>
                        <div style={{ display: 'flex' }}>
                            <Input
                                id="height"
                                name="height"
                                className="rainbow-p-around_medium"
                                style={{ width: '30%' }}
                                onChange={e => setHeight(e.target.value)}
                            />
                            <HelpLabel>x</HelpLabel>
                            <Input
                                id="width"
                                name="width"
                                className="rainbow-p-around_medium"
                                style={{ width: '30%' }}
                                onChange={e => setWidth(e.target.value)}
                            />
                            <HelpLabel>x</HelpLabel>
                            <Input
                                id="depth"
                                name="depth"
                                className="rainbow-p-around_medium"
                                style={{ width: '30%' }}
                                onChange={e => setDepth(e.target.value)}
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
                        onChange={e => setWeight(e.target.value)}
                    />
                    <HelpLabel>kgs</HelpLabel>
                    <Input
                        id="contenido"
                        label="Descripción del Contenido"
                        name="contenido"
                        className="rainbow-p-around_medium"
                        style={{ flex: '1 1' }}
                        onChange={e => setContentDescription(e.target.value)}
                    />
                </div>
                <div className="rainbow-align-content_center rainbow-flex_wrap">
                    <Input
                        id="cantidad"
                        label="Cantidad"
                        name="cantidad"
                        className="rainbow-p-around_medium"
                        style={{ flex: '1 1' }}
                        onChange={e => setQuantity(e.target.value)}
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
                        onChange={e => setContentValue(e.target.value)}
                    />
                </div>
                <div style={{ textAlign: 'right' }}>
                    <CheckboxToggle id="guardar" label="Guardar" />
                </div>
                <Button
                    variant="brand"
                    className="rainbow-m-around_medium"
                    onClick={registerDirecction}
                >
                    Continuar
                    <FontAwesomeIcon icon={faArrowRight} className="rainbow-m-left_medium" />
                </Button>
            </StyledRightPane>
        </StyledPaneContainer>
    );
};
