const Investor = require('../models/investor.model');

const getInvestors = async () => {
    try {
        console.log('getInvestors');
        const investors = await Investor.find();
        return investors;
    } catch (error) {
        console.log('error :>> ', error);
        throw new Error(error);
    }
}

const getInvestorById = async (investorId) => {
    try {
        const investor = await Investor.findById(investorId);
        return investor;
    } catch (error) {
        console.log('error :>> ', error);
        throw new Error(error);
    }
}



module.exports = {
    getInvestors,
    getInvestorById,
}
