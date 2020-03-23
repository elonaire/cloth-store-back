const express = require('express');
const router = express.Router();
const indexControllers = require('../controllers/index')
const { authGuard } = require('../middleware/auth-guard');

/* GET home page. */
router.get('/', indexControllers.homePageData);

module.exports = router;
