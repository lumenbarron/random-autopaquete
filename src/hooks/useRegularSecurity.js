import { useHistory, useLocation } from 'react-router-dom';
import { useUser } from 'reactfire';
import * as firebase from 'firebase';

export function useRegularSecurity(type) {
    const user = useUser();
    const history = useHistory();
    const location = useLocation();
    const db = firebase.firestore();

    if(!user){
        history.push('/');
    }

    //Validar que un ususario existe
        if (user) {
            //Generar la consulta a frestore jalando el id del usuario
            const docRef = db.collection('profiles').where('ID', '==', user.uid);
            docRef
                .get()
                .then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        if (doc.data().user_type !== 'regular') {
                            history.push('/');
                        }
                    });
                })
                .catch(function(error) {
                    console.log('Error getting documents: ', error);
                });
        }
    }