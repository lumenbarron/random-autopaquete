import React, { useState, useEffect } from 'react';
import { Column, Badge, TableWithBrowserPagination, Button } from 'react-rainbow-components';
import styled from 'styled-components';
import formatMoney from 'accounting-js/lib/formatMoney';
import { Row, Col } from 'react-bootstrap';
import { useFirebaseApp } from 'reactfire';
import { StyledPanel, StyleHeader } from './styled';
import ExportReactCSV from '../../dowloadData/index';

const StyledTable = styled(TableWithBrowserPagination)`
    td[data-label='Guía'] {
        > div {
            line-height: 1.2rem;
            > span {
                white-space: break-spaces;
                font-size: 12px;
            }
        }
    }
`;

export default function OverweightUser({ user }) {
    const firebase = useFirebaseApp();
    const db = firebase.firestore();
    const [history, setHistory] = useState([]);
    useEffect(() => {
        if (user) {
            let dataOverweights = [];
            db.collection('overweights')
                .where('ID', '==', user.ID)
                .orderBy('fecha', 'desc')
                .get()
                .then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        console.log(doc.data());
                        dataOverweights.push({
                            id: doc.id,
                            guide: doc.data().rastreo,
                            date: doc
                                .data()
                                .fecha.toDate()
                                .toLocaleDateString(),
                            kdeclared: doc.data().kilos_declarados,
                            kreal: doc.data().kilos_reales,
                            cadd: formatMoney(doc.data().cargo),
                        });
                    });
                    setHistory(dataOverweights);
                    console.log('sobrepesos', dataOverweights);
                })
                .catch(function(error) {
                    console.log('Error getting documents: ', error);
                });
        }
    }, []);

    return (
        <>
            <StyleHeader>
                <Row className="row-header">
                    <h2>Historial de sobrepesos</h2>
                    {/* <ExportReactCSV data={history} /> */}
                </Row>
            </StyleHeader>
            <div className="rainbow-p-bottom_large rainbow-p-top_large">
                <StyledPanel>
                    <StyledTable
                        data={history}
                        pageSize={10}
                        keyField="id"
                        emptyTitle="Oh no!"
                        emptyDescription="No hay ningun registro actualmente..."
                        className="direction-table"
                    >
                        <Column header="Número de Guía" field="guide" defaultWidth={250} />
                        <Column header="Fecha" field="date" />
                        <Column header="Kilos Cobrados" field="kdeclared" />
                        <Column header="Kilos reales" field="kreal" />
                        <Column header="Cargos Adicionales" field="cadd" />
                    </StyledTable>
                </StyledPanel>
            </div>
        </>
    );
}
