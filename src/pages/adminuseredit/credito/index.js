import React, { useState, useEffect } from 'react';
import {
    Input,
    Button,
    RadioGroup,
    Textarea,
    Table,
    Column,
    Badge,
} from 'react-rainbow-components';
import formatMoney from 'accounting-js/lib/formatMoney.js';
import FileSelector from '../../../components/react-rainbow-beta/components/FileSelector';
import styled from 'styled-components';
import * as firebase from 'firebase';
import { useUser } from 'reactfire';

const StyledTable = styled(Table)`
    color: #1de9b6;
`;

const StyledColumn = styled(Column)`
    color: #1de9b6;
`;

const badgeStyles = { color: 'red' };
const StatusBadge = ({ value }) => <Badge label={value} variant="lightest" style={badgeStyles} />;

export default function Credito({ user }) {
    const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
    const [monto, setMonto] = useState('');
    const [comprobante, setComprobante] = useState('');
    const [transacciones, setTransacciones] = useState([]);
    const [montoTotal, setMontoTotal] = useState();
    const [voucherData, setVouncherData] = useState([]);
    const [docRef, setDocRef] = useState();

    const storageRef = firebase.storage();
    const db = firebase.firestore();
    const userData = db.collection('profiles').where('ID', '==', user.ID);

    const saveVoucher = url => {
        if (user) {
            docRef.get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    setMontoTotal(doc.data());

                    const docRef = doc.id;
                    const vocherData = {
                        ID: user.ID,
                        voucher: url,
                        saldo: monto,
                        create_date: date,
                    };
                    const profilesCollectionAdd = db.collection('voucher').add(vocherData);

                    profilesCollectionAdd
                        .then(function() {
                            console.log('Document successfully written!');
                            setTransacciones(url);
                        })
                        .catch(function(error) {
                            console.error('Error writing document: ', error);
                        });
                });

                const voucherDataProfile = {
                    saldo: monto,
                };
            });
        }
    };
    useEffect(() => {
        setMontoTotal(monto + montoTotal);
    }, [user]);

    console.log('Monto total: ', montoTotal);

    useEffect(() => {
        const reloadVoucher = () => {
            db.collection('voucher')
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
    console.log(user.ID);
    const inforTransacciones = voucherData.map((voucher, idx) => {
        return {
            date: voucher.create_date,
            monto: voucher.saldo,
            comprobante: voucher.voucher,
        };
    });

    const saveURL = () => {
        storageRef
            .ref(`comprobante/${user.ID}`)
            .child(comprobante[0].name)
            .getDownloadURL()
            .then(function(url) {
                saveVoucher(url);
            });
    };

    const addCredit = () => {
        let fileName = '';
        let filePath = '';

        if (comprobante) {
            fileName = comprobante[0].name;
            filePath = `comprobante/${user.ID}/${fileName}`;
            firebase
                .storage()
                .ref(filePath)
                .put(comprobante[0])
                .then(snapshot => {
                    saveURL();
                });
        }
    };

    const test = () => {
        console.log('Funciona :)');
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
                    <FileSelector
                        className="rainbow-p-horizontal_medium rainbow-m_auto"
                        label="Comprobante de pago"
                        placeholder="Sube o arrastra tu archivo aquí"
                        onChange={setComprobante}
                    />
                </div>
                <div style={{ flex: '1 1' }}>
                    <Button className="btn-confirm" label="Confirmar" onClick={addCredit} />
                </div>
            </div>
            <StyledTable pageSize={10} keyField="id" data={inforTransacciones} pageSize={10}>
                <StyledColumn header="Fecha " field="date" />
                <StyledColumn header="Monto" field="monto" component={StatusBadge} onClick={test} />
                <StyledColumn header="Comprobante" field="comprobante" />
            </StyledTable>
        </>
    );
}
