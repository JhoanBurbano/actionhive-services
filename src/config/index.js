require('dotenv').config();
const { MONGO_USER, MONGO_PASSWORD, MONGO_DATABASE, JWT_SECRET_KEY } = process.env


module.exports = {
    mongo: {
        user: MONGO_USER,
        password: MONGO_PASSWORD,
        database: MONGO_DATABASE
    },
    secret: JWT_SECRET_KEY
};