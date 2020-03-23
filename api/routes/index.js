const express = require('express');
const router = express.Router();
const { homePageData } = require('../controllers/index');
const { authGuard } = require('../middleware/auth-guard');

/* GET home page. */
router.get('/', homePageData);

module.exports = router;
