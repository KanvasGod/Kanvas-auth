const serviceAccount = require('./fireBaseConfig.json');
const PORT = process.env.PORT || 3000;
const admin = require('firebase-admin');
const express = require('express');

const app = express();

require('dotenv').config();
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, PUT, GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DB_URL
});

const puts = require('./routes/postRoutes');
app.use('/v1', puts);

app.listen(PORT, () => {
    console.log(`Accounts api on port ${PORT}`);
})