const crypto = require('crypto');
// const NodeRSA = require('node-rsa');
const algorithm = process.env.CRYPTO_ALGORITHM

// live encryption
// RSA public / private

// rsaCryptKeys = () => {
//     const key = new NodeRSA({b: 2048 });

//     return {
//         publicKey: key.exportKey('public'),
//         privateKey: key.exportKey('private')
//     }
// }

// rsaCipherSpeak = (text, key) => {
//     let keyPublic = new NodeRSA(key);
//     const encrypted = keyPublic.encrypt(text, 'base64');
//     return encrypted
// }

// rsaDeCipherSpeak = (text, key) => {
//     let keyPrivate = new NodeRSA(key);
//     let decrypted = keyPrivate.decrypt(text, 'utf8')
//     return decrypted
// }

// // diffey helman
serverCryptKey = () => {
    // creates the shared public key
    const server = crypto.createECDH('secp256k1');
    server.generateKeys();
    
    const client = crypto.createECDH('secp256k1');
    client.generateKeys();

    const serverPublicKeyBase64 = server.getPublicKey().toString('base64')
    const clientPublicKeyBase64 = client.getPublicKey().toString('base64')

    const serverShared = server.computeSecret(clientPublicKeyBase64, 'base64', 'hex')
    const clientShared = client.computeSecret(serverPublicKeyBase64, 'base64', 'hex')
    if (serverShared === clientShared) {
        return serverShared;
    } else {
        return false
    }
}

serverCipherSpeak = (text, shared) => {
    // server send encrypted message
    if (shared !== false) {
        const IV = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(algorithm, Buffer.from(shared, 'hex'), IV)
        let encrypted = cipher.update(text, 'utf8', 'hex')
        encrypted += cipher.final('hex')
        const auth_tag = cipher.getAuthTag().toString('hex')
        const payload = IV.toString('hex') + encrypted + auth_tag
        const payload64 = Buffer.from(payload, 'hex').toString('base64')
        // console.log(payload64);
        return payload64
    }
}

serverDecipherSpeak = (payload, shared) => {
    //decrypt client message
    const clientPayload = Buffer.from(payload, 'base64').toString('hex') 
    const IV = clientPayload.substr(0, 32)
    const encrypted = clientPayload.substr(32, clientPayload.length - 32 - 32)
    const auth_tag = clientPayload.substr(clientPayload.length - 32, 32)

    try {
        const decipher = crypto.createDecipheriv(
            algorithm, 
            Buffer.from(shared, 'hex'), 
            Buffer.from(IV, 'hex')
        );
        decipher.setAuthTag(Buffer.from(auth_tag, 'hex'));

        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted
    } catch (error) {
        console.log(error.message)
    }
}

compareHash = (password, hash, sharedKey) => {
    try {
        const HashToHash = serverDecipherSpeak(hash, sharedKey) ;
        const [salt, key] = HashToHash.split(':');
        const ecrypted = crypto.scryptSync(password, salt, 64).toString('hex');
        return key === ecrypted
    } catch (error) {
        console.log(error);
        return null
    }
}

// password hashing
getHash = (password, sharedKey) => {
    try {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.scryptSync(password, salt, 64).toString('hex');
        return serverCipherSpeak(`${salt}:${hash}`, sharedKey);
    } catch (error) {
        console.log(error);
        return null
    }   
}

module.exports = {
    getHash,
    compareHash,
    // rsaCryptKeys,
    // rsaCipherSpeak,
    // rsaDeCipherSpeak,
    serverCryptKey,
    serverCipherSpeak,
    serverDecipherSpeak
}