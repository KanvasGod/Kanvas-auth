const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SEND_GRID_KEY);

async function sendMessage(formAddIns) {
    const htmlToText = formAddIns.html.replace(/<(.|\n)*?>/g, '');
    const msg = {
        to: formAddIns.to,
        from: 'support@techcommute.com',
        subject: formAddIns.subject,
        text: htmlToText,
        html: formAddIns.html
    }
    let result = false 
    const mailer = await sgMail.send(msg).then(() => {
        result = true
    })
    .catch(error => {
        console.error(error);
    })
    return result
}

module.exports = {
    sendMessage
}