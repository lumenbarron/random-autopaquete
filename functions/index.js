const functions = require('firebase-functions');
const admin = require('./admin').admin;
const secure = require('./secure');

exports.estafeta = require('./estafeta');
exports.fedex = require('./fedex');
exports.email = require('./sendEmail');

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
