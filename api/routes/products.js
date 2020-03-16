const express = require("express");
const router = express.Router();
const productsControllers = require("../controllers/products");
const path = require("path");
const multer = require("multer");
const generateUUID = require("uuid/v4");
const authGuard = require('../middleware/auth-guard').authGuard;
const adminGuard = require('../middleware/auth-guard').adminGuard;

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

router.get("/", authGuard, productsControllers.getProducts);

router.post(
  "/add",
  adminGuard,
  upload.array("productFiles", 10),
  productsControllers.addProduct
);

router.patch("/edit/:id", adminGuard, productsControllers.editProduct);

router.delete("/delete/:id", adminGuard, productsControllers.deleteProduct);

module.exports = router;
