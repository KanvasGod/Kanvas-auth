const { genUid } = require('../../libs/uidGen');
const admin = require('firebase-admin');
const db = admin.database();

async function readWriteDB(body, uid) {

    const createAccount = db.ref(`Emails/${uid}`);

    let userEmails = await createAccount.once('value', data => {
        return data
    })

    userEmails = userEmails.val();
    const Address = db.ref(`Emails/${uid}/address`);

    if(userEmails.address) {

        let addressObj = userEmails.address;

        const result = Object.keys(addressObj).filter(name => {
            return name !== body.name
        })

        const pool = newObj => {
            let data = new Object();
            result.forEach(name => {
                data[name] = addressObj[name]; 
            })

            return data
        }

        Address.set(pool());
        return {status: 200, output: "Address removed"}
    } 
}

exports.update = (req, res) => {
    const uid = req.user.uid;

    async function applyAction() {
        const clientInput = await readWriteDB(req.body, genUid(uid));
        res.status(clientInput.status).send(clientInput.output)
    }
    applyAction();
}