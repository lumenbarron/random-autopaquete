const functions = require('firebase-functions');
const admin = require('./admin').admin;

async function getGuiaById(db, uid, guiaId) {
    var db = admin.firestore();
    var query = await db
        .collection('guia')
        .where('ID', '==', uid)
        .where('id', '==', guiaId)
        .get();
    var guia = query.docs[0] ? query.docs[0].data() : null;
    return guia;
}
