const Product = require("../models").Product;
const ProductFile = require("../models").ProductFile;
const File = require("../models").File;
const generateUUID = require("uuid/v4");
const mockFiles = require("../seeders/products").files;
const jsonpatch = require("jsonpatch");

let getProducts = async (req, res, next) => {
  // fetch all
  let products = await Product.findAll({
    where: {}
  });

  // fetch by filters - TODO

  res.status(200).json(products);
};

let addProduct = async (req, res, next) => {
  let requestDetails = req.body;

  let product = {};
  // check if product_id is defined - (for tests, it is already defined)
  product["product_id"] = requestDetails.product_id
    ? requestDetails.product_id
    : generateUUID();

  console.log("pid", product["product_id"]);

  for (let field of Object.keys(requestDetails)) {
    product[field] = requestDetails[field];
  }

  try {
    let createdProduct = await Product.create(product);
  } catch (error) {
    res.status(400).json(error);
  }

  let productPictures = [];
  let files;

  if (process.env.NODE_ENV === "test") {
    files = mockFiles;
  } else {
    files = req.files;
  }
  console.log("files", files);

  for (let fileDetails of files) {
    let mimetype = fileDetails.mimetype;
    let begin = mimetype.lastIndexOf("/") + 1;
    let extension = mimetype.substr(begin);
    let filename = fileDetails.filename
      ? fileDetails.filename
      : `${generateUUID() + "." + extension}`;

    let file = {};
    file["file_name"] = filename;
    file["file_id"] = generateUUID();
    productPictures.push(file);
  }

  console.log("productPictures", productPictures);

  for (let productPicture of productPictures) {
    try {
      let cFile = await File.create(productPicture);
      let pFile = await ProductFile.create({
        product_id: product["product_id"],
        file_id: productPicture.file_id
      });
    } catch (error) {
      res.status(400).json({ error, msg: "NEH" });
    }
  }

  res.status(201).json({
    message: "created"
  });
};

let editProduct = async (req, res, next) => {
  const changes = req.body;

  let prodId = req.params.id;
  try {
    let product = await Product.findOne({
      where: {
        product_id: prodId
      }
    });
    
    console.log("changes", changes);

    let editedProduct = null;
    if (product) {
      editedProduct = await Product.update(changes, {
        where: {
          product_id: prodId
        }
      });

      if (editedProduct) {
        res.status(200).json({
          message: 'Edit Successful'
        });
      } else {
        throw "Product was not edited"
      }
    }
  } catch (error) {
    res.json({
      error
    });
  }
};

let deleteProduct = async (req, res, next) => {
  let product_id = req.params.id;

  try {
    let deletedProduct = await Product.destroy({
      where: {
        product_id
      }
    });

    // check if a deletion has occured to prove that the product existed
    let message = deletedProduct
      ? "Deleted Succesfully"
      : (() => {
          throw "Product does not exist";
        })();

    res.status(200).json({
      message
    });
  } catch (error) {
    res.status(404).json({
      error
    });
  }
};

module.exports = {
  getProducts,
  addProduct,
  editProduct,
  deleteProduct
};
