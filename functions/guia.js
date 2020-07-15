const { admin } = require('./admin');

async function getGuiaByIdWithoutValidation(guiaId) {
    const db = admin.firestore();
    const query = await db
        .collection('guia')
        .doc(guiaId)
        .get();
    const guia = query ? query.data() : null;
    return guia;
}

async function getGuiaById(uid, guiaId) {
    const guia = await getGuiaByIdWithoutValidation(guiaId);

    if (guia && guia.ID === uid) {
        return guia;
    }
    return null;
}

async function checkBalance(guiaId, commit) {
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
    const db = admin.firestore();
    await db
        .collection('guia')
        .doc(guiaId)
        .update({ label, APIResponse, rastreo });

    await checkBalance(guiaId, true);
}

async function saveError(guiaId, APIResponse, error) {
    const response = APIResponse || false;
    const db = admin.firestore();
    await db
        .collection('guia')
        .doc(guiaId)
        .update({ status: 'error', APIResponse: response, error });

    await checkBalance(guiaId, true);
}

exports.getGuiaById = getGuiaById;
exports.saveLabel = saveLabel;
exports.saveError = saveError;
exports.checkBalance = checkBalance;
