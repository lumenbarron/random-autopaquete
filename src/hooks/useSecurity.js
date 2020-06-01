import { useHistory, useLocation } from 'react-router-dom';
import { useUser } from 'reactfire';
import * as firebase from 'firebase';

export function useSecurity(type) {
    const user = useUser();
    const history = useHistory();
    const location = useLocation();
    const db = firebase.firestore();

    if (!user) {
        history.push('/');
    }

    // Validar que un ususario existe
    if (user) {
        // Generar la consulta a frestore jalando el id del usuario
        const docRef = db.collection('profiles').where('ID', '==', user.uid);
        docRef
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    console.log(doc.data().user_type);
                    if (doc.data().user_type !== 'admin') {
                        history.push('/admin');
                    }
                    /* if (doc.data().user_type === 'admin') {                        
                        const pathNames = location.pathname.split('/');
                       if (pathNames[1] !== 'admin') {
                            v
                        }
                        // revisar si el usuario tiene perfil en firestore y si es de tipo admin
                    } */
                });
            })
            .catch(function(error) {
                console.log('Error getting documents: ', error);
            });
    }
}
