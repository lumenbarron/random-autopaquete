import React, { useState, useEffect } from 'react';

import { Table, Column } from 'react-rainbow-components';
import styled from 'styled-components';

import formatMoney from 'accounting-js/lib/formatMoney';

import { StyledOverweight } from './styled';

import { useFirebaseApp, useUser } from 'reactfire';

const containerStyles = { height: 312 };
const containerTableStyles = { height: 256 };

const StyledTable = styled(Table)`
    color: #1de9b6;
`;

const StyledColumn = styled(Column)`
    color: #1de9b6;
`;

const OverweightPage = () => {
    const firebase = useFirebaseApp();
    const db = firebase.firestore();
    const user = useUser();

    const [overWeightData, setOverWeightData] = useState([]);

    useEffect(() => {
        const reloadRecords = () => {
            db.collection('overweights')
                .where('ID', '==', user.uid)
                .onSnapshot(handleOverWeight);
        };
        reloadRecords();
    }, []);

    function handleOverWeight(snapshot) {
        const overWeightData = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data(),
            };
        });
        setOverWeightData(overWeightData);
    }

    const data = overWeightData.map((overWeight, idx) => {
        console.log(overWeight);
        return {
            date: overWeight.fecha,
            guide: overWeight.rastreo,
            kdeclared: overWeight.kilos_declarados,
            kreal: overWeight.kilos_reales,
            Kcollected: overWeight.kilos_reales - overWeight.kilos_declarados,
            charge: formatMoney(overWeight.cargo),
        };
    });

    return (
        <StyledOverweight>
            <div className="back">
                <h1>Sobrepeso</h1>

                <div className="rainbow-p-bottom_xx-large">
                    <div style={containerStyles}>
                        <StyledTable
                            pageSize={10}
                            data={data}
                            keyField="id"
                            style={containerTableStyles}
                            emptyTitle="Oh no!"
                            emptyDescription="No hay ningun registro actualmente..."
                        >
                            <StyledColumn header="Fecha " field="date" />
                            <StyledColumn header="Paquete (Guía)" field="guide" />
                            <StyledColumn header="Kilos Declarados" field="kdeclared" />
                            <StyledColumn header="Kilos reales" field="kreal" />
                            <StyledColumn header="Kilos cobrados" field="Kcollected" />

                            <StyledColumn header="Cargos" field="charge" />
                        </StyledTable>
                    </div>
                </div>
            </div>
        </StyledOverweight>
    );
};

export default OverweightPage;
