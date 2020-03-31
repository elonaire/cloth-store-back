const express = require("express");
const router = express.Router();
const {
  fetchPosts,
  createNewPost,
  editPost,
  deletePost
} = require("../controllers/blog");

router.get("/", fetchPosts);

router.post("/create", createNewPost);

router.patch("/edit/:id", editPost);

router.delete("/delete/:id", deletePost)

module.exports = router;
