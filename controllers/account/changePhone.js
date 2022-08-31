const { compareHash, serverCipherSpeak } = require('../../libs/crypto');
const { genUid } = require('../../libs/uidGen');
const admin = require('firebase-admin');
const db = admin.database();

async function readWriteDB(body, uid) {

    const createAccount = db.ref(`Emails/${uid}`);

    let userEmails = await createAccount.once('value', data => {
        return data
    })
    userEmails = userEmails.val();

    const matchHashes = compareHash(body.password, userEmails.password, process.env.USER_DATA_KEY);

    if(matchHashes) {
        const changeAccount = db.ref(`Emails/${uid}/phone`);
        const cryptPhone = serverCipherSpeak(body.phone, process.env.USER_DATA_KEY)
        changeAccount.set(cryptPhone);
        return {status: 201, output: "User phone has been changed"}
    } else {
        return {status: 401, output: "Invalid password"}
    }
}


exports.update = (req, res) => {
    const uid = req.user.uid

    async function applyAction() {
        const clientInput = await readWriteDB(req.body, genUid(uid));
        res.status(clientInput.status).send(clientInput.output)
    }
    applyAction();
}