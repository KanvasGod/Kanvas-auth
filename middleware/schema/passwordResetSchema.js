const { objValidate } = require('../../libs/objValidate');
const { passwordV, emailV } = require('../../libs/regex');

module.exports = (req, res, next) => {

    // get password pin
    const getPin = objValidate({
        type: 'String',
        email: 'String'
    }, req.body);

    const changePassword = objValidate({
        pin: 'String',
        email: 'String',
        password: 'String'
    }, req.body)

    if(getPin || changePassword) {
        const isEmail = emailV(req.body.email);
        if(isEmail === false)
            return res.status(400).send('invalid email')
            
        if (changePassword) {
            const isValid = passwordV(req.body.password,1,1,1,1,8);
            if(isValid.pass === false)
                return res.status(400).send(isValid.message)
        }

        next();
    } else {
        return res.sendStatus(400)
    }

    
    

    
};