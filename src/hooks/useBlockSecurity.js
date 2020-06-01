import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useUser } from 'reactfire';
import * as firebase from 'firebase';

export function useBlockSecurity(type) {
    const user = useUser();
    const history = useHistory();
    const db = firebase.firestore();

    if (user) {
        const docRef = db.collection('profiles').where('ID', '==', user.uid);

        docRef
            .get()
            .then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    console.log(doc.data().user_type);
                    if (doc.data().user_type === 'regular') {
                        history.push('/mi-cuenta');
                        console.log(user);
                    }
                    if (doc.data().user_type === 'admin') {
                        history.push('/admin/usuarios');
                        console.log(user);
                    }

                    // revisar si el usuario tiene perfil en firestore y si es de tipo admin
                });
            })
            .catch(function(error) {
                console.log('Error getting documents: ', error);
            });
    }
    // Validar si el usuario no esta loggeado
}
