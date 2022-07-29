const { v5: uuidv5 } = require('uuid');

genUid = (str) => {
    return uuidv5(str, `${process.env.UID_GEN}`);
}

module.exports = {
    genUid
}