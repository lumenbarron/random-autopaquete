const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.createFedexShipment = functions.https.onRequest((req, res) => {
    const contentType = req.get('content-type');
    if (!contentType && contentType != 'application/json') {
        res.status(400).send('Bad Request: Expected JSON');
        return;
    }

    const { senderAddress, receiverAddress, packaging } = req.body;

    var soap = require('strong-soap').soap;
    var url = './ShipService_v25.wsdl';

    var requestArgs = {
        ProcessShipmentRequest: {
            WebAuthenticationDetail: {
                UserCredential: {
                    Key: '4otzuKjLzVkx5qdQ',
                    Password: 'AyaldeyfISXNQW9YZ7ctDk2jA',
                },
            },
            ClientDetail: {
                AccountNumber: '510087780',
                MeterNumber: '119126102',
            },
            Version: {
                ServiceId: 'ship',
                Major: '25',
                Intermediate: '0',
                Minor: '0',
            },
            RequestedShipment: {
                ShipTimestamp: new Date().toISOString(),
                DropoffType: 'BUSINESS_SERVICE_CENTER',
                ServiceType: 'FEDEX_EXPRESS_SAVER',
                PackagingType: 'YOUR_PACKAGING',
                PreferredCurrency: 'NMP',
                Shipper: {
                    Contact: {
                        PersonName: senderAddress.name,
                        PhoneNumber: senderAddress.Telefono,
                    },
                    Address: {
                        StreetLines: senderAddress.calle_numero,
                        City: senderAddress.ciudad,
                        StateOrProvinceCode: senderAddress.estado,
                        PostalCode: senderAddress.codigo_postal,
                        CountryCode: 'MX',
                    },
                },
                Recipient: {
                    Contact: {
                        PersonName: receiverAddress.name,
                        PhoneNumber: receiverAddress.Telefono,
                    },
                    Address: {
                        StreetLines: receiverAddress.calle_numero,
                        City: receiverAddress.ciudad,
                        StateOrProvinceCode: receiverAddress.estado,
                        PostalCode: receiverAddress.codigo_postal,
                        CountryCode: 'MX',
                    },
                },
                ShippingChargesPayment: {
                    PaymentType: 'SENDER',
                    Payor: {
                        ResponsibleParty: {
                            AccountNumber: '510087780',
                            Contact: {
                                ContactId: '12345',
                                PersonName: senderAddress.name,
                            },
                        },
                    },
                },
                LabelSpecification: {
                    LabelFormatType: 'COMMON2D',
                    ImageType: 'PDF',
                    LabelStockType: 'PAPER_7X4.75',
                },
                RateRequestTypes: 'LIST',
                PackageCount: '1',
                RequestedPackageLineItems: {
                    SequenceNumber: '1',
                    Weight: {
                        Units: 'KG',
                        Value: packaging.weight,
                    },
                    Dimensions: {
                        Length: packaging.length,
                        Width: packaging.width,
                        Height: packaging.height,
                        Units: 'CM',
                    },
                },
            },
        },
    };

    soap.createClient(url, {}, function(err, client) {
        client.ShipService.ShipServicePort.processShipment(requestArgs, function(
            err,
            result,
            envelope,
            soapHeader,
        ) {
            res.status(200).send(JSON.stringify(result));
        });
    });
});

exports.createEstafetaShipment = functions.https.onRequest((req, res) => {
    const contentType = req.get('content-type');
    if (!contentType && contentType != 'application/json') {
        res.status(400).send('Bad Request: Expected JSON');
        return;
    }

    const { senderAddress, receiverAddress, packaging } = req.body;

    var soap = require('strong-soap').soap;
    var url = 'https://labelqa.estafeta.com/EstafetaLabel20/services/EstafetaLabelWS?wsdl';

    var requestArgs = {
        in0: {
            customerNumber: '0000000',
            labelDescriptionList: {
                content: packaging.content,
                destinationInfo: {
                    customerNumber: '0000000',
                    address1: receiverAddress.calle_numero,
                    address2: receiverAddress.Referencias_lugar,
                    city: receiverAddress.ciudad,
                    contactName: receiverAddress.name,
                    corporateName: receiverAddress.name,
                    phoneNumber: receiverAddress.Telefono,
                    neighborhood: receiverAddress.Colonia,
                    state: receiverAddress.estado,
                    valid: 'True',
                    zipCode: receiverAddress.codigo_postal,
                },
                destinationCountryId: 'MX',
                deliveryToEstafetaOffice: 'False',
                numberOfLabels: '1',
                officeNum: '130',
                originInfo: {
                    customerNumber: '0000000',
                    address1: senderAddress.calle_numero,
                    address2: senderAddress.Referencias_lugar,
                    city: senderAddress.ciudad,
                    contactName: senderAddress.name,
                    corporateName: senderAddress.name,
                    phoneNumber: senderAddress.Telefono,
                    neighborhood: senderAddress.Colonia,
                    state: senderAddress.estado,
                    valid: 'True',
                    zipCode: senderAddress.codigo_postal,
                },
                originZipCodeForRouting: senderAddress.codigo_postal,
                serviceTypeId: '70',
                valid: 'True',
                returnDocument: 'False',
                parcelTypeId: '1',
                weight: packaging.weight,
            },
            labelDescriptionListCount: '1',
            login: 'prueba1',
            password: 'lAbeL_K_11',
            suscriberId: '28',
            valid: 'True',
            paperType: '1',
            quadrant: '0',
        },
    };

    soap.createClient(url, {}, function(err, client) {
        client.EstafetaLabelService.EstafetaLabelWS.createLabel(requestArgs, function(
            err,
            result,
            envelope,
            soapHeader,
        ) {
            res.status(200).send(JSON.stringify(result));
        });
    });
});

// Aseguramos que sólo un usuario admin pueda usar una función
async function secureOnlyAdmin(req) {
    try {
        // Obtenemos el idToken que viene en el header del request
        const authorizationHeader = req.headers.authorization || '';
        const components = authorizationHeader.split(' ');
        const idToken = components.length > 1 ? components[1] : '';
        if (idToken == '') {
            console.log('No ID Token');
            return false;
        }
        // Lo decodificamos para obtener la info del uid
        let decodedToken = await admin.auth().verifyIdToken(idToken);
        var uid = decodedToken.uid;
        // Vamos a la base de datos a obtener el perfil y vemos si es de tipo admin
        var db = admin.firestore();
        var profileQuery = await db
            .collection('profiles')
            .where('ID', '==', uid)
            .get();
        var profile = profileQuery.docs[0] ? profileQuery.docs[0].data() : null;
        if (!profile) {
            console.log('No profile found');
            return false;
        }
        return profile.user_type && profile.user_type === 'admin';
    } catch (error) {
        console.log('Error verifying user:', error);
    }
}

exports.getEmails = functions.https.onRequest((req, res) => {
    secureOnlyAdmin(req).then(function(isAdmin) {
        if (!isAdmin) {
            res.status(403).send('Not allowed.');
        } else {
            admin
                .auth()
                .listUsers()
                .then(function(listUsersResult) {
                    let users = [];
                    listUsersResult.users.forEach(function(userRecord) {
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
