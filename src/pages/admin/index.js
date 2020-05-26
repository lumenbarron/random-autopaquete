import React, {useEffect} from 'react';
import { useFirebaseApp, useUser } from 'reactfire';
import { StyledAdmin } from './styled';
import { useHistory } from 'react-router-dom';

const AdminPage = () => {

    const firebase = useFirebaseApp();
    const history = useHistory();
    const user = useUser();

    useEffect(() => {
        if (user == null) {
            history.push('/login');
        }
    }, [user]);

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
                <input type="submit" value="Iniciar sesión" className="button"></input>
            </div>
            </form>
            </div>
             </div>
        </div>
        </StyledAdmin>
    );
};

export default AdminPage;
