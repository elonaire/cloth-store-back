const express = require("express");
const router = express.Router();
const {adminGuard} = require('../middleware/auth-guard')
const {
  fetchPosts,
  createNewPost,
  editPost,
  deletePost
} = require("../controllers/blog");

router.get("/", fetchPosts);

router.post("/create", adminGuard, createNewPost);

router.patch("/edit/:id", adminGuard, editPost);

router.delete("/delete/:id", adminGuard, deletePost)

module.exports = router;
