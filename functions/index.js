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

exports.getEmails = functions.https.onRequest((req, res) => {
    admin
        .auth()
        .listUsers()
        .then(function(listUsersResult) {
            listUsersResult.users.forEach(function(userRecord) {
                console.log('user', userRecord.toJSON());
                userRecord.forEach(element => console.log(element));
            });
        })
        .catch(function(error) {
            console.log('Error listing users:', error);
        });
});
