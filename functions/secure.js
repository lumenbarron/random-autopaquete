const { admin } = require('./admin');

async function getProfileByToken(req) {
    try {
        // Obtenemos el idToken que viene en el header del request
        const authorizationHeader = req.headers.authorization || '';
        const components = authorizationHeader.split(' ');
        const idToken = components.length > 1 ? components[1] : '';
        if (idToken === '') {
            console.log('No ID Token');
            return false;
        }
        // Lo decodificamos para obtener la info del uid
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid } = decodedToken;
        // Vamos a la base de datos a obtener el perfil y vemos si es de tipo admin
        const db = admin.firestore();
        const profileQuery = await db
            .collection('profiles')
            .where('ID', '==', uid)
            .get();
        const profile = profileQuery.docs[0] ? profileQuery.docs[0].data() : null;
        if (!profile) {
            console.log('No profile found');
            return false;
        }
        return profile;
    } catch (error) {
        console.log('Error verifying user:', error);
        return false;
    }
}

async function getEmailByUid(uid) {
    const user = await admin.auth().getUser(uid);
    return user.email;
}

// Aseguramos que sólo un usuario admin pueda usar una función
async function secureOnlyAdmin(req) {
    try {
        const profile = await getProfileByToken(req);
        return profile && profile.user_type && profile.user_type === 'admin';
    } catch (error) {
        console.log('Error verifying user:', error);
        return false;
    }
}

// Aseguramos que sólo un usuario pueda usar una función
async function secureUser(req) {
    try {
        const profile = await getProfileByToken(req);
        return profile;
    } catch (error) {
        console.log('Error verifying user:', error);
        return false;
    }
}

exports.onlyAdmin = secureOnlyAdmin;
exports.user = secureUser;
exports.getEmailByUid = getEmailByUid;
