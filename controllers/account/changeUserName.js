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

    const matchHashes = compareHash(body.password, userEmails.password, process.env.USER_DATA_KEY);

    if(matchHashes) {
        const userName = genUid(body.userName);
        let checkUserName = db.ref(`UserNameRefs/${userName}`);
        let userNamesList = await checkUserName.once('value', data => {
            return data
        })
        userNamesList = userNamesList.val() !== null ? false : true;

        if(userNamesList) {
            const changeAccount = db.ref(`Emails/${uid}/userName`);
            changeAccount.set(body.userName);
            checkUserName = db.ref(`UserNameRefs/${genUid(userEmails.userName)}`);
            checkUserName.remove();

            const userNameRefs = db.ref('UserNameRefs');
            const userRefs = userNameRefs.child(userName);
            userRefs.set({
                email: userEmails.email,
                ref: uid
            });

            return {status: 201, output: "Username has been changed"}
        }
        
        return {status: 403, output: "UserName is taken"}
        
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