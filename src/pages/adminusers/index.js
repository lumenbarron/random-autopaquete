import React, { useState, useEffect } from 'react';
import { useFirebaseApp } from 'reactfire';

import { Table, Column, Badge, MenuItem } from 'react-rainbow-components';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';
import { StyledAusers } from './styled';

const StyledTable = styled(Table)`
    color: #1de9b6;
`;

const StyledColumn = styled(Column)`
    color: #1de9b6;
`;

const StyledBadge = styled(Badge)`
    color: #09d3ac;
`;
const StatusBadge = ({ value }) => <StyledBadge label={value} variant="lightest" />;

const AdminUsersPage = () => {
    const firebase = useFirebaseApp();
    const db = firebase.firestore();

    const history = useHistory();

    const [users, setUsers] = useState([]);

    useEffect(() => {
        const reloadRecords = () => {
            db.collection('profiles').onSnapshot(handleProfiles);
        };
        reloadRecords();
    }, []);

    function handleProfiles(snapshot) {
        const data = snapshot.docs.map(doc => {
            let profile = {
                id: doc.id,
                fullname: doc.data().name + ' ' + doc.data().lastname,
                status: doc.data().status ? doc.data().status : 'En Revisión',
                ...doc.data(),
            };
            return profile;
        });
        setUsers(data);
    }

    function editUser(e, profile) {
        e.preventDefault();
        history.push('/admin/usuario/' + profile.ID);
        console.log(profile.ID);
    }

    return (
        <StyledAusers>
            <div className="back">
                <h1>Usuarios</h1>

                <div className="rainbow-p-bottom_xx-large">
                    <div>
                        <StyledTable pageSize={10} keyField="id" data={users} pageSize={10}>
                            <StyledColumn header="Nombre " field="fullname" />
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
                            </Column>
                        </StyledTable>
                    </div>
                </div>
            </div>
        </StyledAusers>
    );
};

export default AdminUsersPage;
