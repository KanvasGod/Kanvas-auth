const { compareHash } = require('../../libs/crypto');
const { Store } = require('../../libs/presistantData');
const { genUid } = require('../../libs/uidGen');
const { setTime } = require('../../libs/timeConvert');
const jwt = require('../../libs/jsonTokens');
const admin = require('firebase-admin');
const db = admin.database();
// app vars =====>

async function readWriteDB(body, siteOrigin) {
    let id = genUid(body.id);
    let checked = null;

    let Account = db.ref(`Emails/${id}`);
    const UserName = db.ref(`UserNameRefs/${id}`);
    // get user account data
    await Account.once('value', data => {
        let result = data.val();
        if(result !== null) {
            checked = result;
        }
    })

    await UserName.once('value', data => {
        let result = data.val();
        if(result !== null) {
            checked = result;
        }
    })

    if(checked !== null) {
        if(checked.ref)
            id = checked.ref
            Account = db.ref(`Emails/${id}`);
            await Account.once('value', data => {
                let result = data.val();
                if(result !== null) {
                    checked = result;
                }
            })
    }
    
    // is data valid ?

    if(checked !== null) {
        const matchHashes = compareHash(body.password, checked.password, process.env.USER_DATA_KEY);
        if(matchHashes) {
            let check2 = null
            let adminRefs = db.ref(`SiteLookup/${genUid(siteOrigin)}/${genUid(siteOrigin + checked.email)}`);
            await adminRefs.once('value', data => {
                check2 = data.val() !== null ? true : false;
            })
            
            if (!check2) {
                adminRefs = db.ref(`SiteLookup/${genUid(siteOrigin)}`);
                adminRefs.child(genUid(siteOrigin + checked.email)).set({
                    uid: checked.email
                })
            }

            const extra = {
                origin: siteOrigin
            }

            let auth = { 
                status: 200,
                email: checked.email,
                output: {
                    authToken: jwt.createToken(checked.email, 'logIn', extra),
                    refreshToken: jwt.createToken(checked.email, 'refresh', extra)
                }
            }

            return auth
        }
    } 
    return {status: 403, output: "Username or password invalid"}
}

exports.fetchUserAccount = (req, res) => {
    const body = req.body;
    const origin = req.headers.origin || "http://test_api.com";

    async function applyAction() {
        const clientInput = await readWriteDB(body, origin);
        if(clientInput.email) {
            const activeTokens = new Store('refreshTokens.json', setTime('2h'));
            newKey = new Object();
            newKey[genUid(`${clientInput.email}${origin}`)] = clientInput.output
            activeTokens.add(newKey);
        }

        res.status(clientInput.status).send(clientInput.output)
    }
    applyAction();
}