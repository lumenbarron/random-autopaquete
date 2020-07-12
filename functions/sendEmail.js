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

    const { name, lastName, phone, email, message } = req.body;

    const transporter = nodemailer.createTransport({
        host: 'mail.sitiorandom.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'programacion@sitiorandom.com', // generated ethereal user
            pass: '@!N!@*r4;}Rj', // generated ethereal password
        },
    });

    try {
        const info = await transporter.sendMail({
            from: `"${name} ${lastName}" <${email}>`, // sender address
            replyTo: `"${name} ${lastName}" <${email}>`,
            to: 'programacion@sitiorandom.com, programacionrandom@gmail.com', // list of receivers
            subject: 'Contacto a través del sitio', // Subject line
            text: `Telefono: ${phone} Mensaje: ${message}`, // plain text body
            html: `<p><b>Contacto a través del sitio</b></p><div>Telefono: ${phone}</div><div>Mensaje: ${message}</div> `,
        });

        console.log('Message sent: %s', info.messageId);
    } catch (err) {
        console.log(`Message Error ${err}`);
    }
});
