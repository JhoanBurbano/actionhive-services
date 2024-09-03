const { getInvestors, getInvestorFields } = require('../services/investor.service');

const router = require('express').Router();

router.get('/', async (req, res)=>{
    const resp = await getInvestors();
    res.status(200).json(resp);
});

router.get('/filter', async (req, res)=>{
    const { fields } = req.query;
    const { _id:id } = req.user
    const fieldsArray = fields?.split(',')  || [];
    if(!fields || !fieldsArray.length ) return res.status(400).json({error: 'fields query parameter is required'});
    const investor = await getInvestorFields(id, fieldsArray);
    return res.status(200).json({data: investor ?? fieldsArray.reduce((acc, field) => ({...acc, [field]: []}), {})});
});

module.exports = router;