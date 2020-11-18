const { Router } = require('express');
const router = Router();

const apiDescriptionCtr = require('../controllers/apiDescription.controller');

router.get('/info', apiDescriptionCtr.info);
router.post('/getback', apiDescriptionCtr.getback);

module.exports = router;