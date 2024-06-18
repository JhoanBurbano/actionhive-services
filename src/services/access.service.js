const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { secret } = require('../config');
const { mapToUserResponse } = require('../mappers/user.mapper');
const { sendForgotEmail } = require('./email.service');

const login = async (email, passwword) => {
    try {
        const user = await User.findOne({ email });
        if (!user) return { status: 404, message: 'User not found' };
        if (!user.isActive) return { status: 401, message: 'User not active' };
        const match = await bcrypt.compare(passwword, user.password);
        if (!match) return { status: 401, message: 'Invalid password' };
        const token = jwt.sign({ id: user._id }, secret, { expiresIn: '24h' });
        return { status: 200, message: 'Login success', data: mapToUserResponse(user, token)};
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
        if (payload.id !== user._id) return { status: 401, message: 'Invalid token' };
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
        const payload = jwt.verify(token, secret);
        if (!payload) return { status: 401, message: 'Invalid token' };
        const user = await User.findById(payload.id);
        if (!user) return { status: 404, message: 'User not found' };
        if (!user.isActive) return { status: 400, message: 'User not active' };
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
        if (payload.id !== user._id) return { status: 401, message: 'Invalid token' };
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
        if (!payload) return { status: 401, message: 'Invalid token' };

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


module.exports = {
    login,
    register,
    verify,
    verifyToken,
    resend,
    forgot,
    logout,
    reset,
    change
} 