const router = require('express').Router();
const accessController = require('../controllers/access.controller');
// const { authMiddleware } = require('../middlewares');

router.post('/login', accessController.login);
router.post('/register', accessController.register);
router.post('/verify', accessController.verify);
router.post('/resend', accessController.resend);
router.post('/validate-token', accessController.verifyToken);
router.post('/forgot-password', accessController.forgot);
router.post('/change-password', accessController.change);
router.post('/logout', accessController.logout);
router.put('/update-profile', require('../middlewares/auth.middleware'),accessController.update);

module.exports = router;