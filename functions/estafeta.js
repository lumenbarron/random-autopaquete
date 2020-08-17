const functions = require('firebase-functions');
const { soap } = require('strong-soap');
const secure = require('./secure');
const { getGuiaById, saveLabel, saveError, checkBalance } = require('./guia');
const { admin } = require('./admin');

exports.rate = async function rateEstafeta(uid, guiaId) {
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

    const db = admin.firestore();
    const supplierQuery = await db
        .collection('suppliers_configuration')
        .where('supplier', '==', 'estafeta')
        .get();

    const supplierData = supplierQuery.docs[0] ? supplierQuery.docs[0].data() : null;
    if (!supplierData) {
        return false;
    }
    const isProd = supplierData.type === 'prod';

    let url;

    if (isProd) {
        url = 'https://frecuenciacotizador.estafeta.com/Service.asmx?WSDL';
    } else {
        url = 'https://frecuenciacotizador.estafeta.com/Service.asmx?WSDL';
    }

    const requestArgs = {
        idusuario: '1',
        usuario: 'AdminUser',
        contra: ',1,B(vVi',
        esFrecuencia: true,
        esLista: true,
        tipoEnvio: {
            esPaquete: true,
            Largo: packaging.depth,
            Peso: packaging.weight,
            Alto: packaging.height,
            Ancho: packaging.width,
        },
        datosOrigen: {
            string: senderAddress.codigo_postal,
        },
        datosDestino: {
            string: receiverAddress.codigo_postal,
        },
    };

    const clientPromise = new Promise(resolve => {
        soap.createClient(url, {}, function soapReq(err, client) {
            resolve(client);
        });
    });

    const client = await clientPromise;

    const result = await client.Service.ServiceSoap.FrecuenciaCotizador(requestArgs);

    const { result: jsonResult } = JSON.parse(JSON.stringify(result));
    const {
        FrecuenciaCotizadorResult: { Respuesta },
    } = jsonResult;

    const notSupported = Respuesta[0].Error !== '000';
    if (notSupported) {
        return { estafetaEconomico: false, estafetaDiaSiguiente: false };
    }
    const { TipoServicio: servicios } = Respuesta[0].TipoServicio;
    const terrestre = servicios.find(servicio => servicio.DescripcionServicio === 'Terrestre');
    const diaSig = servicios.find(servicio => servicio.DescripcionServicio === 'Dia Sig.');
    const zonaExt = Respuesta[0].CostoReexpedicion !== 'No';
    if (zonaExt) {
        return {
            estafetaEconomico: terrestre ? { zonaExtendida: true } : false,
            estafetaDiaSiguiente: diaSig ? { zonaExtendida: true } : false,
        };
    }

    return {
        estafetaEconomico: typeof terrestre !== 'undefined',
        estafetaDiaSiguiente: typeof diaSig !== 'undefined',
    };
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

    const db = admin.firestore();
    const supplierQuery = await db
        .collection('suppliers_configuration')
        .where('supplier', '==', 'estafeta')
        .get();

    const supplierData = supplierQuery.docs[0] ? supplierQuery.docs[0].data() : null;
    if (!supplierData) {
        res.status(500).send('Missing estafeta config');
        return;
    }
    const isProd = supplierData.type === 'prod';

    let url;

    if (isProd) {
        url = 'https://label.estafeta.com/EstafetaLabel20/services/EstafetaLabelWS?wsdl';
    } else {
        url = 'https://labelqa.estafeta.com/EstafetaLabel20/services/EstafetaLabelWS?wsdl';
    }

    const dValue =
        packaging.content_value !== ''
            ? { insurance: 'True', declaredValue: packaging.content_value }
            : { insurance: 'False', declaredValue: '0' };

    const requestArgs = {
        in0: {
            customerNumber: supplierData.customerNumber,
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
                numberOfLabels: quantity,
                officeNum: supplierData.officeNum,
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
                serviceTypeId: supplierData.serviceTypeId,
                valid: 'True',
                returnDocument: 'False',
                parcelTypeId: '1',
                weight: packaging.weight,
                ...dValue,
            },
            labelDescriptionListCount: '1',
            login: supplierData.user,
            password: supplierData.pass,
            suscriberId: supplierData.suscriberId,
            valid: 'True',
            paperType: '1',
            quadrant: '0',
        },
    };

    soap.createClient(url, {}, function(err, client) {
        client.EstafetaLabelService.EstafetaLabelWS.createLabelExtended(requestArgs, function(
            err1,
            result,
        ) {
            if (err1 || !result) {
                saveError(guiaId, result, err1);
                res.status(200).send('NOT OK');
                return;
            }
            try {
                const pdf = result.createLabelExtendedReturn.labelPDF.$value;
                const guias = result.createLabelExtendedReturn.labelResultList.labelResultList.resultDescription.$value.split(
                    '|',
                );
                if (pdf) {
                    saveLabel(guiaId, pdf, guias, result);
                    res.status(200).send('OK');
                } else {
                    saveError(guiaId, result, 'Label not created');
                    res.status(200).send('NOT OK');
                }
            } catch (error) {
                saveError(guiaId, result, JSON.parse(JSON.stringify(error)));
                res.status(200).send('NOT OK');
            }
        });
    });
});
