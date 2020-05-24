import React from 'react';
import { Link } from 'react-router-dom';
import { Sidebar, SidebarItem, Avatar } from 'react-rainbow-components';
import styled from 'styled-components';

const SideBarContainer = styled.div.attrs(props => {
    return props.theme.rainbow.palette;
})`
    position: fixed;
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #fff;
    z-index: 99999;
    padding-bottom: 14px;
    padding-top: 14px;
    background: ${props => props.background.main};
    width: 20%;
    border-bottom-left-radius: 0.875rem;
    max-width: 350px;
    min-width: 150px;
`;

const SidebarHeader = styled.div.attrs(props => {
    return props.theme.rainbow.palette;
})`
    margin: 0 auto;
    text-align: center;
`;

const StyledSidebar = styled(Sidebar)`
    border: 1px solid #f2f2f2;
    margin: 10px;
`;

const StyledSidebarItem = styled(SidebarItem)`
    margin: 0;
    padding: 0;
    &:hover {
        background: #f2f2f2;
    }
    & > button {
        flex-direction: row;
        padding: 10px;
        span {
            font-size: 1em;
        }
        img {
            width: 1rem;
        }
    }
`;

const Logo = styled.img.attrs(props => {
    return props.theme.rainbow.palette;
})`
    padding: 2em;
`;

const StyledAvatar = styled(Avatar)`
    width: 4rem;
    height: 4rem;
`;

const Status = styled('h6')`
    font-size: 0.6rem;
    margin: 0.6rem;
`;

const AddCreditButton = styled('button')`
    background: darkred;
    color: white;
    padding: 5px 15px;
    border-radius: 2rem;
    margin: 0.5rem;
`;

/** TODO: MODIFICAR ESTE ICONO POR UNA FOTO */
function UserAvatarIcon() {
    return (
        <span title="user icon">
            <svg width="17px" height="16px" viewBox="0 0 17 16" version="1.1">
                <g id="pages" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="user" transform="translate(-4.000000, -5.000000)" fillRule="nonzero">
                        <rect id="Rectangle" x="0" y="0" width="24" height="24" />
                        <path
                            d="M12.2082506,13.2387566 C10.001703,13.2387566 8.20692791,11.4439814 8.20692791,9.23743386 C8.20692791,7.03088625 10.001703,5.23611111 12.2082506,5.23611111 C14.4147983,5.23611111 16.2095734,7.03088625 16.2095734,9.23743386 C16.2095734,11.4439814 14.4147983,13.2387566 12.2082506,13.2387566 Z M12.2082506,5.96362434 C10.4032903,5.96362434 8.93444114,7.43247355 8.93444114,9.23743386 C8.93444114,11.0423942 10.4032903,12.5112434 12.2082506,12.5112434 C14.013211,12.5112434 15.4820602,11.0423942 15.4820602,9.23743386 C15.4820602,7.43247355 14.013211,5.96362434 12.2082506,5.96362434 Z"
                            id="Shape"
                            fill="#FFFFFF"
                        />
                        <path
                            d="M4.81705834,19.9502474 C4.70646477,20.1253539 4.47485911,20.1776519 4.29975263,20.0670583 C4.12464614,19.9564648 4.07234809,19.7248591 4.18294166,19.5497526 C6.24848468,16.2793095 8.94762126,14.625 12.25,14.625 C15.5523787,14.625 18.2515153,16.2793095 20.3170583,19.5497526 C20.4276519,19.7248591 20.3753539,19.9564648 20.2002474,20.0670583 C20.0251409,20.1776519 19.7935352,20.1253539 19.6829417,19.9502474 C17.7484847,16.8873572 15.2809546,15.375 12.25,15.375 C9.21904541,15.375 6.75151532,16.8873572 4.81705834,19.9502474 Z"
                            id="Line-2"
                            fill="#FFFFFF"
                        />
                    </g>
                </g>
            </svg>
        </span>
    );
}

export function AccountSidebar() {
    return (
        <SideBarContainer className="rainbow-p-top_small rainbow-p-bottom_medium">
            <SidebarHeader>
                <Logo src="/assets/logo.png" />
                <StyledAvatar
                    icon={<UserAvatarIcon />}
                    assistiveText="user icon"
                    title="user icon"
                />
                <Status>Activado</Status>
                <h5>Créditos</h5>
                <Link to="/mi-cuenta">
                    <AddCreditButton>Agregar</AddCreditButton>
                </Link>
                <Link to="/" style={{ display: 'block' }}>
                    Cerrar sesión
                </Link>
            </SidebarHeader>
            <StyledSidebar>
                <Link to="/mi-cuenta/enviar">
                    <StyledSidebarItem
                        icon={<img src="/assets/icon-send.png" alt="" />}
                        name="Enviar"
                        label="Enviar"
                    />
                </Link>
                <Link to="/mi-cuenta/historial">
                    <StyledSidebarItem
                        icon={<img src="/assets/icon-records.png" alt="" />}
                        name="Historial"
                        label="Historial"
                    />
                </Link>
                <Link to="/mi-cuenta/direcciones">
                    <StyledSidebarItem
                        icon={<img src="/assets/directions.png" alt="" />}
                        name="Direcciones"
                        label="Direcciones"
                    />
                </Link>
                <Link to="/mi-cuenta/sobrepeso">
                    <StyledSidebarItem
                        icon={<img src="/assets/icon-overweight.png" alt="" />}
                        name="Sobrepeso"
                        label="Sobrepeso"
                    />
                </Link>
                <Link to="/mi-cuenta/contacto">
                    <StyledSidebarItem
                        icon={<img src="/assets/icon-contact.png" alt="" />}
                        name="Contacto"
                        label="Contacto"
                    />
                </Link>
                <Link to="/">
                    <StyledSidebarItem name="Salir" label="Salir" />
                </Link>
            </StyledSidebar>
        </SideBarContainer>
    );
}

export function AdminSidebar() {
    return (
        <div className="backadmin">
            <SideBarContainer className="rainbow-p-top_small rainbow-p-bottom_medium">
                <SidebarHeader>
                    <Logo src="/logo-admin.png" />
                    <h5>Administrador</h5>
                </SidebarHeader>
                <StyledSidebar>
                    <Link to="/mi-cuenta/enviar">
                        <StyledSidebarItem
                            icon={<img src="/assets/admin-users.png" alt="" />}
                            name="Enviar"
                            label="Usuarios"
                        />
                    </Link>
                    <Link to="/mi-cuenta/historial">
                        <StyledSidebarItem
                            icon={<img src="/assets/icon-overweight.png" alt="" />}
                            name="Historial"
                            label="Sobrepeso"
                        />
                    </Link>
                </StyledSidebar>
            </SideBarContainer>
        </div>
    );
}
