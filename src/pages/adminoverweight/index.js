import React, { useState, useEffect } from 'react';

import { Table, Column, Input, Button, FileSelector } from 'react-rainbow-components';
import styled from 'styled-components';

import { StyledAdminoverweight } from './styled';

import { useFirebaseApp } from 'reactfire';

const StyledTable = styled(Table)`
    color: #1de9b6;
`;

const StyledColumn = styled(Column)`
    color: #1de9b6;
`;

const AdminOverweightPage = () => {
    const firebase = useFirebaseApp();
    const db = firebase.firestore();

    const [guia, setGuia] = useState();
    const [userId, setUserId] = useState();
    const [name, setName] = useState('');
    const [date, setDate] = useState();
    const [kgDeclarados, setKgdeclarados] = useState();
    const [realKg, setRealKg] = useState();
    const [charge, setCharge] = useState();
    const [docId, setDocId] = useState();
    const creationDate = new Date();

    useEffect(() => {
        if (!guia) {
            console.log('Este valor tiene que tener la guía');
        } else {
            const docRef = db.collection('guia').doc(guia);

            docRef
                .get()
                .then(function(doc) {
                    if (doc.exists) {
                        setDocId(doc.id);
                        setName(doc.data().name);
                        setUserId(doc.data().ID);
                        setDate(doc.data().creation_date);
                        setKgdeclarados(doc.data().package.weight);
                    } else {
                        // doc.data() will be undefined in this case
                        console.log('No such document!');
                    }
                })
                .catch(function(error) {
                    console.log('Error getting document:', error);
                });
            console.log('Vamos a mostrar los datos del usuario');
        }
    }, [guia]);

    const addOverWeight = () => {
        const addOverWeightData = {
            ID: userId,
            usuario: name,
            cargo: charge,
            fecha: creationDate.toLocaleDateString(),
            guia,
            kilos_declarados: kgDeclarados,
            kilos_reales: realKg,
        };

        db.collection('overweights')
            .add(addOverWeightData)
            .then(function(docRef) {
                console.log('Document written with ID (origen): ', docRef.id);
            })
            .catch(function(error) {
                console.error('Error adding document: ', error);
            });
    };

    return (
        <StyledAdminoverweight>
            <div className="back">
                <h1>Sobrepeso</h1>

                <div className="rainbow-m-vertical_medium">
                    <h5>Agregar Sobrepeso</h5>
                    <div className="rainbow-flex rainbow-flex_wrap rainbow-flex_row">
                        <Input
                            id="guia"
                            label="Numero de guia"
                            className="rainbow-p-around_medium"
                            style={{ flex: '1 1' }}
                            onChange={ev => setGuia(ev.target.value)}
                        />
                        <Input
                            id="usuario"
                            label="Usuario"
                            value={name}
                            className="rainbow-p-around_medium"
                            style={{ flex: '1 1' }}
                            readOnly
                        />
                        <Input
                            id="fecha"
                            label="Fecha"
                            value={date}
                            className="rainbow-p-around_medium"
                            style={{ flex: '1 1' }}
                            readOnly
                        />
                        <Input
                            id="kgs"
                            label="Kgs Declarados"
                            value={kgDeclarados}
                            className="rainbow-p-around_medium"
                            style={{ flex: '1 1' }}
                            readOnly
                        />
                        <Input
                            id="kgsReales"
                            label="Kgs Reales"
                            className="rainbow-p-around_medium"
                            value={realKg}
                            style={{ flex: '1 1' }}
                            onChange={ev => setRealKg(ev.target.value)}
                        />
                        <Input
                            id="cargo"
                            label="Cargo"
                            value={charge}
                            className="rainbow-p-around_medium"
                            style={{ flex: '1 1' }}
                            readOnly
                        />
                        <div style={{ flex: '1 1 100%', height: '0' }}></div>
                        <FileSelector
                            className="rainbow-p-horizontal_medium rainbow-m_auto"
                            label="Archivo XLS de Sobrepesos"
                            placeholder="Sube o arrastra tu archivo aquí"
                            style={{ flex: '1 1 50%' }}
                        />
                        <Button
                            label="Confirmar"
                            style={{ flex: '1 1 50%' }}
                            onClick={addOverWeight}
                        />
                    </div>
                </div>

                <div className="rainbow-p-bottom_xx-large">
                    <div>
                        <StyledTable
                            pageSize={10}
                            keyField="id"
                            emptyTitle="Oh no!"
                            emptyDescription="No hay ningun registro actualmente..."
                        >
                            <StyledColumn header="Número de Guía" field="guide" />
                            <StyledColumn header="Usuario" field="user" />
                            <StyledColumn header="Fecha " field="date" />
                            <StyledColumn header="Kilos Declarados" field="kdeclared" />
                            <StyledColumn header="Kilos reales" field="kreal" />
                            <StyledColumn header="Cargos Adicionales" field="cadd" />
                        </StyledTable>
                    </div>
                </div>
            </div>
        </StyledAdminoverweight>
    );
};

export default AdminOverweightPage;
