import React, { useState, useEffect } from 'react';
import {
    Input,
    Button,
    RadioGroup,
    Textarea,
    Table,
    Column,
    Badge,
    FileSelector,
} from 'react-rainbow-components';
import formatMoney from 'accounting-js/lib/formatMoney';
import styled from 'styled-components';
import * as firebase from 'firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

const StyledTable = styled(Table)`
    color: #1de9b6;
`;

const StyledColumn = styled(Column)`
    color: #1de9b6;
`;

const DownloadVoucher = ({ value }) => (
    <Button
        variant="neutral"
        className="rainbow-m-around_medium"
        onClick={() => window.open(value, 'Comprobante')}
    >
        Descargar comprobante
        <FontAwesomeIcon icon={faDownload} className="rainbow-m-left_medium" />
    </Button>
);

export default function Credito({ user }) {
    const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
    const [monto, setMonto] = useState('');
    const [comprobante, setComprobante] = useState('');
    const [transacciones, setTransacciones] = useState([]);
    const [saldoActual, setSaldoActual] = useState();
    const [voucherData, setVouncherData] = useState([]);
    const [docRef, setDocRef] = useState();

    const storageRef = firebase.storage();
    const db = firebase.firestore();
    const userData = db.collection('profiles').where('ID', '==', user.ID);

    const montoTotal = parseInt(monto) + parseInt(saldoActual);

    userData.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            setDocRef(doc.id);
            setSaldoActual(doc.data().saldo);
        });
    });

    const saveVoucher = url => {
        if (user) {
            //const docRef = doc.id;
            const vocherData = {
                ID: user.ID,
                voucher: url,
                saldo: monto,
                create_date: date,
            };
            const voucherCollectionAdd = db.collection('voucher').add(vocherData);

            voucherCollectionAdd
                .then(function() {
                    console.log('Document successfully written!');
                    setTransacciones(url);
                })
                .catch(function(error) {
                    console.error('Error writing document: ', error);
                });

            const voucherDataProfile = {
                saldo: montoTotal,
            };
            const profilesCollectionAdd = db
                .collection('profiles')
                .doc(docRef)
                .update(voucherDataProfile);

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
                .onSnapshot(handleVouncher);
            console.log('handleVouncher', handleVouncher);
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
        console.log('voucherData', voucherData);
        return {
            id: voucher.id,
            date: voucher.create_date,
            monto: formatMoney(voucher.saldo, 2),
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
            <StyledTable
                pageSize={10}
                keyField="id"
                data={inforTransacciones}
                emptyTitle="Oh no!"
                emptyDescription="No hay ningun registro actualmente..."
            >
                <StyledColumn header="Fecha " field="date" />
                <StyledColumn header="Monto" field="monto" />
                <StyledColumn
                    header="Comprobante"
                    component={DownloadVoucher}
                    field="comprobante"
                />
            </StyledTable>
        </>
    );
}
