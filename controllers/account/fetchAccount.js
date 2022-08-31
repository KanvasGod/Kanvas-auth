const { serverDecipherSpeak } = require('../../libs/crypto');
const { genUid } = require('../../libs/uidGen');
const admin = require('firebase-admin');
const db = admin.database();


async function readWriteDB(body, uid) {

    const createAccount = db.ref(`Emails/${uid}`);

    let userEmails = await createAccount.once('value', data => {
        return data
    })
    
    let dbData = [
        'address', 'created', 
        'email', 'userName'
    ]

    let dbCrypt = ['phone', 'name']

    let addressObj = userEmails.val();

    if(dbData.includes(body.type)) {
        return {status: 200, output: addressObj[body.type]}
    }

    if(dbCrypt.includes(body.type)) {
        return {status: 200, output: serverDecipherSpeak(addressObj[body.type], process.env.USER_DATA_KEY)}
    }


    if(body.type === 'all') {
        let pool = new Object();
        dbData.forEach(item => {
            pool[item] = addressObj[item];
        })

        dbCrypt.forEach(item => {
            pool[item] = serverDecipherSpeak(addressObj[item], process.env.USER_DATA_KEY);
        })

        return {status: 200, output: pool}
    }

    return {status: 404, output: ""}
}

exports.update = (req, res) => {
    const uid = req.user.uid;

    async function applyAction() {
        const clientInput = await readWriteDB(req.body, genUid(uid));
        res.status(clientInput.status).send(clientInput.output)
    }
    applyAction();
}