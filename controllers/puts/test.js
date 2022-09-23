const { setTime } = require('../../libs/timeConvert.js');
const { Store } = require('../../libs/presistantData');
const { serverDecipherSpeak } = require('../../libs/crypto');

exports.output = (req, res) => {
    const test = new Store('refreshTokens.json', setTime('2d'));
    // newKey = new Object();
    // newKey[req.body.id] = { cat: 'hello' };
    // test.add(newKey);


    // const body = req.body;
    res.send(serverDecipherSpeak(test.fetch('a15703fb-4574-595b-b4b9-5f9fab97b1bc'), process.env.USER_DATA_KEY))
}