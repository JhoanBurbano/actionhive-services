const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { secret } = require('../config');
const { mapToUserResponse } = require('../mappers/user.mapper');

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

const register = async (firstName, lastName, email, password, role) => {
    try {
        const user = await User.findOne({ email });
        if (user) return { status: 400, message: 'User already exists' };
        const hash = await bcrypt.hash(password, 10);
        const newUser = new User({ firstName, lastName, email, password: hash, role });
        await newUser.save();
        return { status: 201, message: 'User created', data: mapToUserResponse(newUser, token) };
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
        const token = jwt.sign({ id: user._id }, secret, { expiresIn: '24h' });
        return { status: 200, message: 'Token sent', token };
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
    resend,
    forgot,
    logout
}