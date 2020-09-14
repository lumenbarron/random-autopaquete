const functions = require('firebase-functions');
const { soap } = require('strong-soap');
const secure = require('./secure');
const { getGuiaById, saveLabel, saveError, checkBalance } = require('./guia');
const { admin } = require('./admin');

exports.rate = async function rateFedex(uid, guiaId, servicio) {
    const guia = await getGuiaById(uid, guiaId);
    if (!guia) {
        return false;
    }

    const senderAddress = guia.sender_addresses;
    const receiverAddress = guia.receiver_addresses;
    const packaging = guia.package;

    const quantity = parseInt(packaging.quantity, 10);

    if (Number.isNaN(quantity) || quantity === 0) {
        return false;
    }

    const packageLineItems = [];
    for (let i = 1; i <= quantity; i += 1) {
        const insuredValue =
            packaging.content_value !== ''
                ? {
                      InsuredValue: {
                          Currency: 'NMP',
                          Amount: packaging.content_value,
                      },
                  }
                : {};
        packageLineItems.push({
            SequenceNumber: `${i}`,
            GroupNumber: `${i}`,
            GroupPackageCount: `${quantity}`,
            Weight: {
                Units: 'KG',
                Value: packaging.weight,
            },
            Dimensions: {
                Length: packaging.depth,
                Width: packaging.width,
                Height: packaging.height,
                Units: 'CM',
            },
            ...insuredValue,
        });
    }

    let supplier;
    if (servicio === 'fedexEconomico') {
        if (parseInt(packaging.weight, 10) > 15) {
            supplier = 'fedexEconomicoPesado';
        } else {
            supplier = 'fedexEconomico';
        }
    } else if (servicio === 'fedexDiaSiguiente') {
        supplier = 'fedexOvernight';
    } else {
        return false;
    }

    const db = admin.firestore();
    const supplierQuery = await db
        .collection('suppliers_configuration')
        .where('supplier', '==', supplier)
        .get();

    const supplierData = supplierQuery.docs[0] ? supplierQuery.docs[0].data() : null;
    if (!supplierData) {
        return false;
    }

    const url = './RateService_v28.wsdl';

    const requestArgs = {
        RateRequest: {
            WebAuthenticationDetail: {
                UserCredential: {
                    Key: supplierData.key,
                    Password: supplierData.pass,
                },
            },
            ClientDetail: {
                AccountNumber: supplierData.account,
                MeterNumber: supplierData.meter,
            },
            Version: {
                ServiceId: 'crs',
                Major: '28',
                Intermediate: '0',
                Minor: '0',
            },
            RequestedShipment: {
                ShipTimestamp: new Date().toISOString(),
                DropoffType: 'BUSINESS_SERVICE_CENTER',
                ServiceType: supplierData.serviceType,
                PackagingType: 'YOUR_PACKAGING',
                PreferredCurrency: 'NMP',
                Shipper: {
                    Contact: {
                        PersonName: senderAddress.name,
                        PhoneNumber: senderAddress.phone,
                    },
                    Address: {
                        StreetLines: [senderAddress.street_number, senderAddress.neighborhood],
                        City: senderAddress.country,
                        StateOrProvinceCode: senderAddress.state,
                        PostalCode: senderAddress.codigo_postal,
                        CountryCode: 'MX',
                    },
                },
                Recipient: {
                    Contact: {
                        PersonName: receiverAddress.name,
                        PhoneNumber: receiverAddress.phone,
                    },
                    Address: {
                        StreetLines: [receiverAddress.street_number, receiverAddress.neighborhood],
                        City: receiverAddress.country,
                        StateOrProvinceCode: receiverAddress.state,
                        PostalCode: receiverAddress.codigo_postal,
                        CountryCode: 'MX',
                    },
                },
                ShippingChargesPayment: {
                    PaymentType: 'SENDER',
                    Payor: {
                        ResponsibleParty: {
                            AccountNumber: supplierData.account,
                            Contact: {
                                ContactId: '12345',
                                PersonName: senderAddress.name,
                            },
                        },
                    },
                },
                RateRequestTypes: 'LIST',
                PackageCount: packaging.quantity,
                RequestedPackageLineItems: packageLineItems,
            },
        },
    };

    const clientPromise = new Promise(resolve => {
        soap.createClient(url, {}, function soapReq(err, client) {
            resolve(client);
        });
    });

    const client = await clientPromise;

    const result = await client.RateService.RateServicePort.getRates(requestArgs);

    const { result: apiResult } = JSON.parse(JSON.stringify(result));
    const notSupported = apiResult.HighestSeverity === 'ERROR';
    if (notSupported) {
        return false;
    }
    const cargos =
        apiResult.RateReplyDetails[0].RatedShipmentDetails[1].ShipmentRateDetail.Surcharges;
    const zonaExt = cargos.find(cargo => cargo.SurchargeType === 'OUT_OF_DELIVERY_AREA');
    if (zonaExt) {
        return { zonaExtendida: true };
    }

    return true;
};

exports.create = functions.https.onRequest(async (req, res) => {
    const contentType = req.get('content-type');
    if (!contentType && contentType !== 'application/json') {
        res.status(400).send('Bad Request: Expected JSON');
        return;
    }

    const profile = await secure.user(req);
    if (!profile) {
        res.status(403).send('Not authorized');
        return;
    }

    const { guiaId } = JSON.parse(req.body);
    const guia = await getGuiaById(profile.ID, guiaId);
    if (!profile) {
        res.status(400).send('Guia Id not found');
        return;
    }
    if (guia.status !== 'completed') {
        res.status(400).send('Guia not completed');
        return;
    }
    if (!checkBalance(guiaId, false)) {
        res.status(400).send('Not enough balance');
        return;
    }

    const senderAddress = guia.sender_addresses;
    const receiverAddress = guia.receiver_addresses;
    const packaging = guia.package;

    const quantity = parseInt(packaging.quantity, 10);

    if (Number.isNaN(quantity) || quantity === 0) {
        res.status(400).send('Quantity not a number larger than 0');
        return;
    }

    const packageLineItems = [];
    for (let i = 1; i <= quantity; i += 1) {
        const insuredValue =
            packaging.content_value !== ''
                ? {
                      InsuredValue: {
                          Currency: 'NMP',
                          Amount: packaging.content_value,
                      },
                  }
                : {};
        packageLineItems.push({
            SequenceNumber: `${i}`,
            Weight: {
                Units: 'KG',
                Value: packaging.weight,
            },
            Dimensions: {
                Length: packaging.depth,
                Width: packaging.width,
                Height: packaging.height,
                Units: 'CM',
            },
            ...insuredValue,
        });
    }

    let supplier;
    if (guia.supplierData.Supplier === 'fedexEconomico') {
        if (parseInt(packaging.weight, 10) > 15) {
            supplier = 'fedexEconomicoPesado';
        } else {
            supplier = 'fedexEconomico';
        }
    } else if (guia.supplierData.Supplier === 'fedexDiaSiguiente') {
        supplier = 'fedexOvernight';
    }

    const db = admin.firestore();
    const supplierQuery = await db
        .collection('suppliers_configuration')
        .where('supplier', '==', supplier)
        .get();

    const supplierData = supplierQuery.docs[0] ? supplierQuery.docs[0].data() : null;
    if (!supplierData) {
        res.status(500).send('Missing fedex config');
        return;
    }
    const isProd = supplierData.type === 'prod';

    let url;

    if (isProd) {
        url = './ShipService_v25_prod.wsdl';
    } else {
        url = './ShipService_v25.wsdl';
    }

    const requestArgs = {
        ProcessShipmentRequest: {
            WebAuthenticationDetail: {
                UserCredential: {
                    Key: supplierData.key,
                    Password: supplierData.pass,
                },
            },
            ClientDetail: {
                AccountNumber: supplierData.account,
                MeterNumber: supplierData.meter,
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
                ServiceType: supplierData.serviceType,
                PackagingType: 'YOUR_PACKAGING',
                PreferredCurrency: 'NMP',
                Shipper: {
                    Contact: {
                        PersonName: senderAddress.name,
                        PhoneNumber: senderAddress.phone,
                    },
                    Address: {
                        StreetLines: senderAddress.street_number,
                        City: senderAddress.country,
                        StateOrProvinceCode: senderAddress.state,
                        PostalCode: senderAddress.codigo_postal,
                        CountryCode: 'MX',
                    },
                },
                Recipient: {
                    Contact: {
                        PersonName: receiverAddress.name,
                        PhoneNumber: receiverAddress.phone,
                    },
                    Address: {
                        StreetLines: receiverAddress.street_number,
                        City: receiverAddress.country,
                        StateOrProvinceCode: receiverAddress.state,
                        PostalCode: receiverAddress.codigo_postal,
                        CountryCode: 'MX',
                    },
                },
                ShippingChargesPayment: {
                    PaymentType: 'SENDER',
                    Payor: {
                        ResponsibleParty: {
                            AccountNumber: supplierData.account,
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
                PackageCount: packaging.quantity,
                RequestedPackageLineItems: packageLineItems,
            },
        },
    };

    soap.createClient(url, {}, function(err, client) {
        client.ShipService.ShipServicePort.processShipment(requestArgs, function(err1, result) {
            const apiResult = JSON.parse(JSON.stringify(result));
            if (err1 || !result) {
                saveError(guiaId, result, err1);
                res.status(200).send('NOT OK');
                return;
            }
            try {
                const packageDetail = apiResult.CompletedShipmentDetail.CompletedPackageDetails[0];
                const pdf = packageDetail.Label.Parts[0].Image;
                const guias = [];
                for (let i = 0; i < packageDetail.TrackingIds.length; i += 1) {
                    guias.push(packageDetail.TrackingIds[i].TrackingNumber);
                }
                saveLabel(guiaId, pdf, guias, apiResult);
                res.status(200).send('OK');
            } catch (error) {
                saveError(guiaId, result, JSON.parse(JSON.stringify(error)));
                res.status(200).send('NOT OK');
            }
        });
    });
});
