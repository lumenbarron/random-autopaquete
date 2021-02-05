import React, { useState, useEffect } from 'react';

import { Table, Column } from 'react-rainbow-components';
import styled from 'styled-components';

import formatMoney from 'accounting-js/lib/formatMoney';

import { StyledOverweight } from './styled';

import { useFirebaseApp, useUser } from 'reactfire';

const containerStyles = { height: 600 };
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
        let overWeightSorted = [];
        const overWeightData = snapshot.docs.map(doc => {
            // console.log(doc.data());
            return {
                id: doc.id,
                ...doc.data(),
            };
        });
        overWeightSorted = overWeightData.sort((a, b) => b.fecha - a.fecha);
        setOverWeightData(overWeightSorted);
    }

    const data = overWeightData.map((overWeight, idx) => {
        return {
            id: overWeight.id,
            date: overWeight.fecha.toDate().toLocaleDateString()
                ? overWeight.fecha.toDate().toLocaleDateString()
                : 'sin fecha',
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
                            emptyTitle="Oh no!"
                            emptyDescription="No hay ningun registro actualmente..."
                        >
                            <StyledColumn header="Fecha " field="date" defaultWidth={150} />
                            <StyledColumn header="Guía" field="guide" defaultWidth={250} />
                            <StyledColumn header="Kg cobrados" field="kdeclared" />
                            <StyledColumn header="Kg reales" field="kreal" />
                            <StyledColumn header="Sobrepeso" field="Kcollected" />

                            <StyledColumn header="Cargos" field="charge" />
                        </StyledTable>
                    </div>
                </div>
            </div>
        </StyledOverweight>
    );
};

export default OverweightPage;
