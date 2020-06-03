const { Blog } = require("../models");
const generateUUID = require("uuid/v4");

const fetchPosts = async (req, res, next) => {
  let filter = {};
  let limit = null;

  if (req.query.post_id) {
    filter['post_id'] = req.query.post_id;
    limit = 1;
  }

  try {
    let posts = await Blog.findAll({
      where: filter,
      limit
    });

    if (!posts) {
      throw {
        error: "Posts not found",
        statusCode: 400,
      };
    }

    res.status(200).json(posts);
  } catch (error) {}
};

const createNewPost = async (req, res, next) => {
  const blogPost = req.body;
  if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "production"
  ) {
    blogPost["post_id"] = generateUUID();
  }
  console.log(blogPost);

  try {
    const createdBlogPost = await Blog.create(blogPost);
    if (!createdBlogPost) {
      throw {
        error: "Creating Blog Post failed",
        statusCode: 400,
      };
    }
    res.status(201).json(createdBlogPost);
  } catch (error) {
    console.log(error);
    if (!error.statusCode) {
      error['statusCode'] = 400;
    }
    res.status(error.statusCode).json(error);
  }
};

const editPost = async (req, res, next) => {
  let postId = req.params.id;
  let changes = req.body;

  try {
    let blogPost = await Blog.findOne({
      where: {
        post_id: postId,
      },
    });

    if (!blogPost) {
      throw {
        error: "Blog post not found",
        statusCode: 404,
      };
    }

    let editedBlogPost = null;
    if (blogPost) {
      editedBlogPost = await Blog.update(changes, {
        where: {
          post_id: postId,
        },
      });

      if (editedBlogPost) {
        res.status(200).json({
          message: "Edit Successful",
        });
      } else {
        throw {
          error: "Order was not edited",
          statusCode: 400,
        };
      }
    }

    // console.log('found', blogPost);
  } catch (error) {
    res.status(error.statusCode).json(error);
  }
};

const deletePost = async (req, res, next) => {
  let post_id = req.params.id;

  try {
    let deleted = await Blog.destroy({
      where: {
        post_id,
      },
    });

    if (!deleted) {
      throw {
        error: "Blog Post not found",
        statusCode: 404,
      };
    }

    res.status(200).json({
      message: "Blog Post deleted succesfully",
      deleted,
    });
  } catch (error) {
    res.status(error.statusCode).json(error);
  }
};

module.exports = {
  fetchPosts,
  createNewPost,
  editPost,
  deletePost,
};
