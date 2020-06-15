import React, { useEffect, useState } from 'react';
import { Column, Badge, TableWithBrowserPagination, Input } from 'react-rainbow-components';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useFirebaseApp, useUser } from 'reactfire';
import { StyledRecord } from './styled';
import OrigenComponent from '../../pages/send/origen';

const StyledBadge = styled(Badge)`
    color: #09d3ac;
`;
const StatusBadge = ({ value }) => <StyledBadge label={value} variant="lightest" />;
const containerStyles = { height: 312 };
const containerTableStyles = { height: 356 };

// const ShowRecords = () => {

//     return (
//         <div>
//             {recordsData.map(
//                 (historyRecords, idx) => (
//                     console.log(historyRecords),
//                     (<RecordPage key={historyRecords.id} historyRecords={historyRecords} />)
//                 ),
//             )}
//         </div>
//     );
// };

const RecordPage = () => {
    const firebase = useFirebaseApp();
    const db = firebase.firestore();
    const user = useUser();

    const [recordsData, setRecordsData] = useState([]);

    useEffect(() => {
        const reloadRecords = () => {
            db.collection('guia')
                .where('ID', '==', user.uid)
                .onSnapshot(handleRecods);
        };
        reloadRecords();
    }, []);

    function handleRecods(snapshot) {
        const recordsData = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data(),
            };
        });
        setRecordsData(recordsData);
    }

    console.log(recordsData);
    const numbers = [1, 2, 3, 4, 5];
    const listItems = numbers.map(numbers => <p>{numbers}</p>);

    const options = recordsData.map((historyRecord, idx) => {
        console.log(historyRecord);
        return {
            date: historyRecord.sender_addresses.creation_date,
            guide: '#',
            origin: historyRecord.sender_addresses.name,
            Destination: historyRecord.receiver_addresses.name,
            weight: historyRecord.pakage.weight,
            service: historyRecord.supplierData.Supplier,
            status: 'Finalizado',
            cost: historyRecord.supplierData.Supplier_cost,
        };
    });

    return (
        <StyledRecord>
            <div>
                <div>
                    <h1>Mis envíos</h1>

                    <div>
                        <Input
                            className="rainbow-p-around_medium"
                            placeholder="Buscar"
                            icon={
                                <FontAwesomeIcon icon={faSearch} className="rainbow-color_gray-3" />
                            }
                        />
                    </div>

                    <div className="rainbow-p-bottom_xx-large">
                        <div style={containerStyles}>
                            <TableWithBrowserPagination
                                data={options}
                                pageSize={10}
                                keyField="id"
                                style={containerTableStyles}
                            >
                                <Column header="Fecha " field="date" />
                                <Column header="Guía" field="guide" />
                                <Column header="Origen" field="origin" />
                                <Column header="Destino" field="Destination" />
                                <Column header="Peso" field="weight" />
                                <Column header="Servicio" field="service" />
                                <Column header="Status" field="status" component={StatusBadge} />
                                <Column header="Costo" field="cost" />
                            </TableWithBrowserPagination>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <button className="btn-new">Enviar uno nuevo</button>
            </div>
        </StyledRecord>
    );
};

export default RecordPage;
