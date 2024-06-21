const User = require('../models/user.model');

const getProjectsByUserId = async (userId) => {
    try {
        const projects = await User.findById(userId, { projects: 1});
        return projects?.projects || [];
    } catch (error) {
        console.log('error :>> ', error);
        throw new Error(error);
    }
}

module.exports = {
    getProjectsByUserId,
}