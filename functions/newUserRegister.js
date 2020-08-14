const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const secure = require('./secure');
const { admin } = require('./admin');

exports.send = functions.https.onRequest(async (req, res) => {
    const contentType = req.get('content-type');
    if (!contentType && contentType !== 'application/json') {
        res.status(400).send('Bad Request: Expected JSON');
        return;
    }

    // const profile = await secure.user(req);
    // if (!profile) {
    //     res.status(403).send('Not authorized');
    //     return;
    // }

    // const email = await secure.getEmailByUid(profile.ID);

    const { name, userEmail } = req.body;

    const db = admin.firestore();
    const supplierQuery = await db.collection('email_configuration').get();

    const { host, emailConfig, password } = supplierQuery.docs[0]
        ? supplierQuery.docs[0].data()
        : {};
    // TODO: Agregar un servidor SMTP Válido
    const transporter = nodemailer.createTransport({
        //name: 'autopaquete.com.mx',
        host,
        port: 587,
        secure: false,
        ignoreTLS: true,
        tls: {
            rejectUnauthorized: false,
            //     servername: 'smtp.mailtrap.io',
        },
        secure: false,
        auth: {
            user: emailConfig,
            pass: password,
        },
    });

    transporter.verify((error, success) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Server is ready to take messages');
        }
    });

    const mailOptions = {
        from: `"${name}" <${userEmail}>`, // sender address
        replyTo: `"${name} <${userEmail}>`,
        to: `<${emailConfig}>`, // list of receivers
        subject: 'Nuevo usuario registrado', // Subject line
        text: `Mensaje: nuevo usuario`, // plain text body
        html: `<p><b>Nuevo usuario registrado</b></p><div>Usuario: ${name}</div><div>Correo: ${userEmail}</div> `,
    };

    transporter.sendMail(mailOptions, (error, response) => {
        if (error) {
            res.send(error);
        } else {
            res.send('Success');
        }
    });

    transporter.close();
});
