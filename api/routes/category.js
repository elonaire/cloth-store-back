const express = require("express");
const router = express.Router();
const { fetchCategory, addCategory, addSubcategory } = require("../controllers/category");
const { adminGuard } = require("../middleware/auth-guard");

// fetch a category and all sub-categories related to it.
router.get("/", fetchCategory);

// add a category
router.post("/", adminGuard, addCategory);

// add a sub-category
router.post("/sub-category", adminGuard, addSubcategory);

module.exports = router;