const { objValidate } = require('../../libs/objValidate');
const { passwordV } = require('../../libs/regex');

module.exports = (req, res, next) => {

    const result = objValidate({
        id: 'String null',
        password: 'String password'
    }, req.body);

    if(result === false) {
        return res.sendStatus(400)
    }

    const isValid = passwordV(req.body.password,1,1,1,1,8);
    if(isValid.pass === false)
        return res.status(400).send(isValid.message)

    next();
};