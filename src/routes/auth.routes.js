const {Router} = require('express');
const router = Router();

const authCtr = require('../controllers/auth.controller');

const { verifySignup } = require('../middlewares');

router.post('/signup', [verifySignup.checkDuplicateUsernameOrEmail, verifySignup.checkRolesExisted], authCtr.signup);
router.post('/verify', authCtr.verify);
router.post('/signin', authCtr.signin);

module.exports = router;
