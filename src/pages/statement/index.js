import React, { useState, useEffect } from 'react';
import { Table, Column, Badge, TableWithBrowserPagination } from 'react-rainbow-components';
import { Row, Col } from 'react-bootstrap';
import styled from 'styled-components';
import formatMoney from 'accounting-js/lib/formatMoney';
import { StyledStatement, StatementContainer } from './style';
import { useFirebaseApp, useUser } from 'reactfire';
import ExportReactStatementCSV from '../dowloadData/statement';
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

const StyledBadgeRed = styled(Badge)`
    color: #c94141; 003066
`;

const StyledBadgeOrange = styled(Badge)`
    color: orange;
`;

const StatusBadge = ({ value }) => {
    let valueBadge;

    if (value === 'Carga de saldo' || value === 'Reembolso por guía') {
        valueBadge = <StyledBadge label={value} variant="lightest" />;
    } else if (value === 'Sobrepeso') {
        valueBadge = <StyledBadgeOrange label={value} variant="lightest" />;
    } else {
        valueBadge = <StyledBadgeRed label={value} variant="lightest" />;
    }
    return <>{valueBadge}</>;
};

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

    const [statementData, setStatementData] = useState([]);
    const [creditAmount, setCreditAmount] = useState();

    const optionsDate = { year: '2-digit', month: '2-digit', day: '2-digit' };

    useEffect(() => {
        if (user) {
            const docRef = db.collection('profiles').where('ID', '==', user.uid);

            const cancelSnapshot = docRef.onSnapshot(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    if (doc.data().saldo < 0) {
                        setCreditAmount(0);
                    } else {
                        setCreditAmount(doc.data().saldo);
                    }
                });
            });

            return cancelSnapshot;
        }

        return null;
    }, [creditAmount]);

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
                        concept: 'Guia',
                        reference: doc.data().rastreo ? doc.data().rastreo[0] : 'error',
                        monto: doc.data().rastreo
                            ? parseFloat(doc.data().supplierData.Supplier_cost)
                            : 0,
                        date: doc.data().creation_date.toDate(),
                        saldo: 0,
                    });
                });
                //console.log('data', data);
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
                    //console.log('all vouchers', doc.data().concepto, 'doc.id', doc.id);
                    data.push({
                        id: doc.id,
                        concept: doc.data().concepto,
                        reference: doc.data().referencia ? doc.data().referencia : 's/r',
                        monto: parseFloat(doc.data().saldo),
                        date: new Date(doc.data().create_date),
                        saldo: 0,
                    });
                });
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
                    console.log(
                        'restCredit',
                        doc.data().concepto,
                        'doc.id',
                        doc.id,
                        'date',
                        doc.data().create_date,
                    );
                    data.push({
                        id: doc.id,
                        concept: doc.data().concepto,
                        reference: doc.data().referencia ? doc.data().referencia : 's/r',
                        monto: parseFloat(doc.data().saldo),
                        date: new Date(doc.data().create_date.replace(/-/g, '/')),
                        saldo: 0,
                    });
                    console.log({
                        id: doc.id,
                        concept: doc.data().concepto,
                        reference: doc.data().referencia ? doc.data().referencia : 's/r',
                        monto: parseFloat(doc.data().saldo),
                        date: new Date(doc.data().create_date.replace(/-/g, '/')),
                        saldo: 0,
                    });
                });
            })
            .catch(function(error) {
                console.log('Error getting documents: ', error);
            });

        db.collection('statement')
            .where('ID', '==', user.uid)
            //.orderBy('create_date', 'desc')
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    //console.log('statement', doc.data().concepto, 'doc.id', doc.id);
                    data.push({
                        id: doc.id,
                        concept: doc.data().concepto,
                        reference: doc.data().referencia ? doc.data().referencia : 's/r',
                        monto: parseFloat(doc.data().saldo),
                        date: new Date(doc.data().create_date),
                        saldo: parseFloat(doc.data().saldo),
                    });
                });
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
                    //console.log('all vouchers', doc.data().fecha, 'doc.id', doc.id);
                    data.push({
                        id: doc.id,
                        concept: 'Sobrepeso',
                        reference: doc.data().rastreo,
                        monto: parseFloat(doc.data().cargo),
                        date: doc.data().fecha.toDate(),
                        saldo: 0,
                    });
                });

                const sortedData = data.sort((a, b) => {
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                });
                //console.log(sortedData);
                console.log('data', sortedData);
                makingOperations(sortedData);
            })
            .catch(function(error) {
                console.log('Error getting documents: ', error);
            });
    }, []);

    const makingOperations = data => {
        let newStatement;

        let startStatement = data[0].monto;
        //console.log(startStatement);

        data[0].saldo = startStatement;
        //console.log(data[0]);

        data.map((da, index) => {
            //console.log(da.id, index, 'saldo actual', da.saldo);
            if (index > 0) {
                //console.log('saldo anterior', data[index - 1].saldo);
                let prevSaldo = data[index - 1].saldo;
                if (
                    da.concept === 'Guia' ||
                    da.concept === 'Sobrepeso' ||
                    da.concept === 'DSM' ||
                    da.concept === 'GSSL' ||
                    da.concept === 'RV'
                ) {
                    newStatement = prevSaldo - da.monto;
                    data[index].saldo = newStatement;
                }
                if (da.concept === 'CDS' || da.concept === 'RGNU' || da.concept === 'RSP') {
                    newStatement = prevSaldo + da.monto;
                    data[index].saldo = newStatement;
                }
                if (da.concept === 'CM') {
                    data[index].saldo = da.saldo;
                }
            }
        });

        //console.log(data);
        setStatementData(data);
    };

    const data = statementData.reverse().map((statement, idx) => {
        let concepto;
        if (statement.concept === 'DSM') {
            concepto = 'Saldo por Morosidad';
        } else if (statement.concept === 'GSSL') {
            concepto = 'Guias Solicitadas';
        } else if (statement.concept === 'RV') {
            concepto = 'Recargo Varios';
        } else if (statement.concept === 'CDS') {
            concepto = 'Carga de saldo';
        } else if (statement.concept === 'RGNU') {
            concepto = 'Reembolso por guía';
        } else if (statement.concept === 'RSP') {
            concepto = 'Reembolso por sobrepeso';
        } else if (statement.concept === 'CM') {
            concepto = 'Corte Movimientos';
        } else {
            concepto = statement.concept;
        }
        console.log({
            id: statement.id,
            concept: concepto,
            date: statement.date,
            reference: statement.reference,
            monto: statement.monto.toFixed(2),
            saldo: statement.saldo.toFixed(2),
        });
        return {
            id: statement.id,
            concept: concepto,
            date: statement.date.toLocaleDateString(),
            reference: statement.reference,
            monto: statement.monto.toFixed(2),
            saldo: statement.saldo.toFixed(2),
        };
    });

    return (
        <StyledStatement>
            <StatementContainer>
                <Row className="row-header">
                    <h1>Mis movimientos</h1>
                    <ExportReactStatementCSV data={statementData} />
                </Row>
                <div className="back">
                    <div className="rainbow-p-bottom_xx-large">
                        <div style={containerStyles}>
                            <StyledTable
                                // pageSize={30}
                                data={data}
                                keyField="id"
                                emptyTitle="Oh no!"
                                emptyDescription="No hay ningun registro actualmente..."
                            >
                                <StyledColumn
                                    header="Concepto"
                                    field="concept"
                                    defaultWidth={250}
                                    component={StatusBadge}
                                />
                                <StyledColumn header="Fecha " field="date" defaultWidth={150} />
                                <StyledColumn header="Reference" field="reference" />
                                <StyledColumn header="Monto" field="monto" />
                                <StyledColumn header="Saldo" field="saldo" />
                            </StyledTable>
                        </div>
                    </div>
                </div>
                <Row className="row-header">
                    <h2>Mi Saldo: {formatMoney(creditAmount, 2)}</h2>
                </Row>
            </StatementContainer>
        </StyledStatement>
    );
};

export default StatementPage;
