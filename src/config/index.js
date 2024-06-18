require('dotenv').config();
const { MONGO_USER, MONGO_PASSWORD, MONGO_DATABASE, JWT_SECRET_KEY } = process.env


module.exports = {
    mongo: {
        user: MONGO_USER,
        password: MONGO_PASSWORD,
        database: MONGO_DATABASE
    },
    email: {
        user: process.env.EMAIL_USER,
        password: process.env.EMIAL_PASSWORD
    },
    webUrl: process.env.WEB_URL,
    secret: JWT_SECRET_KEY
};