import React, { useState, useEffect, useRef } from 'react';
import { Input, Button, Table, Column, TableWithBrowserPagination } from 'react-rainbow-components';
import formatMoney from 'accounting-js/lib/formatMoney';
import styled from 'styled-components';
import * as firebase from 'firebase';
import swal from 'sweetalert2';

const numberRegex = RegExp(/^[0-9]+$/);

const StyledPanel = styled.div`
    box-shadow: 0px 0px 16px -4px rgba(0, 0, 0, 0.75);
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

const StyledColumn = styled(Column)`
    color: #1de9b6;
`;

export default function RestCredito({ user }) {
    const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
    const [monto, setMonto] = useState('');
    const [concepto, setConcepto] = useState('');
    const [password, setPassword] = useState('');
    const rightPass = useRef(false);

    const [saldoActual, setSaldoActual] = useState();
    const [voucherData, setVouncherData] = useState([]);
    const [docRef, setDocRef] = useState();

    const passJulio = process.env.REACT_APP_KEY_JA;
    const passJoce = process.env.REACT_APP_KEY_JG;
    const passCitlaly = process.env.REACT_APP_KEY_CL;
    const passBlanca = process.env.REACT_APP_KEY_BG;
    const passJose = process.env.REACT_APP_KEY_GJ;
    const passLucy = process.env.REACT_APP_KEY_LM;

    //console.log(passJulio, passJoce,passCitlaly, passBlanca,passJose, passLucy)

    const db = firebase.firestore();
    const userData = db.collection('profiles').where('ID', '==', user.ID);

    const montoTotal = parseInt(saldoActual) - parseInt(monto);
    //console.log('montoTotal', montoTotal, 'monto', monto, 'saldoActual', saldoActual);
    userData.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            setDocRef(doc.id);
            setSaldoActual(doc.data().saldo);
        });
    });

    const updateSaldo = docRef => {
        console.log(docRef);
        if (user) {
            console.log('montoTotal', montoTotal);
            const profilesCollectionAdd = db
                .collection('profiles')
                .doc(docRef)
                .update({ saldo: montoTotal });

            profilesCollectionAdd
                .then(function() {
                    console.log('Document successfully written!');
                })
                .catch(function(error) {
                    console.error('Error writing document: ', error);
                });
        }
    };

    useEffect(() => {
        const reloadVoucher = () => {
            db.collection('restCredit')
                .where('ID', '==', user.ID)
                .onSnapshot(handleVouncher);
        };
        reloadVoucher();
    }, []);

    function handleVouncher(snapshot) {
        const voucherData = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data(),
            };
        });
        setVouncherData(voucherData);
    }

    const inforTransacciones = voucherData.map((voucher, idx) => {
        //console.log('voucherData', voucherData);
        return {
            id: voucher.id,
            date: voucher.create_date,
            monto: formatMoney(voucher.saldo, 2),
            concepto: voucher.concepto,
            autor: voucher.autor,
        };
    });

    const restCredit = () => {
        let autor;
        console.log('monto', monto, 'concepto', concepto, 'password', password);

        if (password === passJulio) {
            autor = 'Julio Arroyo';
            rightPass.current = true;
            console.log('autor', autor);
        }
        if (password === passJoce) {
            autor = 'Jocelyn Guillen';
            rightPass.current = true;
            console.log('autor', autor);
        }
        if (password === passCitlaly) {
            autor = 'Citlaly Lara';
            rightPass.current = true;
            console.log('autor', autor);
        }
        if (password === passBlanca) {
            autor = 'Blanca Gzl';
            rightPass.current = true;
            console.log('autor', autor);
        }
        if (password === passJose) {
            autor = 'José García';
            rightPass.current = true;
            console.log('autor', autor);
        }
        if (password === passLucy) {
            autor = 'Lucy Mendez';
            rightPass.current = true;
            console.log('autor', autor);
        }
        if (monto.trim() === '' || !numberRegex.test(monto)) {
            swal.fire('¡Oh no!', 'Parece que no hay un monto válido, favor de verificar', 'error');
        } else if (concepto.trim() === '' || !concepto) {
            swal.fire('¡Oh no!', 'Parece que no hay un concepto, favor de verificar', 'error');
        } else if (password.trim() === '' || !password) {
            swal.fire('¡Oh no!', 'Parece que no hay ninguna contraseña', 'error');
        } else if (monto && concepto && rightPass.current) {
            swal.fire('Restado', '', 'success');
            console.log('monto', monto, 'concepto', concepto, 'password', password);
            const restCreditData = {
                ID: user.ID,
                create_date: date,
                saldo: monto,
                concepto: concepto,
                autor: autor,
            };

            db.collection('restCredit')
                .add(restCreditData)
                .then(function() {
                    console.log('restando credito exitosamente');
                    setMonto('');
                    setConcepto('');
                    setPassword('');
                    rightPass.current = false;
                    updateSaldo(docRef);
                })
                .catch(function(error) {
                    console.error('Error writing document: ', error);
                });
        } else {
            swal.fire('¡Oh no!', 'Parece que hay un error', 'error');
        }
    };

    return (
        <>
            <h2>Quitar Crédito</h2>
            <div className="rainbow-flex rainbow-flex_wrap">
                <div style={{ flex: '1 1' }}>
                    <Input
                        id="fecha"
                        label="Fecha"
                        className="rainbow-p-around_medium"
                        style={{ width: '100%' }}
                        value={date}
                        readOnly
                        type="date"
                    />
                </div>
                <div style={{ flex: '1 1' }}>
                    <Input
                        id="monto"
                        label="Monto"
                        className="rainbow-p-around_medium"
                        style={{ width: '100%' }}
                        value={monto}
                        onChange={ev => setMonto(ev.target.value)}
                    />
                </div>
                <div style={{ flex: '1 1' }}>
                    <Input
                        id="concepto"
                        label="Concepto"
                        className="rainbow-p-around_medium"
                        style={{ width: '100%' }}
                        value={concepto}
                        onChange={ev => setConcepto(ev.target.value)}
                    />
                </div>
                <div style={{ flex: '1 1' }}>
                    <Input
                        id="password"
                        label="Contraseña"
                        placeholder="****"
                        type="password"
                        className="rainbow-p-around_medium"
                        style={{ width: '100%' }}
                        value={password}
                        onChange={ev => setPassword(ev.target.value)}
                    />
                </div>
                <div style={{ flex: '1 1' }}>
                    <Button className="btn-confirm" label="Confirmar" onClick={restCredit} />
                </div>
            </div>
            <StyledPanel>
                <StyledTable
                    pageSize={5}
                    keyField="id"
                    data={inforTransacciones}
                    emptyTitle="Oh no!"
                    emptyDescription="No hay ningun registro actualmente..."
                >
                    <StyledColumn header="Fecha " field="date" />
                    <StyledColumn header="Monto" field="monto" />
                    <StyledColumn header="Concepto" field="concepto" />
                    <StyledColumn header="Realizado por" field="autor" />
                </StyledTable>
            </StyledPanel>
        </>
    );
}
