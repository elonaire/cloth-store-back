const fetchPosts = (req, res, next) => {
    res.status(200).json([]);
}

const createNewPost = (req, res, next) => {
    res.status(201).json({});
}

const editPost = (req, res, next) => {
    res.status(200).json({})
}

const deletePost = (req, res, next) => {
    res.status(200).json({})
}

module.exports = {
    fetchPosts,
    createNewPost,
    editPost,
    deletePost
}