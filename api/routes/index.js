const express = require('express');
const router = express.Router();
const indexControllers = require('../controllers/index')

/* GET home page. */
router.get('/', indexControllers.homePageData);

module.exports = router;
