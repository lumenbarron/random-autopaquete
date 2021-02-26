import React, { useState, useEffect } from 'react';
import { Table, Column, Badge, TableWithBrowserPagination } from 'react-rainbow-components';
import { Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import formatMoney from 'accounting-js/lib/formatMoney';
import { StyledStatement, StatementContainer } from './style';
import { useFirebaseApp, useUser } from 'reactfire';
import ExportReactCSV from '../dowloadData/index';
const containerStyles = { height: 600 };
const containerTableStyles = { height: 256 };

// const StyledTable = styled(Table)`
//     color: #1de9b6;
// `;

const StyledColumn = styled(Column)`
    color: #1de9b6;
`;

const StyledBadge = styled(Badge)`
    color: #09d3ac;
`;
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

const StatementPage = () => {
    const firebase = useFirebaseApp();
    const db = firebase.firestore();
    const user = useUser();

    //const [overWeightData, setOverWeightData] = useState([]);

    useEffect(() => {
        const data = [];

        //Getting all the shippings
        db.collection('guia')
            .where('ID', '==', user.uid)
            .where('status', '==', 'completed')
            //.orderBy('creation_date', 'desc')
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    //console.log('data guias', doc.data().creation_date, 'doc.id', doc.id);
                    data.push({
                        id: doc.id,
                        concept: 'GUIA',
                        reference: doc.data().rastreo ? doc.data().rastreo[0] : 'error',
                        monto: parseFloat(doc.data().supplierData.Supplier_cost),
                        date: doc.data().creation_date.toDate(),
                    });
                });
                console.log('data', data);
                //setRecordsData(data);
            })
            .catch(function(error) {
                console.log('Error getting documents: ', error);
            });

        db.collection('voucher')
            .where('ID', '==', user.uid)
            //.orderBy('create_date', 'desc')
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    console.log('all vouchers', doc.data(), 'doc.id', doc.id);
                    data.push({
                        id: doc.id,
                        concept: doc.data().concepto ? doc.data().concepto : 's/c',
                        reference: doc.data().referencia ? doc.data().referencia : 's/r',
                        monto: parseFloat(doc.data().saldo),
                        date: new Date(doc.data().create_date),
                    });
                });
                // console.log('data', data)

                // const sortedData = data.sort((a, b) => b.date - a.date );
                // console.log(sortedData);
            })
            .catch(function(error) {
                console.log('Error getting documents: ', error);
            });

        db.collection('restCredit')
            .where('ID', '==', user.uid)
            //.orderBy('create_date', 'desc')
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    //console.log('all vouchers', doc.data().create_date, 'doc.id', doc.id);
                    data.push({
                        id: doc.id,
                        concept: doc.data().concepto,
                        reference: doc.data().referencia ? doc.data().referencia : 's/r',
                        monto: parseFloat(doc.data().saldo),
                        date: new Date(doc.data().create_date),
                    });
                });
                // console.log('data', data)

                // const sortedData = data.sort((a, b) => b.date - a.date );
                // console.log(sortedData);
            })
            .catch(function(error) {
                console.log('Error getting documents: ', error);
            });

        db.collection('overweights')
            .where('ID', '==', user.uid)
            //.orderBy('fecha', 'desc')
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    //console.log('all vouchers', doc.data().create_date, 'doc.id', doc.id);
                    data.push({
                        id: doc.id,
                        concept: 'SOBREPESO',
                        reference: doc.data().rastreo,
                        monto: parseFloat(doc.data().cargo),
                        date: doc.data().fecha.toDate(),
                    });
                });
                console.log('data', data);

                const sortedData = data.sort((a, b) => {
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                    // b.date - a.date
                });
                console.log(sortedData);
            })
            .catch(function(error) {
                console.log('Error getting documents: ', error);
            });

        // const reloadRecords = () => {
        //     db.collection('overweights')
        //         .where('ID', '==', user.uid)
        //         .onSnapshot(handleOverWeight);
        // };
        // reloadRecords();
    }, []);

    // function handleOverWeight(snapshot) {
    //     let overWeightSorted = [];
    //     const overWeightData = snapshot.docs.map(doc => {
    //         // console.log(doc.data());
    //         return {
    //             id: doc.id,
    //             ...doc.data(),
    //         };
    //     });
    //     overWeightSorted = overWeightData.sort((a, b) => b.fecha - a.fecha);
    //     setOverWeightData(overWeightSorted);
    // }

    // const data = overWeightData.map((overWeight, idx) => {
    //     return {
    //         id: overWeight.id,
    //         date: overWeight.fecha.toDate().toLocaleDateString()
    //             ? overWeight.fecha.toDate().toLocaleDateString()
    //             : 'sin fecha',
    //         guide: overWeight.rastreo,
    //         kdeclared: overWeight.kilos_declarados,
    //         kreal: overWeight.kilos_reales,
    //         Kcollected: overWeight.kilos_reales - overWeight.kilos_declarados,
    //         charge: formatMoney(overWeight.cargo),
    //     };
    // });

    return (
        <StyledStatement>
            <StatementContainer>
                <Row className="row-header">
                    <h1>Mis movimientos</h1>
                    {/* <ExportReactCSV data={recordsData} /> */}
                </Row>
                {/* <div className="back">
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
            </div> */}
            </StatementContainer>
        </StyledStatement>
    );
};

export default StatementPage;
