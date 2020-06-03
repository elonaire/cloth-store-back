const generateUUID = require('uuid/v4');

class BlogPost {
    constructor(post_id, title, author, post) {
        this.post_id = post_id;
        this.title = title;
        this.author = author;
        this.post = post;
    }
}

const createNewBlogPost = (blogPostClass) => {
    const postId = generateUUID();

    let blogPost = new blogPostClass(postId, 'Sample Title', 'Nellies K. Ligaga', 'My name is Nellies K. Ligaga. I love writing articles, such as this one.');

    return blogPost;
}

module.exports = {
    BlogPost,
    createNewBlogPost
}