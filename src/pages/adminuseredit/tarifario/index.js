import React, { useState, useEffect } from 'react';
import {
    Input,
    Button,
    RadioGroup,
    Textarea,
    Accordion,
    AccordionSection,
    FileSelector,
} from 'react-rainbow-components';
import formatMoney from 'accounting-js/lib/formatMoney';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useFirebaseApp, useUser } from 'reactfire';
import Modal from 'react-modal';

const StyledSubmit = styled.button.attrs(props => {
    return props.theme.rainbow.palette;
})`
    background-color: #ab0000;
    border: none;
    border-radius: 25px;
    padding: 0.5rem 2rem;
    color: white;

    &:hover {
        background-color: #c94141;
        color: white;
    }
`;

const StyledSection = styled(AccordionSection)`
    color: black;

    & section > div:first-child,
    .rainbow-flex.header-divider {
        border: 1px solid gainsboro;
        background: gainsboro;
    }

    & section > div:first-child h3,
    .rainbow-flex.header-divider h3 {
        font-size: 1rem;
        font-weight: bold;
        margin-bottom: 0;
    }

    & section > div:first-child + div {
        padding: 0;
    }

    & .rainbow-flex {
        border: 1px solid gainsboro;
        background: white;
    }

    & .rainbow-flex > div,
    .rainbow-flex.header-divider h3 {
        flex: 1 1;
        padding: 1rem 2rem;
    }
    & .rainbow-flex > div.actions {
        flex: 1 1;
        text-align: right;

        button {
            border: 0;
            background: none;
        }
    }
`;

const InlineInput = styled(Input)`
    display: inline-flex;
    width: 70px;
    position: relative;
    top: -25px;
`;

const ErrorText = styled.div`
    flex: 1 1 100% !important;
    font-size: 0.7rem;
    color: red;
    text-align: left !important;
    margin-top: -36px;
    margin-bottom: 1rem;
`;

function TarifarioPorServicio({ label, tarifas, kgExtra, user, entrega, key }) {
    const firebase = useFirebaseApp();
    const db = firebase.firestore();

    const [minRate, setMinRate] = useState();
    const [maxRate, setMaxRate] = useState();
    const [cost, setCost] = useState();
    const [modalIsOpen, setIsOpen] = useState(false);
    const [modalIsOpenExtra, setIsOpenExtra] = useState(false);
    const [minRateModal, setMinRateModal] = useState();
    const [maxRateModal, setMaxRateModal] = useState();
    const [costModal, setCostModal] = useState();

    const [extraCost, setExtraCost] = useState();
    // const [fedexEconomicoExtra, setFedexEconomicoExtra] = useState();
    // const [fedexExtra, setFedexExtra] = useState();
    // const [estafetaEconomicoExtra, setEstafetaEconomicoExtra] = useState();
    // const [estafetaExtra, setEstafetaExtra] = useState();

    const editRate = key => {
        setIsOpen(true);

        const editRate = {
            min: minRateModal,
            max: maxRateModal,
            precio: costModal,
        };

        console.log(key);

        const editRateInformation = db
            .collection('profiles')
            .doc(user.id)
            .collection('rate')
            .doc(key)
            .update(editRate);

        editRateInformation
            .then(function(docRef) {
                console.log('Se cumplio! Document written with ID (guia): ', docRef.id);
            })
            .catch(function(error) {
                console.error('Error adding document: ', error);
            });
    };

    const openModalExtra = () => {
        setIsOpenExtra(true);
    };

    const closeModalExtra = () => {
        setIsOpenExtra(false);
    };

    const openModal = (min, max, precio) => {
        setIsOpen(true);
        setMinRateModal(min);
        setMaxRateModal(max);
        setCostModal(precio);
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    const deleteRate = key => {
        db.collection('profiles')
            .doc(user.id)
            .collection('rate')
            .doc(key)
            .delete()
            .then(function() {
                console.log('Document successfully deleted!');
            })
            .catch(function(error) {
                console.error('Error removing document: ', error);
            });
    };

    let tarifasMap = tarifas.map((tarifa, idx) => {
        //let key = label + idx;

        const { min, max, precio, key } = tarifa;
        return (
            <>
                <div className="rainbow-flex rainbow-flex_row rainbow-flex_wrap" key={key}>
                    <div>
                        De {tarifa.min} Hasta {tarifa.max} kg
                    </div>
                    <div>{formatMoney(tarifa.precio)}</div>
                    <div className="actions">
                        <button>
                            <FontAwesomeIcon
                                icon={faPencilAlt}
                                onClick={e => openModal(min, max, precio)}
                            />
                        </button>
                        <button>
                            <FontAwesomeIcon icon={faTrashAlt} onClick={e => deleteRate(key)} />
                        </button>
                    </div>
                </div>
                <Modal
                    isOpen={modalIsOpen}
                    contentLabel="Example Modal"
                    style={{
                        overlay: {
                            backgroundColor: 'rgba(100,100,100,0.5)',
                        },
                        content: {
                            width: 'fit-content',
                            height: 'fit-content',
                            margin: 'auto',
                            padding: '2rem',
                            borderRadius: '0.875rem',
                            color: 'crimson',
                            boxShadow: '0px 0px 16px -4px rgba(0, 0, 0, 0.75)',
                            fontFamily: "'Montserrat','sans-serif'",
                            textAlign: 'center',
                        },
                    }}
                >
                    <h2 style={{ fontSize: '1.5rem', textAlign: 'center' }}>Cambia la tarifa</h2>
                    <div className="rainbow-p-horizontal_medium rainbow-m-vertical_large">
                        De{' '}
                        <InlineInput
                            value={minRateModal}
                            type="text"
                            onChange={ev => setMinRateModal(ev.target.value)}
                        />
                        Hasta
                        <InlineInput
                            value={maxRateModal}
                            type="text"
                            onChange={ev => setMaxRateModal(ev.target.value)}
                        />
                        kg
                    </div>
                    <div className="rainbow-p-horizontal_medium rainbow-m-vertical_large">
                        Precio
                        <InlineInput
                            value={costModal}
                            type="text"
                            onChange={ev => setCostModal(ev.target.value)}
                        />
                    </div>
                    <button
                        onClick={closeModal}
                        style={{
                            border: 'none',
                            background: 'none',
                            float: 'right',
                            marginTop: '-14rem',
                            marginRight: '-1rem',
                        }}
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                    <StyledSubmit
                        type="submit"
                        onClick={e => {
                            editRate(key);
                            closeModal();
                        }}
                    >
                        Continuar
                    </StyledSubmit>
                </Modal>
            </>
        );
    });

    const addRate = () => {
        const addRateData = {
            min: minRate,
            max: maxRate,
            entrega,
            precio: cost,
        };
        db.collection('profiles')
            .doc(user.id)
            .collection('rate')
            .add(addRateData)
            .then(function(docRef) {
                console.log('Document written with ID (origen): ', docRef.id);
            })
            .catch(function(error) {
                console.error('Error adding document: ', error);
            });
    };

    const addKgExtra = () => {
        const addExtraRate = {
            extra_cost: extraCost,
            entrega,
        };

        const editRateInformation = db
            .collection('profiles')
            .doc(user.id)
            .collection('Kgextra')
            .doc('test')
            .set(addExtraRate);

        editRateInformation
            .then(function(docRef) {
                console.log('Se cumplio! Document written with ID (guia): ', docRef.id);
            })
            .catch(function(error) {
                console.error('Error adding document: ', error);
            });
    };
    return (
        <StyledSection label={label}>
            {tarifasMap}
            <div className="rainbow-flex rainbow-flex_row rainbow-flex_wrap">
                <div>
                    De <InlineInput type="text" onChange={ev => setMinRate(ev.target.value)} />
                    Hasta
                    <InlineInput type="text" onChange={ev => setMaxRate(ev.target.value)} />
                    kg
                </div>
                <div>
                    <InlineInput type="text" onChange={ev => setCost(ev.target.value)} />
                </div>
                <div className="actions">
                    <Button label="Confirmar" onClick={addRate} />
                </div>
                <ErrorText>
                    Error: Los kilogramos que tienes deben estar duplicados o no ser consecutivos,
                    favor de revisar
                </ErrorText>
            </div>
            <div className="rainbow-flex rainbow-flex_row rainbow-flex_wrap header-divider">
                <h3>Kg Adicional</h3>
            </div>
            <div className="rainbow-flex rainbow-flex_row rainbow-flex_wrap">
                <div>{label}</div>
                {kgExtra.map((kgExtra, idx) => (
                    <div>{formatMoney(kgExtra.kgExtra)}</div>
                ))}

                <div className="actions">
                    <button>
                        <FontAwesomeIcon icon={faPencilAlt} onClick={openModalExtra} />
                    </button>
                </div>
            </div>
            <Modal
                isOpen={modalIsOpenExtra}
                contentLabel="Example Modal"
                style={{
                    overlay: {
                        backgroundColor: 'rgba(100,100,100,0.5)',
                    },
                    content: {
                        width: 'fit-content',
                        height: 'fit-content',
                        margin: 'auto',
                        padding: '2rem',
                        borderRadius: '0.875rem',
                        color: 'crimson',
                        boxShadow: '0px 0px 16px -4px rgba(0, 0, 0, 0.75)',
                        fontFamily: "'Montserrat','sans-serif'",
                        textAlign: 'center',
                    },
                }}
            >
                <h2 style={{ fontSize: '1.5rem', textAlign: 'center' }}>Cambia la tarifa</h2>
                <div className="rainbow-p-horizontal_medium rainbow-m-vertical_large">
                    Precio
                    <InlineInput
                        value={extraCost}
                        type="text"
                        onChange={ev => setExtraCost(ev.target.value)}
                    />
                </div>
                <button
                    onClick={closeModalExtra}
                    style={{
                        border: 'none',
                        background: 'none',
                        float: 'right',
                        marginTop: '-9.5rem',
                        marginRight: '-1.6rem',
                    }}
                >
                    <FontAwesomeIcon icon={faTimes} />
                </button>
                <StyledSubmit
                    type="submit"
                    onClick={e => {
                        addKgExtra();
                        closeModalExtra();
                    }}
                >
                    Continuar
                </StyledSubmit>
            </Modal>
        </StyledSection>
    );
}

export default function Tarifario({ user }) {
    useEffect(() => {}, [user]);
    const firebase = useFirebaseApp();
    const db = firebase.firestore();

    const [tarifas, setTarifas] = useState([]);

    useEffect(() => {
        if (user) {
            const reloadTarifas = () => {
                db.collection('profiles')
                    .doc(user.id)
                    .collection('rate')
                    .onSnapshot(handleTarifas);
            };
            reloadTarifas();
        }
    }, []);

    function handleTarifas(snapshot) {
        const tarifas = snapshot.docs.map(doc => {
            return {
                id: doc.id,
                ...doc.data(),
            };
        });
        setTarifas(tarifas);
    }

    const estafetaDiaSiguiente = tarifas
        .filter(entregaFilter => {
            return entregaFilter.entrega === 'estafetaDiaSiguiente';
        })
        .map((entrega, xid) => {
            return {
                key: entrega.id,
                max: entrega.max,
                precio: entrega.precio,
                min: entrega.min,
                kgExtra: entrega.kgExtra,
            };
        });

    const estafetaEconomico = tarifas
        .filter(entregaFilter => {
            return entregaFilter.entrega === 'estafetaEconómico';
        })
        .map((entrega, xid) => {
            return {
                key: entrega.id,
                max: entrega.max,
                precio: entrega.precio,
                min: entrega.min,
                kgExtra: entrega.kgExtra,
            };
        });

    const fedexDiaSiguiente = tarifas
        .filter(entregaFilter => {
            return entregaFilter.entrega === 'fedexDiaSiguiente';
        })
        .map((entrega, xid) => {
            return {
                key: entrega.id,
                max: entrega.max,
                precio: entrega.precio,
                min: entrega.min,
                kgExtra: entrega.kgExtra,
            };
        });

    const fedexEconomico = tarifas
        .filter(entregaFilter => {
            return entregaFilter.entrega === 'fedexEconomico';
        })
        .map((entrega, xid) => {
            return { key: entrega.id, max: entrega.max, precio: entrega.precio, min: entrega.min };
        });

    //////////////////////////
    const estafetaDiaSiguienteExtra = tarifas
        .filter(entregaFilterExtra => {
            return entregaFilterExtra.type === 'estafetaDiaSiguienteExtra';
        })
        .map((kgExtra, xid) => {
            return {
                kgExtra: kgExtra.kgExtra,
            };
        });

    const estafetaEconomicoExtra = tarifas
        .filter(entregaFilterExtra => {
            return entregaFilterExtra.type === 'estafetaEconómicoExtra';
        })
        .map((kgExtra, xid) => {
            return {
                kgExtra: kgExtra.kgExtra,
            };
        });

    const fedexDiaSiguienteExtra = tarifas
        .filter(entregaFilterExtra => {
            return entregaFilterExtra.type === 'fedexDiaSiguienteExtra';
        })
        .map((kgExtra, xid) => {
            return {
                kgExtra: kgExtra.kgExtra,
            };
        });

    const fedexEconomicoExtra = tarifas
        .filter(entregaFilterExtra => {
            return entregaFilterExtra.type === 'fedexEconomicoExtra';
        })
        .map((kgExtra, xid) => {
            return {
                kgExtra: kgExtra.kgExtra,
            };
        });

    // const docRef = db
    //     .collection('profiles')
    //     .doc(user.id)
    //     .collection('rate')
    //     .where('type', '==', 'kgExtra');

    // docRef
    //     .get()
    //     .then(function(querySnapshot) {
    //         querySnapshot.forEach(function(doc) {
    //             console.log(doc.id, ' => ', doc.data());
    //         });
    //     })
    //     .catch(function(error) {
    //         console.log('Error getting documents: ', error);
    //     });

    return (
        <>
            <h2>Tarifario del cliente</h2>
            <h3 style={{ marginTop: '1rem' }}>Estafeta</h3>
            <Accordion id="accordion-estafeta" multiple={true}>
                <TarifarioPorServicio
                    label="Estafeta Día Siguiente"
                    valor={estafetaDiaSiguiente.value}
                    tarifas={estafetaDiaSiguiente}
                    key={estafetaDiaSiguiente.id}
                    kgExtra={estafetaDiaSiguienteExtra}
                    user={user}
                    entregaExtra="estafetaDiaSiguienteExtra"
                    entrega="estafetaDiaSiguiente"
                />

                <TarifarioPorServicio
                    label="Estafeta Terrestre"
                    tarifas={estafetaEconomico}
                    kgExtra={estafetaEconomicoExtra}
                    user={user}
                    entrega="estafetaEconómico"
                />
            </Accordion>
            <h3 style={{ marginTop: '1rem' }}>Fedex</h3>
            <Accordion id="accordion-fedex" multiple={true}>
                <TarifarioPorServicio
                    label="Fedex Día Siguiente"
                    tarifas={fedexDiaSiguiente}
                    kgExtra={fedexDiaSiguienteExtra}
                    user={user}
                    entrega="fedexDiaSiguiente"
                />
                <TarifarioPorServicio
                    label="Fedex Terrestre"
                    tarifas={fedexEconomico}
                    kgExtra={fedexEconomicoExtra}
                    user={user}
                    entrega="fedexEconomico"
                />
            </Accordion>
            <p style={{ margin: '1rem' }}>
                <b>NOTA:</b> El peso volumétrico equivale al (largo x ancho x alto) / 5000 y este
                número siempre es un entero que se redondea hacia arriba, esa equivalencia se tomará
                para los kg.
            </p>
        </>
    );
}
