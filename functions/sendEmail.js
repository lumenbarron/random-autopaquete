const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
const secure = require('./secure');

exports.send = functions.https.onRequest(async (req, res) => {
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

    const email = await secure.getEmailByUid(profile.ID);

    const { name, lastName, phone, message, host, receiverEmail, pass } = JSON.parse(req.body);

    // TODO: Agregar un servidor SMTP Válido
    const transporter = nodemailer.createTransport({
        host: 'mail.autopaquete.com.mx',
        port: 587,
        secure: false,
        auth: {
            user: 'contacto@autopaquete.com.mx',
            pass: '.Q2G9KV}@.=t',
        },
        // tls: {
        //     servername: 'smtp.mailtrap.io',
        // },
    });

    const mailOptions = {
        from: `"${name} ${lastName}" <${email}>`, // sender address
        replyTo: `"${name} ${lastName}" <${email}>`,
        to: 'contacto@autopaquete.com.mx', // list of receivers
        subject: 'Contacto a través del sitio web', // Subject line
        text: `Telefono: ${phone} Mensaje: ${message}`, // plain text body
        html: `<p><b>Contacto a través del sitio</b></p><div>Telefono: ${phone}</div><div>Mensaje: ${message}</div> `,
    };

    transporter.sendMail(mailOptions, (error, response) => {
        if (error) {
            res.send(error);
        } else {
            res.send('Success');
        }
    });

    // try {
    //     const info = await transporter.sendMail(mailOptions);

    //     console.log('Message sent: %s', info.messageId);
    //     res.status(200).send('OK');
    // } catch (err) {
    //     console.log(`Message Error ${err.message}`);
    //     res.status(500).send('Server Error');
    // }
    transporter.close();
});
