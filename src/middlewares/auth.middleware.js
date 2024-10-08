// middleware de authenticacion

const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/user.model.js');
const Investor = require('../models/investor.model.js');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const data = jwt.verify(token, config.secret);
        const user = await User.findById(data.id);
        const investor = await Investor.findById(data.id);
        if (!user && !investor) {
            throw new Error();
        }
        req.user = user || investor;
        req.token = token;
        next();
    }
    catch (error) {
        res.status(403).send({ error: 'Not authorized to access this resource' });
    }
}


module.exports = auth;