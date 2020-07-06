const { admin } = require('./admin');

async function getGuiaById(uid, guiaId) {
    const db = admin.firestore();
    const query = await db
        .collection('guia')
        .doc(guiaId)
        .get();
    const guia = query ? query.data() : null;

    if (guia.ID === uid) {
        return guia;
    }
    return null;
}

async function saveLabel(guiaId, pdf) {
    const db = admin.firestore();
    await db
        .collection('guia')
        .doc(guiaId)
        .update({ label: pdf });
}

exports.getGuiaById = getGuiaById;
exports.saveLabel = saveLabel;
