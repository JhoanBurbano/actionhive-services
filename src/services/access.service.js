const User = require('../models/user.model');
const Investor = require('../models/investor.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { secret } = require('../config');
const { mapToUserResponse } = require('../mappers/user.mapper');
const { sendForgotEmail } = require('./email.service');
const { generateAndRegisterFakeUsers } = require('./user.service');
const { runScript } = require('./scripts.services');
const recommendProjectsForUsers = require('./recomendations');

const login = async (email, password, isInvestor = false) => {
    try {
        let user;
        if (isInvestor) {
            user = await Investor.findOne({ email });
        if (!user) return { status: 404, message: 'User not found' };
        if (!user.isActive) return { status: 403, message: 'User not active' };
        if (user.password !== password) return { status: 403, message: 'Invalid password' };
        } else {
         user = await User.findOne({ email });
        if (!user) return { status: 404, message: 'User not found' };
        if (!user.isActive) return { status: 403, message: 'User not active' };
        const match = await bcrypt.compare(password, user.password);
        if (!match) return { status: 403, message: 'Invalid password' };
        }
         const token = jwt.sign({ id: user._id }, secret, { expiresIn: '24h' });
        return { status: 200, message: 'Login success', data: mapToUserResponse(user, token, isInvestor)};
    } catch (error) {
        return { status: 500, message: error.message };
    }
}

const register = async (firstname, lastname, email, password, role) => {
    try {
        const user = await User.findOne({ email });
        if (user) return { status: 400, message: 'User already exists' };
        const hash = await bcrypt.hash(password, 10);
        const newUser = new User({ firstname, lastname, email, password: hash, role });
        const userData = await newUser.save();
        const token = jwt.sign({ id: userData._id }, secret, { expiresIn: '24h' });
        return { status: 201, message: 'User created', data: mapToUserResponse(userData, token) };
    }
    catch (error) {
        return { status: 500, message: error.message };
    }
}

const verify = async (email, token) => {
    try {
        const user = await User.findOne({ email });
        if (!user) return { status: 404, message: 'User not found' };
        if (user.isActive) return { status: 400, message: 'User already active' };
        const payload = jwt.verify(token, secret);
        if (payload.id !== user._id) return { status: 403, message: 'Invalid token' };
        user.isActive = true;
        await user.save();
        return { status: 200, message: 'User verified' };
    }
    catch (error) {
        return { status: 500, message: error.message };
    }
}

const verifyToken = async (token) => {
    try {
        // await generateAndRegisterFakeUsers(46).then(() => console.log('Fake users generated'));
        // await runScript()
        // throw new Error();
        const payload = jwt.verify(token, secret);
        if (!payload) return { status: 403, message: 'Invalid token' };
        const user = await User.findById(payload.id);
        const investor = await Investor.findById(payload.id);
        if (!user && !investor) return { status: 404, message: 'User not found' };
        // if (!user.isActive) return { status: 400, message: 'User not active' };
        return { status: 200, message: 'Token verified' };
    }
    catch (error) {
        return { status: 500, message: error.message };
    }
}

const resend = async (email) => {
    try {
        const user = await User.findOne({ email });
        if (!user) return { status: 404, message: 'User not found' };
        if (user.isActive) return { status: 400, message: 'User already active' };
        const token = jwt.sign({ id: user._id }, secret, { expiresIn: '24h' });
        return { status: 200, message: 'Token sent', token };
    }
    catch (error) {
        return { status: 500, message: error.message };
    }
}

const forgot = async (email) => {
    try {
        const user = await User.findOne({ email });
        if (!user) return { status: 404, message: 'User not found' };
        if (!user.isActive) return { status: 400, message: 'User not active' };
        const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });
        await sendForgotEmail(email, token);
        return { status: 200, message: 'Token sent', token };
    }
    catch (error) {
        return { status: 500, message: error.message };
    }
}

const reset = async (email, token, password) => {
    try {
        const user = await User.findOne({
            email,
            isActive: true
        });
        if (!user) return { status: 404, message: 'User not found' };
        const payload = jwt.verify(token, secret);
        if (payload.id !== user._id) return { status: 403, message: 'Invalid token' };
        const hash = await bcrypt.hash(password, 10);
        user.password = hash;
        await user.save();
        return { status: 200, message: 'Password reset success' };
    }
    catch (error) {
        return { status: 500, message: error.message };
    }
}

const change = async ( password, token) => {
    try {
        const payload = jwt.verify(token, secret);
        if (!payload) return { status: 403, message: 'Invalid token' };

        const hash = await bcrypt.hash(password, 10);
        const user = await User.findByIdAndUpdate(payload.id, { password: hash });
        if (!user) return { status: 404, message: 'User not found' };
        if (!user.isActive) return { status: 400, message: 'User not active' };
        return { status: 200, message: 'Password change success' };
    }
    catch (error) {
        return { status: 500, message: error.message };
    }
}

const logout = async (email) => {
    try {
        const user = await User.findOne({ email });
        if (!user) return { status: 404, message: 'User not found' };
        return { status: 200, message: 'Logout success' };
    }
    catch (error) {
        return { status: 500, message: error.message };
    }
}

const updateInvestor = async (password, email, firstname, lastname, token, id) => {
    try {
        console.log('email :>> ', email);
        const investorUpdate = { firstName: firstname, lastName: lastname, email };
        if(password) investorUpdate.password = password;
        const investor = await Investor.findByIdAndUpdate(id, investorUpdate);
        console.log(investor)
        if (!investor) return { status: 404, message: 'Investor not found' };
        return { status: 200, message: 'Investor updated', data: mapToUserResponse({...investor, firstName: firstname, lastName: lastname, email}, token, true) };
    } catch (error) {
        return { status: 500, message: error.message };
    }
}

const updateUser = async (password, email, firstname, lastname, rol, token, id) => {
    try {
        const user = await User.findByIdAndUpdate(id, { firstname, lastname, role: rol, email });
        if (!user) return { status: 404, message: 'User not found' };
        if(password) {
        const pswResponse = await change(password, token);
        if (pswResponse.status !== 200) return pswResponse;
        }
        return { status: 200, data: mapToUserResponse({ ...user, email, firstname, lastname, rol }, token, false) };
    } catch (error) {
        return { status: 500, message: error.message };
    }
}

const refresh = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) return { status: 404, message: 'User not found' };
        const token = jwt.sign({ id: user._id }, secret, { expiresIn: '24h' });
        return { status: 200, message: 'Token refreshed', data: mapToUserResponse(user, token) };
    } catch (error) {
        return { status: 500, message: error.message };
    }
}



module.exports = {
    login,
    register,
    verify,
    verifyToken,
    resend,
    forgot,
    logout,
    reset,
    change,
    updateInvestor,
    updateUser,
    refresh,
} 