const { serverCipherSpeak, getHash } = require('../../libs/crypto');
const { Store } = require('../../libs/presistantData');
const { setTime } = require('../../libs/timeConvert');
const jwt = require('../../libs/jsonTokens');
const { genUid } = require('../../libs/uidGen');
const admin = require('firebase-admin');
const db = admin.database();

async function createCustomer(payload) {
    const stripe = require('stripe')(process.env.STRIPE_KEY_TEST);
    const costomer = await stripe.customers.create({
        email: payload.email,
        description: 'Kanvas development customer.'
    })
    return costomer
}

async function readWriteDB(body, siteOrigin) {
    const email = genUid(body.email);
    const userName = genUid(body.userName);
    const createAccount = db.ref(`Emails/${email}`);
    const createUserName = db.ref(`UserNameRefs/${userName}`);
    const checked = {};
    const failedCalls = {status: 201};

    const userEmails = await createAccount.once('value', data => {
        let result = data.val() !== null ? true : false;
        checked["emailTaken"] = result
    })

    const userNames = await createUserName.once('value', data => {
        let result = data.val() !== null ? true : false;
        checked["userNameTaken"] = result
    })
    
    if(checked["emailTaken"]) {
        return {status: 409, output: "Email Taken"}
    }

    if(checked["userNameTaken"]) {
        return {status: 409, output: "Username Taken"}
    }

    const finishedForm = {
        name: serverCipherSpeak(`${body.first} ${body.last}`, process.env.USER_DATA_KEY),
        userName: body.userName,
        email: body.email,
        password: getHash(body.password, process.env.USER_DATA_KEY),
        phone: serverCipherSpeak(body.phone, process.env.USER_DATA_KEY),
        stripeId: '',
        created: new Date().toString()
    }

    failedCalls["user"] = email
    failedCalls["failed"] = {}

    const customerId = await createCustomer({
        email: body.email
    })

    if(customerId.id) {
        finishedForm.stripeId = serverCipherSpeak(customerId.id, process.env.USER_DATA_KEY);
    } else {
        failedCalls.failed["stripeId"] = 'failed'
    }

    // create user account
    const accounts = db.ref('Emails');
    const userAccounts = accounts.child(email);
    userAccounts.set(finishedForm);

    // create a username reference
    const userNameRefs = db.ref('UserNameRefs');
    const userRefs = userNameRefs.child(userName);
    userRefs.set({
        email: body.email,
        ref: email
    });

    // site level visiblity
    const adminRefs = db.ref(`SiteLookup/${genUid(siteOrigin)}`);
    const ref = adminRefs.child(genUid(siteOrigin + body.email));
    ref.set({
        uid: body.email
    });

    const extra = {
        origin: siteOrigin
    }

    let auth = {
        authToken: jwt.createToken(body.email, 'logIn', extra),
        refreshToken: jwt.createToken(body.email, 'refresh', extra)
    }

    failedCalls["output"] = auth

    return failedCalls
}

exports.createNewUser = (req, res) => {
    const body = req.body;
    const origin = req.headers.origin || "http://test_api.com";

    async function applyAction() {
        const clientInput = await readWriteDB(body, origin);
        if(clientInput.failed) {
            const keys = Object.keys(clientInput.failed);
            if(keys.length > 0) {
                // send data to troubleshoot
                const package = {
                    user: clientInput.user,
                    failed: keys
                }
                const userNameRefs = db.ref('Admin/Notice');
                const userRefs = userNameRefs.child();
                userRefs.set(package);
            }
            // send to socket for keys and return socket id
            newKey = new Object();
            const activeTokens = new Store('refreshTokens.json', setTime('2d'));
            newKey[genUid(`${body.email}${origin}`)] = serverCipherSpeak(clientInput.output.refreshToken, process.env.USER_DATA_KEY);
            activeTokens.add(newKey);
            
            res.status(clientInput.status).json(clientInput.output);
        } else {
            res.status(clientInput.status).send(clientInput.output);
        }
    }
    applyAction();
}