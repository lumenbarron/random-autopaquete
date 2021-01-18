import React, { useState, useEffect } from 'react';
import { useFirebaseApp } from 'reactfire';

import {
    Table,
    Column,
    Badge,
    MenuItem,
    Input,
    Button,
    RadioGroup,
    Textarea,
} from 'react-rainbow-components';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import { StyledUserEdit, StyledPanel } from './styled';
import formatMoney from 'accounting-js/lib/formatMoney.js';
import InfoGeneral from './info-general';
import HistoryUser from './historial/index';
import Credito from './credito';
import Tarifario from './tarifario';

const AdminUserEditPage = () => {
    const firebase = useFirebaseApp();
    const db = firebase.firestore();

    const history = useHistory();

    const { userId } = useParams();

    const [user, setUser] = useState(false);

    useEffect(() => {
        const reloadRecords = () => {
            db.collection('profiles')
                .where('ID', '==', userId)
                .onSnapshot(handleProfile);
        };
        reloadRecords();
    }, [userId]);

    function handleProfile(snapshot) {
        const data = snapshot.docs.map(doc => {
            let profile = {
                id: doc.id,
                status: doc.data().status ? doc.data().status : 'En Revisión',
                ...doc.data(),
            };
            return profile;
        });
        setUser(data[0]);
    }
    console.log('user');
    if (!user) return <div></div>;

    return (
        <StyledUserEdit>
            <div className="back">
                <h1>Usuarios</h1>

                <StyledPanel>
                    <InfoGeneral user={user} />
                </StyledPanel>

                <StyledPanel>
                    <Credito user={user} />
                </StyledPanel>

                <StyledPanel>
                    <Credito user={user} />
                </StyledPanel>

                <StyledPanel>
                    <HistoryUser user={user} />
                </StyledPanel>

                <StyledPanel>
                    <Tarifario user={user} />
                </StyledPanel>
            </div>
        </StyledUserEdit>
    );
};

export default AdminUserEditPage;
