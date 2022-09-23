const { serverCipherSpeak, getHash } = require('../../libs/crypto');
const { template } = require('../../templates/template');
const { sendMessage } = require('../../libs/sendEmail');
const { Store } = require('../../libs/presistantData');
const { setTime } = require('../../libs/timeConvert');
const { genUid, randomCode } = require('../../libs/uidGen');
const admin = require('firebase-admin');
const db = admin.database();

// composite email
async function send(email, pin, origin) {
    const client = await sendMessage({
        to: email,
        subject: 'Password reset request for Kanvas account',
        html: template({
            section_1: `
                Sombody requested we send you a pin to reset your password.
                For your Kanvas account through ${origin}. We are hoping that was you, so here you go.
            `,
            pin_1: pin,
            section_2: 'If you do not wish to change your password, disregard this email and no action will be taken.',
            footer: false
        })
    })
}

// 

async function readWriteDB(body) {

};

exports.update = (req, res) => {
    const origin = req.headers.origin || "http://test_api.com";
    // brute force check
    // const logCount = new Store('bruteForce.json', setTime('30min'));
    const body = req.body;

    async function applyAction() {
        const pins = new Store('pins.json', setTime('15min'));

        if(req.body.type === 'getPin') {
            // gen pin
            const range = [6,8,7,8,6]
            let pin = randomCode(range[Math.floor(Math.random())]).toUpperCase();
            // send pin
            send(body.email, pin, origin);
            // save to pins
            newKey = new Object();
            newKey[genUid(`${req.body.email}`)] = serverCipherSpeak(pin, process.env.USER_DATA_KEY);
            pins.add(newKey);
            res.status(200).send(pin);
        }

        if(req.body.type === 'summit') {
            // start here
        }

        // const clientInput = await readWriteDB(req.body);
    }

    applyAction();
};