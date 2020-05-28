import React, { useState } from 'react';
import { Tab, Input } from 'react-rainbow-components';
import {
    StyledContainer,
    StyledTabset,
    StyledTabContent,
    StyledForm,
    StyledSubmit,
} from './styled.js';
import { useSecurity } from '../../hooks/useSecurity';

// TODO: CAMBIAR ESTO EN CUANTO LIBEREN LA VERSION FINAL DE FileSelector
import FileSelector from '../../components/react-rainbow-beta/components/FileSelector';

const TabPersonaFisica = () => {
    return (
        <StyledTabContent
            aria-labelledby="pfisica"
            id="pfisicaTab"
            className="rainbow-p-around_xx-large rainbow-font-size-text_large"
        >
            <StyledForm>
                <div style={{ flex: '1 1' }}>
                    <div className="rainbow-align-content_center rainbow-flex_wrap">
                        <Input
                            id="nombreCompleto"
                            label="Nombre Completo"
                            name="nombreCompleto"
                            className="rainbow-p-around_medium"
                            style={{ width: '90%' }}
                        />
                        <Input
                            id="domicilio"
                            label="Domicilio"
                            name="domicilio"
                            className="rainbow-p-around_medium"
                            style={{ width: '90%' }}
                        />
                    </div>
                    <div className="rainbow-align-content_center rainbow-flex_wrap">
                        <Input
                            id="telefono"
                            label="Telefono"
                            name="telefono"
                            className="rainbow-p-around_medium"
                            style={{ width: '45%' }}
                        />
                        <Input
                            id="rfc"
                            label="RFC"
                            name="rfc"
                            className="rainbow-p-around_medium"
                            style={{ width: '45%' }}
                        />
                    </div>
                    <div className="rainbow-align-content_center rainbow-flex_wrap">
                        <Input
                            id="fechaNacimiento"
                            label="Fecha de nacimiento"
                            name="fechaNacimiento"
                            type="date"
                            className="rainbow-p-around_medium"
                            style={{ width: '90%' }}
                        />
                        <Input
                            id="numeroINE"
                            label="Número de INE"
                            name="numeroINE"
                            className="rainbow-p-around_medium"
                            style={{ width: '90%' }}
                        />
                    </div>
                </div>
                <div style={{ flex: '1 1', textAlign: 'center' }}>
                    <FileSelector
                        className="rainbow-p-horizontal_medium rainbow-m_auto"
                        label="Constancia de Situación Fiscal (Opcional)"
                        placeholder="Sube o arrastra tu archivo aquí"
                        style={{ height: '20%' }}
                    />
                    <FileSelector
                        className="rainbow-p-horizontal_medium rainbow-m_auto"
                        label="Foto de INE"
                        placeholder="Sube o arrastra tu archivo aquí"
                        style={{ height: '20%' }}
                    />
                    <FileSelector
                        className="rainbow-p-horizontal_medium rainbow-m_auto"
                        label="Comprobante de domicilio"
                        placeholder="Sube o arrastra tu archivo aquí"
                        style={{ height: '20%' }}
                    />
                    <h5 className="rainbow-m-vertical_x-large">
                        Al enviar tu documentación aceptas los términos y condiciones y el aviso de
                        privacidad
                    </h5>
                    <StyledSubmit className="rainbow-m-around_medium" type="submit">
                        Continuar
                    </StyledSubmit>
                </div>
            </StyledForm>
        </StyledTabContent>
    );
};

const TabPersonaMoral = () => {
    return (
        <StyledTabContent
            aria-labelledby="pmoral"
            id="pmoralTab"
            className="rainbow-p-around_xx-large rainbow-font-size-text_large"
        >
            <StyledForm>
                <div style={{ flex: '1 1' }}>
                    <div className="rainbow-align-content_center rainbow-flex_wrap">
                        <Input
                            id="razonSocial"
                            label="Razón Social"
                            name="razonSocial"
                            className="rainbow-p-around_medium"
                            style={{ width: '90%' }}
                        />
                        <Input
                            id="nombreRepLegal"
                            label="Nombre Representante Legal"
                            name="nombreRepLegal"
                            className="rainbow-p-around_medium"
                            style={{ width: '90%' }}
                        />
                        <Input
                            id="domicilio"
                            label="Domicilio"
                            name="domicilio"
                            className="rainbow-p-around_medium"
                            style={{ width: '90%' }}
                        />
                    </div>
                    <div className="rainbow-align-content_center rainbow-flex_wrap">
                        <Input
                            id="telefono"
                            label="Telefono"
                            name="telefono"
                            className="rainbow-p-around_medium"
                            style={{ width: '45%' }}
                        />
                        <Input
                            id="rfc"
                            label="RFC"
                            name="rfc"
                            className="rainbow-p-around_medium"
                            style={{ width: '45%' }}
                        />
                    </div>
                    <FileSelector
                        className="rainbow-p-horizontal_medium rainbow-m_auto"
                        label="Acta Constitutiva"
                        placeholder="Sube o arrastra tu archivo aquí"
                        style={{ height: '20%' }}
                    />
                </div>
                <div style={{ flex: '1 1', textAlign: 'center' }}>
                    <FileSelector
                        className="rainbow-p-horizontal_medium rainbow-m_auto"
                        label="Constancia de Situación Fiscal"
                        placeholder="Sube o arrastra tu archivo aquí"
                        style={{ height: '20%' }}
                    />
                    <FileSelector
                        className="rainbow-p-horizontal_medium rainbow-m_auto"
                        label="Comprobante de domicilio"
                        placeholder="Sube o arrastra tu archivo aquí"
                        style={{ height: '20%' }}
                    />
                    <FileSelector
                        className="rainbow-p-horizontal_medium rainbow-m_auto"
                        label="Foto de INE Representante Legal"
                        placeholder="Sube o arrastra tu archivo aquí"
                        style={{ height: '20%' }}
                    />
                    <h5 className="rainbow-m-vertical_x-large">
                        Al enviar tu documentación aceptas los términos y condiciones y el aviso de
                        privacidad
                    </h5>
                    <StyledSubmit className="rainbow-m-around_medium" type="submit">
                        Continuar
                    </StyledSubmit>
                </div>
            </StyledForm>
        </StyledTabContent>
    );
};

const DocumentsPage = () => {
    const [selected, setSelected] = useState('pfisica');

    useSecurity();

    return (
        <StyledContainer>
            <StyledTabset
                id="tabset-1"
                onSelect={(e, selected) => {
                    setSelected(selected);
                }}
                activeTabName={selected}
                className="rainbow-p-horizontal_x-large"
            >
                <Tab label="Persona Física" name="pfisica" id="pfisica" ariaControls="pfisicaTab" />

                <Tab label="Persona Moral" name="pmoral" id="pmoral" ariaControls="pmoralTab" />
            </StyledTabset>
            {selected === 'pfisica' && <TabPersonaFisica />}
            {selected === 'pmoral' && <TabPersonaMoral />}
        </StyledContainer>
    );
};

export default DocumentsPage;
