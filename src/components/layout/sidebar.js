import React, { useState, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Sidebar, SidebarItem, Avatar } from 'react-rainbow-components';
import styled, { keyframes } from 'styled-components';
import { useFirebaseApp, useUser } from 'reactfire';
import { useRegularSecurity } from '../../hooks/useRegularSecurity';
import { useSecurity } from '../../hooks/useSecurity';
import * as firebase from 'firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faTimes, faBars } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import moduleName from 'module';

// TODO: CAMBIAR ESTO EN CUANTO LIBEREN LA VERSION FINAL DE FileSelector
import FileSelector from '../../components/react-rainbow-beta/components/FileSelector';

Modal.setAppElement('#root');

const slideOutAnimation = keyframes`
  from {
    margin-left:0;
  }

  to {
    margin-left:-350px;
  }
`;

const slideInAnimation = keyframes`
  from {
    margin-left:-350px;
  }

  to {
    margin-left:0px;
  }
`;

const SideBarContainer = styled.div.attrs(props => {
    return props.theme.rainbow.palette;
})`
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #fff;
    z-index: 99999;
    padding-bottom: 14px;
    padding-top: 14px;
    background: ${props => props.background.main};
    background-image: url(${props => props.backImg});
    background-size: cover;
    background-position-x: -2em;
    background-position-y: 0em;
    background-repeat: no-repeat;
    width: 20%;
    border-bottom-left-radius: 0.875rem;
    max-width: 350px;
    min-width: 150px;
    flex: 1 1;

    @media (max-width: 768px) {
        margin-left: -350px;
    }

    &.hide {
        animation: ${slideOutAnimation} 0.3s cubic-bezier(0.55, 0.085, 0.68, 0.53) both;
    }

    &.show {
        animation: ${slideInAnimation} 0.3s cubic-bezier(0.55, 0.085, 0.68, 0.53) both;
    }
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
    background: #fff;
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

const CameraIcon = styled(FontAwesomeIcon)`
    top: 1.6rem;
    position: relative;
    right: 1.2rem;
    background: gainsboro;
    padding: 5px;
    width: 24px !important;
    height: 24px;
    border-radius: 50%;
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

const StyledSubmit = styled.button.attrs(props => {
    return props.theme.rainbow.palette;
})`
    background-color: #ab0000;
    border: none;
    border-radius: 25px;
    padding: 0.5rem 2rem;
    color: white;

    &:hover {
        background-color: #c94141;
        color: white;
    }
`;

const SidebarResponsiveBars = styled(FontAwesomeIcon)`
    padding: 10px;
    width: 48px !important;
    height: 48px;
    background: crimson;
    color: white;
    border-radius: 0 10px 10px 0;
    position: absolute;
    left: 0;
    z-index: 9;

    @media (min-width: 769px) {
        display: none;
    }
`;

export function AccountSidebar() {
    const firebase = useFirebaseApp();
    const user = useUser();
    const history = useHistory();
    const location = useLocation();
    const [avatar, setAvatar] = useState();
    const [avatarURL, setAvatarURL] = useState('');
    const [avatarName, setAvatarName] = useState('');

    const [modalIsOpen, setIsOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(null);
    const [containerClassName, setContainerClassName] = useState(
        'rainbow-p-top_small rainbow-p-bottom_medium',
    );

    const storageRef = firebase.storage();
    const db = firebase.firestore();

    useEffect(() => {
        if (sidebarOpen) {
            setContainerClassName(containerClassName => containerClassName.replace('show', 'hide'));
            setSidebarOpen(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    const logout = async e => {
        e.preventDefault();
        await firebase.auth().signOut();
        history.push('/');
    };

    const changeAvatar = () => {
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const toggleSidebar = e => {
        if (sidebarOpen === null) {
            setContainerClassName(containerClassName + ' show');
            setSidebarOpen(true);
            return;
        }
        if (sidebarOpen) {
            setContainerClassName(containerClassName.replace('show', 'hide'));
            setSidebarOpen(false);
            return;
        }
        if (!sidebarOpen) {
            setContainerClassName(containerClassName.replace('hide', 'show'));
            setSidebarOpen(true);
            return;
        }
    };

    const saveAvatar = url => {
        if (user) {
            const docRef = db.collection('profiles').where('ID', '==', user.uid);
            docRef.get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    const DocRef = doc.id;
                    const userData = {
                        avatar: url,
                    };
                    const profilesCollectionAdd = db
                        .collection('profiles')
                        .doc(DocRef)
                        .update(userData);

                    profilesCollectionAdd
                        .then(function() {
                            console.log('Document successfully written!');
                            setAvatarURL(url);
                        })
                        .catch(function(error) {
                            console.error('Error writing document: ', error);
                        });
                });
            });
        }
    };

    const saveURL = () => {
        storageRef
            .ref(`avatar/${user.uid}`)
            .child(avatar[0].name)
            .getDownloadURL()
            .then(function(url) {
                saveAvatar(url);
            });
    };

    const updateAvatar = () => {
        let fileName = '';
        let filePath = '';

        if (avatar) {
            fileName = avatar[0].name;
            filePath = `avatar/${user.uid}/${fileName}`;
            firebase
                .storage()
                .ref(filePath)
                .put(avatar[0])
                .then(snapshot => {
                    saveURL();
                });
        }
    };
    useEffect(() => {
        if (user) {
            const docRef = db.collection('profiles').where('ID', '==', user.uid);

            docRef.get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    setAvatarURL(doc.data().avatar);
                    setAvatarName(doc.data().name);
                });
            });
        }
    }, [user]);

    useRegularSecurity();

    return (
        <SideBarContainer className={containerClassName}>
            <SidebarResponsiveBars icon={faBars} onClick={toggleSidebar} />
            <SidebarHeader>
                <Link to="/">
                    <Logo src="/assets/logo.png" />
                </Link>
                <div
                    style={{ position: 'relative', left: '12px', cursor: 'pointer' }}
                    onClick={changeAvatar}
                >
                    <StyledAvatar
                        src={avatarURL}
                        icon={<UserAvatarIcon style={{ cursor: 'pointer' }} />}
                        assistiveText={avatarName}
                        title={avatarName}
                        size="large"
                    />
                    <CameraIcon icon={faCamera} />
                </div>
                <Status>Activado</Status>
                <h5>Créditos</h5>
                <Link to="/mi-cuenta">
                    <AddCreditButton>Agregar</AddCreditButton>
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
                <Link to="/" style={{ display: 'block' }} onClick={logout}>
                    <StyledSidebarItem
                        icon={<img src="/assets/icon-exit.png" alt="icon-exit.png" />}
                        name="Cerrar sesión"
                        label="Cerrar sesión"
                    />
                </Link>
            </StyledSidebar>
            <Modal
                isOpen={modalIsOpen}
                contentLabel="Example Modal"
                style={{
                    overlay: {
                        backgroundColor: 'rgba(100,100,100,0.5)',
                    },
                    content: {
                        width: 'fit-content',
                        height: 'fit-content',
                        margin: 'auto',
                        padding: '2rem',
                        borderRadius: '0.875rem',
                        color: 'crimson',
                        boxShadow: '0px 0px 16px -4px rgba(0, 0, 0, 0.75)',
                        fontFamily: "'Montserrat','sans-serif'",
                        textAlign: 'center',
                    },
                }}
            >
                <h2 style={{ fontSize: '1.5rem', textAlign: 'center' }}>Cambia tu imagen</h2>
                <button
                    onClick={closeModal}
                    style={{
                        border: 'none',
                        background: 'none',
                        float: 'right',
                        marginTop: '-3rem',
                        marginRight: '-1rem',
                    }}
                >
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                <FileSelector
                    className="rainbow-p-horizontal_medium rainbow-m-vertical_large"
                    label="Foto de perfil"
                    placeholder="Sube o arrastra tu archivo aquí"
                    onChange={setAvatar}
                />
                <StyledSubmit
                    type="submit"
                    onClick={e => {
                        closeModal();
                        updateAvatar();
                    }}
                >
                    Continuar
                </StyledSubmit>
            </Modal>
        </SideBarContainer>
    );
}

export function AdminSidebar() {
    const firebase = useFirebaseApp();
    const history = useHistory();

    const logout = async e => {
        e.preventDefault();
        await firebase.auth().signOut();
        history.push('/');
    };

    useSecurity();

    return (
        <SideBarContainer
            className="rainbow-p-top_small rainbow-p-bottom_medium"
            //backImg="/assets/redbox-2.png"
        >
            <SidebarHeader>
                <Logo src="/logo-admin.png" />
                <h5 style={{ color: '#fff' }}>Administrador</h5>
                <Link to="/" style={{ display: 'block' }} onClick={logout}>
                    Cerrar sesión
                </Link>
            </SidebarHeader>
            <StyledSidebar>
                <Link to="/admin/usuarios">
                    <StyledSidebarItem
                        icon={<img src="/assets/admin-users.png" alt="" />}
                        name="Usuarios"
                        label="Usuarios"
                    />
                </Link>
                <Link to="/admin/sobrepesos">
                    <StyledSidebarItem
                        icon={<img src="/assets/icon-overweight.png" alt="" />}
                        name="Sobrepeso"
                        label="Sobrepeso"
                    />
                </Link>
            </StyledSidebar>
        </SideBarContainer>
    );
}
