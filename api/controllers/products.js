let getProducts = (req, res, next) => {
    res.status(200).json([]);
}

let addProduct = (req, res, next) => {
    // res.status(201).json({
    //     message: 'created',
    //     product_id: 'csgd25526ddvv8'
    // });

    res.status(201).json({
        message: 'created',
        product_id: req.file
    });
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