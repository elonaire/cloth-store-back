const express = require("express");
const router = express.Router();
const { adminGuard, authGuard } = require("../middleware/auth-guard");
const { fetchFiles } = require("../controllers/files");

router.get("", fetchFiles);

module.exports = router;