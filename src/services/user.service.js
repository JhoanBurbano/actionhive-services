const FORM_CONSTANT= require('../constants/form.constant');
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

async function updateUserPreferences(userId, responses) {
    const preferences = {
      preferredFundingCap: mapFundingCap(responses[FORM_CONSTANT.FUNDING_CAP]),
      riskTolerance: mapRiskTolerance(responses[FORM_CONSTANT.RISK_TOLERANCE]),
      expectedReturnRate: mapReturnRate(responses[FORM_CONSTANT.RETURN_RATE]),
      interests: responses.interests || [],
      skills: responses.skills || [],
      location: responses.location || ''
    };
  
    await User.findByIdAndUpdate(userId, { preferences });
  }
  
  // Función para mapear las respuestas a los valores correspondientes
  function mapFundingCap(response) {
    let minCap, maxCap;
  
    switch (response) {
      case 'Proyectos medianos ($10,000,000 - $30,000,000)':
        minCap = 10000000;
        maxCap = 30000000;
        break;
      case 'Grandes y ambiciosos ($30,000,000 - $50,000,000)':
        minCap = 30000000;
        maxCap = 50000000;
        break;
      case 'Proyectos a gran escala ($50,000,000 - $90,000,000)':
        minCap = 50000000;
        maxCap = 90000000;
        break;
      default:
        minCap = 1000000;
        maxCap = 5000000;
    }
  
    // Generar un número aleatorio dentro del rango [minCap, maxCap]
    return Math.floor(Math.random() * (maxCap - minCap + 1)) + minCap;
  }
  
  
  function mapRiskTolerance(response) {
    switch (response) {
      case 'Prefiero ir sobre seguro (Bajo riesgo)':
        return 0.2;
      case 'Puedo tomar algunos riesgos si la recompensa es buena (Moderado)':
        return 0.5;
      case 'Me encanta la aventura y los desafíos (Alto riesgo)':
        return 0.8;
      default:
        return 0;
    }
  }
  
  function mapReturnRate(response) {
    let baseRate;
  
    switch (response) {
      case 'Prefiero estabilidad a largo plazo (Bajo retorno esperado)':
        baseRate = 0.02;
        break;
      case 'Un balance entre estabilidad y resultados (Moderado)':
        baseRate = 0.08;
        break;
      case 'Me gusta ir por resultados rápidos y grandes (Alto retorno esperado)':
        baseRate = 0.15;
        break;
      default:
        return 0;
    }
  
    // Generar un número aleatorio en el rango de -0.03 a 0.03
    const randomOffset = (Math.random() * 0.06) - 0.03;
  
    // Retornar el valor base más el valor aleatorio
    return baseRate + randomOffset;
  }


module.exports = {
    getProjectsByUserId,
    addProjectToUser,
    removeProjectFromUser,
    generateAndRegisterFakeUsers,
    updateUserPreferences,
}