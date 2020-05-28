import React from 'react';
import { StyledAdmin } from './styled';
import { useSecurity } from '../../hooks/useSecurity';
import { useBlockSecurity } from '../../hooks/useBlockSecurity';


const AdminPage = () => {

    /* Prueba para leer y escribir datos desde firebase
    var db = firebase.firestore();
    const profilesCollection = db.collection("profiles").get();

    profilesCollection
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data()}`);
        
        });
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
        */

    useSecurity();
    useBlockSecurity();


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
