const { Store } = require('../../libs/presistantData');
const { genUid } = require('../../libs/uidGen');


async function readWriteDB(body, siteOrigin) {
    console.log(body);
    if(body.origin === siteOrigin) {
        const activeTokens = new Store('refreshTokens.json', setTime('2h'));
        let REFID = genUid(`${body.uid}${siteOrigin}`);
        activeTokens.remove(REFID);
        return { output: null, status: 204 }
    } else {
        return { output: "Unauthorized", status: 401 }
    }
}



exports.logOutUser = (req, res) => {
    const origin = req.headers.origin || "http://test_api.com";
 
    async function applyAction() {
        const clientInput = await readWriteDB(req.user, origin);
        res.status(clientInput.status).send(clientInput.output)
    }
    applyAction();
}