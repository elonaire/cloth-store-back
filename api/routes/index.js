const express = require('express');
const router = express.Router();
const indexControllers = require('../controllers/index')

/* GET home page. */
router.post('/', indexControllers.homePageData);

module.exports = router;
