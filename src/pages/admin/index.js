import React, {useState} from 'react';
import { StyledAdmin } from './styled';
import 'firebase/auth';
import { useFirebaseApp, useUser } from 'reactfire';
import { useHistory } from 'react-router-dom';



const AdminPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const firebase = useFirebaseApp();
    const history = useHistory();


    const login = async e => {
        e.preventDefault();
        if (email.trim() === '' || password.trim() === '') {
            console.log('Espacios vacios');
            return;
        }


        await firebase.auth().signInWithEmailAndPassword(email, password);
        history.push('/mi-cuenta');
    };



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
                                    onClick={login}
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
