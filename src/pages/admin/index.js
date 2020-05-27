import React, { useEffect } from 'react';
import { useFirebaseApp, useUser, useFirestore, useFirestoreCollection, useFirestoreDocData } from 'reactfire';
import { StyledAdmin } from './styled';
import { useHistory } from 'react-router-dom';
import * as firebase from 'firebase';


const AdminPage = () => {
    const firebase = useFirebaseApp();
    const history = useHistory();
    const user = useUser();

    /* Prueba para leer y escribir datos desde firebase
    var db = firebase.firestore();
    const profilesCollection = db.collection("profiles").get();
    const profilesCollectionAdd = db.collection("profiles").add({
        first: "Ada",
        last: "Lovelace",
        born: 1815
    }); 
    profilesCollection
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
        
        });
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });

    profilesCollectionAdd.then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
        */




    return (
        <StyledAdmin>
            <div>
                <div className="back">
                    <div className="formulario">
                        <form>
                            <img src="assets/logo.png" alt="Logo Autopaquete" width="300"></img>
                            <div className="contenedor">
                                <div className="input-contenedor">
                                    <input type="text" placeholder="Correo Electronico"></input>
                                </div>

                                <div className="input-contenedor">
                                    <input type="password" placeholder="Contraseña"></input>
                                </div>
                                <input
                                    type="submit"
                                    value="Iniciar sesión"
                                    className="button"
                                ></input>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </StyledAdmin>
    );
};

export default AdminPage;
