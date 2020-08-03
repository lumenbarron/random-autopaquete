const functions = require('firebase-functions');
const { admin } = require('./admin');
const secure = require('./secure');

exports.estafeta = require('./estafeta');
exports.fedex = require('./fedex');
exports.email = require('./sendEmail');

exports.cotizarGuia = functions.https.onRequest(async (req, res) => {
    const profile = await secure.user(req);
    if (!profile) {
        res.status(403).send('Not authorized');
        return;
    }

    const { guiaId } = JSON.parse(req.body);

    const uid = profile.ID;

    try {
        const fedexEconomico = await exports.fedex.rate(uid, guiaId, 'fedexEconomico');
        const fedexDiaSiguiente = await exports.fedex.rate(uid, guiaId, 'fedexDiaSiguiente');
        const estafeta = await exports.estafeta.rate(uid, guiaId, 'estafeta');

        res.status(200).send(JSON.stringify({ fedexEconomico, fedexDiaSiguiente, ...estafeta }));
    } catch (error) {
        console.log(error);
        res.status(500).send('NOT OK');
    }
});

exports.getEmails = functions.https.onRequest((req, res) => {
    secure.onlyAdmin(req).then(function(isAdmin) {
        if (!isAdmin) {
            res.status(403).send('Not allowed.');
        } else {
            admin
                .auth()
                .listUsers()
                .then(function(listUsersResult) {
                    let users = [];
                    listUsersResult.users.forEach(function(userRecord) {
                        if (!userRecord.uid) {
                            return;
                        }
                        users.push({
                            uid: userRecord.uid,
                            email: userRecord.email,
                        });
                    });
                    res.status(200).send(JSON.stringify(users));
                })
                .catch(function(error) {
                    console.log('Error listing users:', error);
                    res.status(500).send('Something went wrong. Check the logs for more info.');
                    return;
                });
        }
    });
});
