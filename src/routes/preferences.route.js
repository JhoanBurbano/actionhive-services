const router = require('express').Router();
const preferencesController = require('../controllers/preferences.controller');

router.post('/update', preferencesController.updatePreferences);

module.exports = router;