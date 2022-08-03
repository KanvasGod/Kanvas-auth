// only request with api key pass this check
module.exports = (req, res, next) => {

    if(!req.headers['x-api-key']) 
        return res.sendStatus(401);

    if(req.headers['x-api-key'] === process.env.API_KEY) {
        next();
    } else {
        return res.sendStatus(401);
    }
};