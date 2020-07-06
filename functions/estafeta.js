const functions = require('firebase-functions');
const secure = require('./secure');
const { getGuiaById, saveLabel } = require('./guia');

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

    const senderAddress = guia.sender_addresses;
    const receiverAddress = guia.receiver_addresses;
    const packaging = guia.package;

    var soap = require('strong-soap').soap;
    var url = 'https://labelqa.estafeta.com/EstafetaLabel20/services/EstafetaLabelWS?wsdl';

    var requestArgs = {
        in0: {
            customerNumber: '0000000',
            labelDescriptionList: {
                content: packaging.content_description,
                destinationInfo: {
                    customerNumber: '0000000',
                    address1: receiverAddress.street_number,
                    address2: receiverAddress.place_reference,
                    city: receiverAddress.country,
                    contactName: receiverAddress.name,
                    corporateName: receiverAddress.name,
                    phoneNumber: receiverAddress.phone,
                    neighborhood: receiverAddress.neighborhood,
                    state: receiverAddress.state,
                    valid: 'True',
                    zipCode: receiverAddress.codigo_postal,
                },
                destinationCountryId: 'MX',
                deliveryToEstafetaOffice: 'False',
                numberOfLabels: '1',
                officeNum: '130',
                originInfo: {
                    customerNumber: '0000000',
                    address1: senderAddress.street_number,
                    address2: senderAddress.place_reference,
                    city: senderAddress.country,
                    contactName: senderAddress.name,
                    corporateName: senderAddress.name,
                    phoneNumber: senderAddress.phone,
                    neighborhood: senderAddress.neighborhood,
                    state: senderAddress.state,
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
            const pdf = result.createLabelReturn.labelPDF.$value;
            saveLabel(guiaId, pdf);
            res.status(200).send(JSON.stringify(result));
        });
    });
});
