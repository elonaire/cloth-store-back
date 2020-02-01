const express = require("express");
const router = express.Router();
const productsControllers = require("../controllers/products");
const path = require("path");
const multer = require("multer");
const generateUUID = require("uuid/v4");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve("public/images/products"));
  },
  filename: (req, file, cb) => {
    let randName = generateUUID();
    console.log('name', randName);
    
    let mimetype = file.mimetype;
    let begin = mimetype.lastIndexOf("/") + 1;
    let extension = mimetype.substr(begin);
    let file_name = `${randName}.${extension}`;
    cb(null, file_name);
  }
});

const upload = multer({ storage });

router.get("/", productsControllers.getProducts);

router.post(
  "/add",
  upload.array("productFiles", 10),
  productsControllers.addProduct
);

router.patch("/edit/:id", productsControllers.editProduct);

router.delete("/delete/:id", productsControllers.deleteProduct);

module.exports = router;
