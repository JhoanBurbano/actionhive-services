const Investor = require('../models/investor.model');
const userModel = require('../models/user.model');

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

const getInvestorFields = async (investorId, fields, isInvestor = true) => {
    try {
        if(!isInvestor) {
            const fieldsObject = fields.reduce((acc, field) => {
                acc[field] = 1;
                return acc;
            }, {});
        const user = await userModel.findById(investorId, {...fieldsObject, _id: 0} );
            return user
        }
        const fieldsObject = fields.reduce((acc, field) => {
            acc[field] = 1;
            return acc;
        }, {});
        const investor = await Investor.findById(investorId, {...fieldsObject, _id: 0} );
        return investor;
    } catch (error) {
        console.log('error :>> ', error);
        throw new Error(error);
    }
}



module.exports = {
    getInvestors,
    getInvestorById,
    getInvestorFields,
}
