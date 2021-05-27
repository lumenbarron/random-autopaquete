import React, { useState, useEffect } from 'react';
import { useFirebaseApp, useUser } from 'reactfire';

import { Table, Column, Badge, MenuItem, Button } from 'react-rainbow-components';
import styled from 'styled-components';
import Row from 'react-bootstrap/Row';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Link, useHistory } from 'react-router-dom';
import { StyledAusers } from './styled';
import firebase from 'firebase';
import 'firebase/auth';

const StyledTable = styled(Table)`
    color: #1de9b6;
`;

const StyledColumn = styled(Column)`
    color: #1de9b6;
`;

const StyledBadge = styled(Badge)`
    color: #09d3ac;
`;

const StyledBadgeRed = styled(Badge)`
    color: #c94141;
`;
const StatusBadge = ({ value }) => {
    return (
        <>
            {value === 'Aprobado' ? (
                <StyledBadge label={value} variant="lightest" />
            ) : (
                <StyledBadgeRed label={value} variant="lightest" />
            )}
        </>
    );
};

const AdminUsersPage = () => {
    const firebase = useFirebaseApp();
    const db = firebase.firestore();
    const user = useUser();

    const history = useHistory();

    const [users, setUsers] = useState([]);
    const [emails, setEmails] = useState([]);
    const [loaded, setLoaded] = useState(false);

    // Sincroniza los usuarios de los perfiles con los emails del google auth
    useEffect(() => {
        // Si no tenemos usuarios, no tenemos correos o estamos sincronizados, nada que hacer.
        if (users.length == 0 || emails.length == 0 || loaded) return;

        const modifiedUsers = [...users];
        emails.forEach(emailData => {
            const idx = users.findIndex(obj => obj['ID'] === emailData['uid']);
            if (idx >= 0) {
                modifiedUsers[idx].email = emailData['email'];
            }
        });

        setUsers(modifiedUsers);
        setLoaded(true);
    }, [loaded, users, emails]);

    // Obtiene los emails con la función cloud, que requiere un idToken de un admin
    useEffect(() => {
        let cancelXHR = false;
        user.getIdToken().then(idToken => {
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'json';
            xhr.onload = function(event) {
                if (cancelXHR) {
                    return;
                }

                setEmails(xhr.response ? xhr.response : []);
                setLoaded(false);
            };
            xhr.open('GET', '/admin/getEmails');
            xhr.setRequestHeader('Authorization', 'Bearer ' + idToken);
            xhr.send();
        });
        return () => {
            cancelXHR = true;
        };
    }, [user]);

    useEffect(() => {
        const reloadRecords = () => {
            db.collection('profiles').onSnapshot(handleProfiles);
        };
        reloadRecords();
    }, []);

    function handleProfiles(snapshot) {
        const data = snapshot.docs.map(doc => {
            console.log(doc.id, doc.data().razon_social);
            let profile = {
                id: doc.id,
                fullname: doc.data().name + ' ' + doc.data().lastname,
                status: doc.data().status ? doc.data().status : 'En Revisión',
                ...doc.data(),
            };
            return profile;
        });
        //console.log('data', data);
        const sorted = data.sort((a, b) => a.fullname.localeCompare(b.fullname));
        console.log('sorted', sorted);
        setUsers(sorted);
        setLoaded(false);
    }

    function editUser(e, profile) {
        e.preventDefault();
        // console.log(profile.ID);
        history.push('/admin/usuario/' + profile.ID);
    }

    // function deleteUser(e, profile) {
    //     e.preventDefault();

    //     firebase
    //         .auth()
    //         .delete(profile.ID)
    //         .then(function() {
    //             db.collection('profiles')
    //                 .doc(profile.id)
    //                 .delete()
    //                 .then(function() {})
    //                 .catch(function(error) {
    //                     console.error('Error: ', error);
    //                 });
    //         })
    //         .catch(function(error) {
    //             console.log('Error eliminando al usuario:', error);
    //         });
    // }

    return (
        <StyledAusers>
            <div className="back">
                <Row className="content-header">
                    <h1 id="header-margin">Usuarios</h1>
                </Row>
                <div className="rainbow-p-bottom_xx-large">
                    <div>
                        <StyledTable
                            pageSize={10}
                            keyField="id"
                            data={users}
                            pageSize={10}
                            emptyTitle="Oh no!"
                            emptyDescription="No hay ningun registro actualmente..."
                        >
                            <StyledColumn header="Nombre " field="fullname" defaultWidth={360} />
                            <StyledColumn header="Status" field="status" component={StatusBadge} />
                            <StyledColumn header="Crédito disponible" field="saldo" />
                            <StyledColumn header="Correo" field="email" />
                            <StyledColumn header="Comentarios" field="comments" />
                            <Column type="action">
                                <MenuItem
                                    label="Modificar"
                                    icon={<FontAwesomeIcon icon={faUserEdit} />}
                                    iconPosition="left"
                                    onClick={editUser}
                                />
                                {/* <MenuItem
                                    label="Eliminar"
                                    icon={<FontAwesomeIcon icon={faTrashAlt} />}
                                    iconPosition="left"
                                    onClick={deleteUser}
                                /> */}
                            </Column>
                        </StyledTable>
                    </div>
                </div>
            </div>
        </StyledAusers>
    );
};

export default AdminUsersPage;
