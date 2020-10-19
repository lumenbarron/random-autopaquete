import React, { useState, useEffect } from 'react';
import { useFirebaseApp } from 'reactfire';

export default function HistoryUser({ user }) {
    const firebase = useFirebaseApp();
    const db = firebase.firestore();
    const [history, setHistory] = useState([]);
    const [tableData, setTableData] = useState();

    useEffect(() => {
        if (user) {
            let dataGuias = [];
            db.collection('guia')
                .where('ID', '==', user.ID)
                .get()
                .then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        console.log('data guias', doc.data(), 'doc.id', doc.id);
                        dataGuias.push({
                            id: doc.id,
                            ...doc.data(),
                        });
                    });
                    setHistory(dataGuias);
                    console.log('data', dataGuias);
                })
                .catch(function(error) {
                    console.log('Error getting documents: ', error);
                });
        }
    }, []);

    const DeleteGuia = id => {
        console.log('borrando el doc', id);
        db.collection('guia')
            .doc(id)
            .delete();
    };

    useEffect(() => {
        history.map(doc => console.log(doc.id));
        setTableData(
            history.map(historyRecord => (
                <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Fecha</th>
                            <th>Status</th>
                            <th>Guía</th>
                            {/* <th>Origen</th>
                            <th>Destino</th> */}
                            {/* <th>Peso</th> */}
                            <th>Servicio</th>
                            <th>Costo</th>
                            {/* <th>Etiqueta</th> */}
                            <th>Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.length > 0 ? (
                            <tr key={historyRecord.id}>
                                <td>{historyRecord.id}</td>
                                <td>{historyRecord.package.creation_date}</td>
                                <td>{historyRecord.status}</td>
                                <td>
                                    {historyRecord.status === 'completed'
                                        ? historyRecord.rastreo
                                        : 'sin guia'}
                                </td>
                                {/* <td>{historyRecord.sender_addresses.names}</td>
                                <td>{historyRecord.receiver_addresses.name}</td> */}
                                {/* <td>{historyRecord.package.weight}</td> */}
                                <td>
                                    {historyRecord.status === 'completed'
                                        ? historyRecord.supplierData.Supplier
                                        : 'sin servicio'}
                                </td>
                                <td>
                                    {historyRecord.status === 'completed'
                                        ? historyRecord.supplierData.Supplier_cost
                                        : ''}
                                </td>
                                <td>
                                    {' '}
                                    <button onClick={() => DeleteGuia(historyRecord.id)}>
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ) : (
                            <tr>
                                <td>No hay ningun registro actualmente...</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )),
        );
    }, [history]);
    return <>{tableData}</>;
}
