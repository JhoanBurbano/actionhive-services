const { getInvestors } = require('../services/investor.service');

const router = require('express').Router();

router.get('/', async (req, res)=>{
    const resp = await getInvestors();
    res.status(200).json(resp);
});

module.exports = router;