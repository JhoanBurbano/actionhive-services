
const accessService = require('../services/access.service');


const login = async (req, res) => {
    const { email, password } = req.body;
    const response = await accessService.login(email, password);
    res.status(response.status).json(response);
    };

const register = async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;
    const response = await accessService.register(firstName, lastName, email, password, role);
    res.status(response.status).json(response);
};

const verify = async (req, res) => {
    const { email, token } = req.body;
    const response = await accessService.verify(email, token);
    res.status(response.status).json(response);
}

const resend = async (req, res) => {
    const { email } = req.body;
    const response = await accessService.resend(email);
    res.status(response.status).json(response);
}

const forgot = async (req, res) => {
    const { email } = req.body;
    const response = await accessService.forgot(email);
    res.status(response.status).json(response);
}

const logout = async (req, res) => {
    const { email } = req.body;
    const response = await accessService.logout(email);
    res.status(response.status).json(response);
}

module.exports = {
    login,
    register,
    verify,
    resend,
    forgot,
    logout,
};