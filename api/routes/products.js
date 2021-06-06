const express = require("express");
const router = express.Router();
const {
  getProducts,
  addProduct,
  editProduct,
  deleteProduct
} = require("../controllers/products");
const path = require("path");
const multer = require("multer");
const generateUUID = require("uuid/v4");
const { authGuard, adminGuard } = require("../middleware/auth-guard");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve("public/images/products"));
  }, 
  filename: (req, file, cb) => {
    let randName = generateUUID();
    console.log("name", randName);

    let mimetype = file.mimetype;
    let begin = mimetype.lastIndexOf("/") + 1;
    let extension = mimetype.substr(begin);
    let file_name = `${randName}.${extension}`;
    cb(null, file_name);
  }
});

const upload = multer({ storage });

router.get("", getProducts);

router.post(
  "/add",
  adminGuard,
  upload.array("productFiles", 10),
  addProduct
);

router.patch("/edit/:id", adminGuard, editProduct);

router.delete("/delete/:id", adminGuard, deleteProduct);

module.exports = router;
