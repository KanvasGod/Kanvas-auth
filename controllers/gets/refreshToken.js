const { serverDecipherSpeak, serverCipherSpeak } = require('../../libs/crypto');
const { Store } = require('../../libs/presistantData');
const { setTime } = require('../../libs/timeConvert');
const jwt = require('../../libs/jsonTokens');
const { genUid } = require('../../libs/uidGen');

async function readWriteDB(siteOrigin, user) {
    const activeTokens = new Store('refreshTokens.json', setTime('2h'));
    let REFID = genUid(`${user.uid}${siteOrigin}`);
    const token = activeTokens.fetch(REFID);
    
    if(token) {
        const DB = serverDecipherSpeak(token, process.env.USER_DATA_KEY);
        const extra = {
            origin: siteOrigin
        }
        
        let output = {
            authToken: jwt.createToken(user.uid, 'logIn', extra),
            refreshToken: jwt.createToken(user.uid, 'refresh', extra)
        }

        newKey = new Object();
        newKey[REFID] = serverCipherSpeak(output.refreshToken, process.env.USER_DATA_KEY);
        activeTokens.add(newKey);

        return {status: 200, output: output}
    } else {
        return {status: 405, output: ""}
    }
}

exports.refresh = (req, res) => {
    const origin = req.headers.origin || "http://test_api.com";
 
    async function applyAction() {
        const clientInput = await readWriteDB(origin, req.user);
        res.status(clientInput.status).send(clientInput.output)
    }
    applyAction();
}