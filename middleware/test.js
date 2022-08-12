const { objValidate } = require('../libs/objValidate');

module.exports = (req, res, next) => {

    const result = objValidate({
        id: 'String null',
        password: 'String password'
    }, req.body);

    if(result === false) {
        return res.sendStatus(400)
    }
    next();
};