const express = require('express');
const router = express.Router();
const indexControllers = require('../controllers/index')
const authGuard = require('../middleware/auth-guard').authGuard;

/* GET home page. */
router.get('/', authGuard, indexControllers.homePageData);

module.exports = router;
