import { createTransport, getTestMessageUrl } from 'nodemailer';
const functions = require('firebase-functions');

exports.send = functions.http.onRequest(req => {
    const transporter = createTransport({
        host: 'mail.sitiorandom.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'programacion@sitiorandom.com', // generated ethereal user
            pass: '@!N!@*r4;}Rj', // generated ethereal password
        },
    });

    let info = transporter.sendMail({
        from: 'Holi 👻' + req.body.email, // sender address
        to: 'programacion@sitiorandom.com, programacionrandom@gmail.com', // list of receivers
        subject: name + req.body.lastName, // Subject line
        text: phone + message, // plain text body
        html: `<b>Hello world?</b><h1>${message}</h1> `,
    });

    transporter.sendMail(info, (err, callback) => {
        if (err) {
            console.log('No se envio :(');
        }
        console.log('Se envio :)');
    });

    console.log('Message sent: %s', info.messageId);

    console.log('Preview URL: %s', getTestMessageUrl(info));
});
