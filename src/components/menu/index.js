import React, { useState, useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { useUser, useFirebaseApp } from 'reactfire';
import { MenuItem } from 'react-rainbow-components';
import { StyledButton, StyledMain, StyledAvatarMenu } from './styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Menu = () => {
    const [activeMenu, setActiveMenu] = useState(0);
    const [avatarURL, setAvatarURL] = useState('');
    const user = useUser();
    const history = useHistory();
    const firebase = useFirebaseApp();
    const db = firebase.firestore();

    const configureClick = e => {
        e.preventDefault();
        history.push('/mi-cuenta');
    };

    const signOutClick = async e => {
        e.preventDefault();
        await firebase.auth().signOut();
    };

    useEffect(() => {
        if (user) {
            const docRef = db.collection('profiles').where('ID', '==', user.uid);

            docRef.get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    setAvatarURL(doc.data().avatar);
                });
            });
        }
    }, [user]);

    return (
        <StyledMain>
            <Nav fill className="justify-content-end" variant="pills" defaultActiveKey="/">
                <Nav.Item>
                    <Link to="/">
                        <StyledButton
                            label="Inicio"
                            variant={activeMenu === 0 ? 'brand' : 'base'}
                            onClick={() => setActiveMenu(0)}
                            wide
                            active={activeMenu === 0}
                        />
                    </Link>
                </Nav.Item>
                <Nav.Item>
                    <Link to="/servicios">
                        <StyledButton
                            label="Servicios"
                            variant={activeMenu === 1 ? 'brand' : 'base'}
                            onClick={() => setActiveMenu(1)}
                            wide
                            active={activeMenu === 1}
                        />
                    </Link>
                </Nav.Item>
                <Nav.Item>
                    <Link to="/cotizacion">
                        <StyledButton
                            label="Cotización"
                            variant={activeMenu === 2 ? 'brand' : 'base'}
                            onClick={() => setActiveMenu(2)}
                            wide
                            active={activeMenu === 2}
                        />
                    </Link>
                </Nav.Item>
                {!user && (
                    <Nav.Item>
                        <Link to="/login">
                            <StyledButton
                                label="Mi cuenta"
                                variant={activeMenu === 3 ? 'brand' : 'outline-brand'}
                                onClick={() => setActiveMenu(3)}
                                wide
                                active={activeMenu === 3}
                            />
                        </Link>
                    </Nav.Item>
                )}
                {/* {user && (
                    <Nav.Item>
                        <span style={{ verticalAlign: 'top', lineHeight: '42px' }}>MI CUENTA</span>
                        <StyledAvatarMenu
                            className="rainbow-m-horizontal_medium"
                            id="avatar-menu"
                            menuAlignment="right"
                            menuSize="small"
                            avatarSize="medium"
                            src={avatarURL}
                        >
                            <MenuItem
                                label="Configuración"
                                icon={
                                    <FontAwesomeIcon icon={faCog} style={{ color: 'goldenrod' }} />
                                }
                                onClick={configureClick}
                                iconPosition="left"
                            />
                            <MenuItem
                                label="Salir"
                                icon={
                                    <FontAwesomeIcon
                                        icon={faSignOutAlt}
                                        style={{ color: 'goldenrod' }}
                                    />
                                }
                                onClick={signOutClick}
                                iconPosition="left"
                            />
                        </StyledAvatarMenu>
                    </Nav.Item>
                )} */}
            </Nav>
        </StyledMain>
    );
};

export default Menu;

/*
<Nav className="justify-content-end" activeKey="/home">
    <Nav.Item>
      <Nav.Link href="/home">Active</Nav.Link>
    </Nav.Item>
    <Nav.Item>
      <Nav.Link eventKey="link-1">Link</Nav.Link>
    </Nav.Item>
    <Nav.Item>
      <Nav.Link eventKey="link-2">Link</Nav.Link>
    </Nav.Item>
    <Nav.Item>
      <Nav.Link eventKey="disabled" disabled>
        Disabled
      </Nav.Link>
    </Nav.Item>
  </Nav>
  */
