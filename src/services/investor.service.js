const Investor = require("../models/investor.model");
const userModel = require("../models/user.model");

const getInvestors = async () => {
  try {
    console.log("getInvestors");
    const investors = await Investor.find();
    return investors;
  } catch (error) {
    console.log("error :>> ", error);
    throw new Error(error);
  }
};

const getInvestorById = async (investorId) => {
  try {
    const investor = await Investor.findById(investorId);
    return investor;
  } catch (error) {
    console.log("error :>> ", error);
    throw new Error(error);
  }
};

const getInvestorFields = async (investorId, fields, isInvestor = true) => {
  try {
    if (!isInvestor) {
      const fieldsObject = fields.reduce((acc, field) => {
        acc[field] = 1;
        return acc;
      }, {});
      const user = await userModel.findById(investorId, {
        ...fieldsObject,
        _id: 0,
      });
      return user;
    }
    const fieldsObject = fields.reduce((acc, field) => {
      acc[field] = 1;
      return acc;
    }, {});
    const investor = await Investor.findById(investorId, {
      ...fieldsObject,
      _id: 0,
    });
    return investor;
  } catch (error) {
    console.log("error :>> ", error);
    throw new Error(error);
  }
};

async function updateInvestorPreferences(investorId, responses) {
  const preferences = {
    fundingCap: mapFundingCap(responses["7"]),
    riskTolerance: mapRiskTolerance(responses["8"]),
    expectedReturnRate: mapReturnRate(responses["9"]),
    // Los siguientes campos serán completados posteriormente con la interacción del inversor
    favoriteProjects: responses.favoriteProjects || [],
    savedProjects: responses.savedProjects || [],
    financedProjects: responses.financedProjects || [],
  };

  await Investor.findByIdAndUpdate(investorId, { preferences });
}

// Funciones para mapear las respuestas a los valores correspondientes
function mapFundingCap(response) {
  let minCap, maxCap;

  switch (response) {
    case "Inversiones moderadas ($10,000,000 - $30,000,000)":
      minCap = 10000000;
      maxCap = 30000000;
      break;
    case "Inversiones grandes ($30,000,000 - $50,000,000)":
      minCap = 30000000;
      maxCap = 50000000;
      break;
    case "Inversiones a gran escala ($50,000,000 - $90,000,000)":
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
    case "Prefiero la estabilidad (Bajo riesgo)":
      return 0.2;
    case "Estoy dispuesto a asumir ciertos riesgos (Moderado)":
      return 0.5;
    case "Me gusta la emoción de las grandes apuestas (Alto riesgo)":
      return 0.8;
    default:
      return 0;
  }
}

function mapReturnRate(response) {
  let baseRate;

  switch (response) {
    case "Retornos lentos y seguros (Bajo retorno esperado)":
      baseRate = 0.2;
      break;
    case "Un balance entre retorno y estabilidad (Moderado)":
      baseRate = 0.5;
      break;
    case "Busco retornos rápidos (Alto retorno esperado)":
      baseRate = 0.8;
      break;
    default:
      return 0;
  }

  // Generar un número aleatorio en el rango de -0.03 a 0.03
  const randomOffset = Math.random() * 0.06 - 0.03;

  // Retornar el valor base más el valor aleatorio
  return baseRate + randomOffset;
}

module.exports = {
  getInvestors,
  getInvestorById,
  getInvestorFields,
  updateInvestorPreferences,
};
