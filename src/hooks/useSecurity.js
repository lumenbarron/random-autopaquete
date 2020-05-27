import { useHistory } from 'react-router-dom';
import { useUser } from 'reactfire';

export function useSecurity(type) {
    const user = useUser();
    const history = useHistory();

    if (type === 'admin') {
        if (!user) {
            history.push('/admin');
        }
        // revisar si el usuario tiene perfil en firestore y si es de tipo admin
        return;
    }

    if (!user) {
        history.push('/login');
    }
}
