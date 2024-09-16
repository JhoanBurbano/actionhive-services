
const accessService = require('../services/access.service');

const refresh = async (req, res) => {
    const response = await accessService.refresh(req.user._id);
    res.status(response.status).json(response);
}


const login = async (req, res) => {
    const { email, password, isInvestor } = req.body;
    const response = await accessService.login(email, password, isInvestor);
    res.status(response.status).json(response);
    };

const register = async (req, res) => {
    const { firstname, lastname, email, password, rol } = req.body;
    const response = await accessService.register(firstname, lastname, email, password, rol);
    res.status(response.status).json(response);
};

const verify = async (req, res) => {
    const { email, token } = req.body;
    const response = await accessService.verify(email, token);
    res.status(response.status).json(response);
}

const verifyToken = async (req, res) => {
    const { token } = req.body;
    const response = await accessService.verifyToken(token);
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

const change = async (req, res) => {
    const { token, password } = req.body;
    const response = await accessService.change(password, token);
    res.status(response.status).json(response);
}

const logout = async (req, res) => {
    const { email } = req.body;
    const response = await accessService.logout(email);
    res.status(response.status).json(response);
}

const update = async (req, res) => {
    const { email, firstname, lastname, rol, isInvestor, password } = req.body;
    const params = isInvestor ? [password?.length ? password : null, email, firstname, lastname] : [password?.length ? password : null, email, firstname, lastname, rol];
    params.push(req.token, req.user._id);
    const update = isInvestor ? accessService.updateInvestor: accessService.updateUser;
    const response = await update(...params);
    res.status(response.status).json(response);
}

module.exports = {
    login,
    register,
    verify,
    verifyToken,
    resend,
    forgot,
    logout,
    change,
    update,
    refresh
};