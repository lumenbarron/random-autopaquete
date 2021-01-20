import React, { useState, useEffect } from 'react';
import { useFirebaseApp } from 'reactfire';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import { StyledUserEdit, StyledPanel } from './styled';
import formatMoney from 'accounting-js/lib/formatMoney.js';
import InfoGeneral from './info-general';
import HistoryUser from './historial/index';
import OverweightUser from './historial/overweight';
import Credito from './credito/index';
import RestCredito from './credito/restCredit';
import AddCredito from './credito/addCredit';
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
                    <RestCredito user={user} />
                </StyledPanel>

                <StyledPanel>
                    <AddCredito user={user} />
                </StyledPanel>

                <StyledPanel>
                    <HistoryUser user={user} />
                </StyledPanel>

                <StyledPanel>
                    <OverweightUser user={user} />
                </StyledPanel>

                <StyledPanel>
                    <Tarifario user={user} />
                </StyledPanel>
            </div>
        </StyledUserEdit>
    );
};

export default AdminUserEditPage;
