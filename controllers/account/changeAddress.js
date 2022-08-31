const { compareHash } = require('../../libs/crypto');
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

    let addressObj = {}

    if(userEmails.address) {

        addressObj = userEmails.address;
        const nameList = Object.keys(addressObj);

        if(nameList.length >= 10)
            return {status: 400, output: "Over address limit"}

        if(nameList.includes(body.name))
            return {status: 400, output: "Naming conflict"}
            
        if (body.default) {
            nameList.forEach(el => {
                addressObj[el].default = false;
            });
            addressObj[body.name] = body.payload;
            addressObj[body.name].default = true;
            Address.set(addressObj);
            return {status: 201, output: "Address added as default"}
        }

        if (body.default === false) {
            addressObj[body.name] = body.payload;
            addressObj[body.name].default = true;
            Address.set(addressObj);
            return {status: 201, output: "Address added"}
        }
        
    } else {
        const setData = body.payload;
        setData.default = true;
        addressObj[body.name] = setData;
        Address.set(addressObj);
        return {status: 201, output: "Address added as default"}
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