const User = require('../models/user.model');
const faker = require('faker');

const options = [
    { value: "ingeniero", label: "Ingeniero" },
    { value: "financista", label: "Financista" },
    { value: "administrador", label: "Administrador" },
    { value: "emprendedor", label: "Emprendedor" },
    { value: "diseñador", label: "Diseñador" },
    { value: "agricultor", label: "Agricultor" },
  ];

const getProjectsByUserId = async (userId) => {
    try {
        const projects = await User.findById(userId, { projects: 1});
        return projects?.projects || [];
    } catch (error) {
        console.log('error :>> ', error);
        throw new Error(error);
    }
}

const addProjectToUser = async (userId, projectId) => {
    try {
        await User.findByIdAndUpdate(userId, { $push: { projects: projectId } });
    } catch (error) {
        console.log('error :>> ', error);
        throw new Error(error);
    }
}

const removeProjectFromUser = async (userId, projectId) => {
    try {
        await User.findByIdAndUpdate(userId, { $pull: { projects: projectId } });
    } catch (error) {
        console.log('error aca:>> ', error);
        throw new Error(error);
    }
}


async function generateAndRegisterFakeUsers(numUsers) {
    console.log('here :>> ');
    try {
        
        const commonPassword = "$2b$10$fUGg6pwNiQlZoYhDyzqLHOaSCQ0TFJpPYq3kS4BJytWSrV5kso4Jy"
        for (let i = 0; i < numUsers; i++) {
            const firstname = faker.name.firstName();
            const lastname = faker.name.lastName();
            const email = faker.internet.email(firstname, lastname);
            const role = options[Math.floor(Math.random() * options.length)].value; // Selección aleatoria de rol
            const newUser = new User({ firstname, lastname, email, password: commonPassword, role });
            await newUser.save();
        }
    } catch (error) {
        console.log('error :>> ', error);
        throw new Error(error);
    }
}


module.exports = {
    getProjectsByUserId,
    addProjectToUser,
    removeProjectFromUser,
    generateAndRegisterFakeUsers,
}