const router = require('express').Router();
const accessController = require('../controllers/access.controller');
// const { authMiddleware } = require('../middlewares');

router.post('/login', accessController.login);
router.post('/register', accessController.register);
router.post('/verify', accessController.verify);
router.post('/resend', accessController.resend);
router.post('/forgot', accessController.forgot);
router.post('/logout', accessController.logout);

module.exports = router;