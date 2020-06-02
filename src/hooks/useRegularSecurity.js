import { useHistory } from 'react-router-dom';
import { useUser } from 'reactfire';
import * as firebase from 'firebase';

export function useRegularSecurity() {
    const user = useUser();
    const history = useHistory();
    const db = firebase.firestore();

    if (user) {
        const docRef = db.collection('profiles').where('ID', '==', user.uid);
        docRef.get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                if (doc.data().user_type !== 'regular') {
                    history.push('/');
                }
            });
        });
    }

    if (!user) {
        history.push('/');
    }
}
