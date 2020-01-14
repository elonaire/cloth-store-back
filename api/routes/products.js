const express = require('express');
const router = express.Router();
const productsControllers = require('../controllers/products');
const path = require('path');
const multer = require('multer');
const upload = multer({dest: path.resolve('images/products')});

router.get('/', productsControllers.getProducts);

router.post('/add', upload.single('file'), productsControllers.addProduct);

router.patch('/edit/:id', productsControllers.editProduct);

router.delete('/delete/:id', productsControllers.deleteProduct);

module.exports = router;