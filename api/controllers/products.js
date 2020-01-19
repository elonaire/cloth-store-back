const Product = require('../models').Product;

let getProducts = (req, res, next) => {
    res.status(200).json([]);
}

let addProduct = async (req, res, next) => {
    let requestDetails = req.body;

    let product = {};
    let file = req.file;
    

    for(let field of Object.keys(requestDetails)) {
        product[field] = requestDetails[field];
    }


    res.status(201).json({
        message: 'created',
        file,
        product
    });

    // let createdProduct = await Product.create(product);
}

let editProduct = (req, res, next) => {
    res.status(200).json({
        message: 'edited'
    });
}

let deleteProduct = (req, res, next) => {
    res.status(200).json({
        message: `${req.params.id} was deleted`
    });
}

module.exports = {
    getProducts,
    addProduct,
    editProduct,
    deleteProduct
}