import React, { useState, useEffect, useRef } from 'react';
import {
    Input,
    Button,
    Column,
    TableWithBrowserPagination,
    Select,
} from 'react-rainbow-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import formatMoney from 'accounting-js/lib/formatMoney';
import toFixed from 'accounting-js/lib/toFixed';
import styled from 'styled-components';
import * as firebase from 'firebase';
import swal from 'sweetalert2';

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

let allConcepts = [
    {
        value: 'concepto',
        label: 'concepto',
    },
    {
        value: 'CDS',
        label: 'Carga de saldo',
    },
    {
        value: 'RGNU',
        label: 'Reembolso por guía no utilizada',
    },
];

export default function AddCredito({ user }) {
    // let creationDate = new Date().toLocaleDateString();
    // console.log(creationDate, 'date', typeof creationDate)
    const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
    const [monto, setMonto] = useState('');
    const [concepto, setConcepto] = useState('');
    const [password, setPassword] = useState('');
    const [referencia, setReferencia] = useState('');
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
    const passMarisol = process.env.REACT_APP_KEY_MM;
    const passMayra = process.env.REACT_APP_KEY_ML;

    let montoTotal = useRef('');
    const db = firebase.firestore();
    const userData = db.collection('profiles').where('ID', '==', user.ID);

    // const montoTotal = toFixed(parseFloat(saldoActual) + parseFloat(monto), 2);
    //console.log('montoTotal', montoTotal, 'monto', monto, 'saldoActual', saldoActual);
    userData.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            setDocRef(doc.id);
            setSaldoActual(doc.data().saldo);
        });
    });

    const updateSaldo = (docRef, montoTotal) => {
        // console.log(docRef, montoTotal);
        console.log(montoTotal, 'montoTotal');
        if (!montoTotal) {
            return null;
        }
        if (user) {
            //console.log('montoTotal', montoTotal);
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
            db.collection('voucher')
                .where('ID', '==', user.ID)
                .orderBy('create_date', 'desc')
                .onSnapshot(handleVouncher);
        };
        reloadVoucher();
    }, []);

    function handleVouncher(querySnapshot) {
        let voucherData = [];
        querySnapshot.forEach(doc => {
            //console.log( new Date(doc.data().create_date).toLocaleDateString());
            // db.collection('voucher')
            // .doc(doc.id)
            // .update({ID: 'wLueGTJb2phxh9Gl1U5n5yxMSYp2'})
            voucherData.push({
                id: doc.id,
                ...doc.data(),
            });
        });
        setVouncherData(voucherData);
    }

    const inforTransacciones = voucherData.map((voucher, idx) => {
        return {
            id: voucher.id,
            date: voucher.create_date,
            monto: formatMoney(voucher.saldo, 2),
            concepto: voucher.concepto ? voucher.concepto : 'sin concepto',
            autor: voucher.autor ? voucher.autor : 'desconocido',
            referencia: voucher.referencia ? voucher.referencia : 'sin ref',
            delete: <FontAwesomeIcon icon={faTrashAlt} onClick={() => deleteVoucher(voucher.id)} />,
        };
    });

    const addCredit = () => {
        let autor;
        // console.log(
        //     'monto',
        //     monto,
        //     'concepto',
        //     concepto,
        //     'password',
        //     password,
        //     'referencia',
        //     referencia,
        // );

        if (password === passJulio) {
            autor = 'Julio Arroyo';
            rightPass.current = true;
            // console.log('autor', autor);
        }
        if (password === passJoce) {
            autor = 'Jocelyn Guillén';
            rightPass.current = true;
            // console.log('autor', autor);
        }
        if (password === passCitlaly) {
            autor = 'Citlaly Lara';
            rightPass.current = true;
            // console.log('autor', autor);
        }
        if (password === passBlanca) {
            autor = 'Blanca Gzl';
            rightPass.current = true;
            // console.log('autor', autor);
        }
        if (password === passJose) {
            autor = 'José García';
            rightPass.current = true;
            // console.log('autor', autor);
        }
        if (password === passLucy) {
            autor = 'Lucy Mendez';
            rightPass.current = true;
            // console.log('autor', autor);
        }
        if (password === passMarisol) {
            autor = 'Marisol Martinez';
            rightPass.current = true;
            //console.log('autor', autor);
        }
        if (password === passMayra) {
            autor = 'Mayra Leonides';
            rightPass.current = true;
            //console.log('autor', autor);
        }
        if (monto.trim() === '' || isNaN(monto)) {
            swal.fire('¡Oh no!', 'Parece que no hay un monto válido, favor de verificar', 'error');
        } else if (concepto.trim() === '' || !concepto) {
            swal.fire('¡Oh no!', 'Parece que no hay un concepto, favor de verificar', 'error');
        } else if (referencia.trim() === '' || !referencia) {
            swal.fire('¡Oh no!', 'Parece que no hay una referencia, favor de verificar', 'error');
        } else if (password.trim() === '' || !password) {
            swal.fire('¡Oh no!', 'Parece que no hay ninguna contraseña', 'error');
        } else if (monto && concepto && rightPass.current) {
            //console.log('monto', monto, 'concepto', concepto, 'password', password);
            const addCreditData = {
                ID: user.ID,
                create_date: date,
                saldo: monto,
                concepto: concepto,
                autor: autor,
                referencia: referencia,
            };

            db.collection('voucher')
                .add(addCreditData)
                .then(function() {
                    console.log('agregando credito exitosamente');
                    swal.fire('Agregado', '', 'success');
                    setMonto('');
                    setConcepto('');
                    setPassword('');
                    setReferencia('');
                    rightPass.current = false;
                    montoTotal.current = toFixed(parseFloat(saldoActual) + parseFloat(monto), 2);
                    console.log(montoTotal.current);
                    updateSaldo(docRef, montoTotal.current);
                })
                .catch(function(error) {
                    console.error('Error writing document: ', error);
                });
        } else {
            swal.fire('¡Oh no!', 'Parece que hay un error', 'error');
        }
    };

    const deleteVoucher = idDoc => {
        console.log('idDoc', idDoc);

        db.collection('voucher')
            .doc(idDoc)
            .get()
            .then(doc => {
                let saldo = doc.data().saldo;
                console.log(doc.data(), saldoActual);
                montoTotal.current = toFixed(parseFloat(saldoActual) - parseFloat(saldo), 2);
                console.log(montoTotal.current);
                if (!saldoActual) {
                    return null;
                } else {
                    updateSaldo(docRef, montoTotal.current);
                    deleteVouchertData(idDoc);
                }
            });

        const deleteVouchertData = idDoc => {
            db.collection('voucher')
                .doc(idDoc)
                .delete()
                .then(function() {
                    console.log('Document successfully deleted', idDoc);
                    swal.fire('Eliminado', '', 'success');
                })
                .catch(function(error) {
                    console.error('Error removing document: ', error);
                });
        };
        // deleteVouchertData(idDoc);
    };

    return (
        <>
            <h2>Agregar Crédito</h2>
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
                    <Select
                        options={allConcepts}
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
                        id="referencia"
                        label="Referencia"
                        className="rainbow-p-around_medium"
                        style={{ width: '100%' }}
                        value={referencia}
                        onChange={ev => setReferencia(ev.target.value)}
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
                    <Button className="btn-confirm" label="Confirmar" onClick={addCredit} />
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
                    <StyledColumn header="Referencia" field="referencia" />
                    <StyledColumn header="Realizado por" field="autor" />
                    <StyledColumn header="" field="delete" />
                </StyledTable>
            </StyledPanel>
        </>
    );
}
