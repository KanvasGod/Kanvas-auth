const { serverCipherSpeak, getHash } = require('../../libs/crypto');
const { randomCode } = require('../../libs/randomCode')
const jwt = require('../../libs/jsonTokens');
const { genUid } = require('../../libs/uidGen');
const admin = require('firebase-admin');
const db = admin.database();

async function createCustomer(payload) {
    const stripe = require('stripe')(process.env.STRIPE_KEY_TEST);
    const costomer = await stripe.customers.create({
        name: payload.name,
        email: payload.email,
        description: 'Kanvas development customer.'
    })
    return costomer
}

async function readWriteDB(body, siteOrigin) {
    const email = genUid(body.email)
    const userName = genUid(body.userName)
    const createAccount = db.ref(`Emails/${email}`);
    const createUserName = db.ref(`UserNameRefs/${userName}`);
    const checked = {};
    const failedCalls = {status: 201};

    const userEmails = await createAccount.once('value', data => {
        let result = data.val() !== null ? true : false;
        checked["emailTaken"] = result
    })

    const userNames = await createUserName.on('value', data => {
        let result = data.val() !== null ? true : false;
        checked["userNameTaken"] = result
    })
    
    if(checked["emailTaken"]) {
        return {status: 409, message: "Email Taken"}
    }

    if(checked["userNameTaken"]) {
        return {status: 409, message: "Username Taken"}
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
        name: body.name,
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

    failedCalls["output"] = genUid(`${body.email}${randomCode(4)}`)

    return failedCalls
}



exports.createNewUser = (req, res) => {
    const body = req.body;
    // start here collect clients hostname
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
            //  send to socket for keys and return socket id
            let socketRef = {
                user: clientInput.user,
                origin: origin,
                passKey:clientInput.output
            }
            console.log(socketRef);
            res.status(clientInput.status).json(clientInput.output)
        }
    }
    applyAction();
}