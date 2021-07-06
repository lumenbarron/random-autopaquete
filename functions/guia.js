const { admin } = require('./admin');
const functions = require('firebase-functions');

async function getGuiaByIdWithoutValidation(guiaId) {
    const db = admin.firestore();
    const query = await db
        .collection('guia')
        .doc(guiaId)
        .get();
    const guia = query ? query.data() : null;
    functions.logger.info('getGuiaByIdWithoutValidation: obteniendo guia: ', guiaId);
    return guia;
}

async function getGuiaById(uid, guiaId) {
    functions.logger.info('Entrando a archivo guia.js en funcion getGuiaById');
    const guia = await getGuiaByIdWithoutValidation(guiaId);

    if (guia && guia.ID === uid) {
        return guia;
    }
    return null;
}

async function checkBalance(guiaId, commit) {
    functions.logger.info('se checa balance ');
    const guia = await getGuiaByIdWithoutValidation(guiaId);
    const db = admin.firestore();
    const profileQuery = await db
        .collection('profiles')
        .where('ID', '==', guia.ID)
        .get();
    const profile = profileQuery.docs[0] ? profileQuery.docs[0].data() : null;
    if (guia && guia.supplierData && guia.supplierData.Supplier_cost && profile.saldo) {
        let newBalance =
            parseFloat(profile.saldo, 10) - parseFloat(guia.supplierData.Supplier_cost, 10);
        if (newBalance < 0) {
            return false;
        }
        newBalance = Math.round((newBalance + Number.EPSILON) * 100) / 100;
        if (commit) {
            await db
                .collection('profiles')
                .doc(profileQuery.docs[0].id)
                .set({ saldo: newBalance }, { merge: true });
        }
        return true;
    }
    return false;
}

async function saveLabel(guiaId, label, rastreo, APIResponse) {
    functions.logger.info(
        'entro a saveLabel: { guiaId: ',
        guiaId,
        ', label: ',
        label,
        ', rastreo: ',
        rastreo,
        ', APIResponse: ',
        APIResponse,
        ' }',
    );
    try {
        const db = admin.firestore();
        await db
            .collection('guia')
            .doc(guiaId)
            .update({ label, APIResponse, rastreo });
    } catch (error) {
        functions.logger.info('Error al guardar etiqueta:', error.message);
    }
    await checkBalance(guiaId, true);
}

async function saveError(guiaId, APIResponse, error) {
    functions.logger.info('entro a saveError', error);
    const response = APIResponse || false;
    const db = admin.firestore();
    await db
        .collection('guia')
        .doc(guiaId)
        .update({
            status: 'error',
            APIResponse: JSON.parse(JSON.stringify(response)),
            error: JSON.parse(JSON.stringify(error)),
        });
}

exports.getGuiaById = getGuiaById;
exports.saveLabel = saveLabel;
exports.saveError = saveError;
exports.checkBalance = checkBalance;
