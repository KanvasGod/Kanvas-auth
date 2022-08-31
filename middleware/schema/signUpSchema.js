const { objValidate } = require('../../libs/objValidate');
const { passwordV, emailV, minMaxV, phoneV } = require('../../libs/regex');

module.exports = (req, res, next) => {

    const result = objValidate({
        first: 'String',
        last: 'String',
        email: 'String',
        password: 'String',
        userName: 'String',
        phone: 'String'
    }, req.body);

    if(result === false) {
        return res.sendStatus(400)
    }
    let nameLimits = '!@#$%^&*(){}[]|":;?<>/+=-_~1234567890, '

    const firstName = minMaxV(req.body.first, 1, 25, nameLimits);
    if(firstName.pass === false)
        return res.status(400).send(firstName.message)

    const lastName = minMaxV(req.body.last, 1, 25, nameLimits);
    if(lastName.pass === false)
        return res.status(400).send(lastName.message)

    const userName = minMaxV(req.body.last, 4, 30, "&='+,()[]{}<>./:; ");
    if(userName.pass === false)
        return res.status(400).send(userName.message)

    const isEmail = emailV(req.body.email);
    if(isEmail === false)
        return res.status(400).send('invalid email')

    const isPassword = passwordV(req.body.password,1,1,1,1,8);
    if(isPassword.pass === false)
        return res.status(400).send(isPassword.message)

    const isPhone = phoneV(req.body.phone);
    if(isPhone.pass === false) {
        return res.status(400).send(isPhone.message)
    }

    next();
};