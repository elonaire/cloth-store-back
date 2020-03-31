const generateUUID = require('uuid/v4');

class Product {
  constructor(product_id, category, type, gender, color, name, description, price, stock, files) {
    this.product_id = product_id;
    this.category = category;
    this.type = type;
    this.gender = gender;
    this.color = color;
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
    this.files = files;
  }
}

let generateProduct = productClass => {
  let prodId = generateUUID();
  let product = new productClass(
    prodId,
    "Clothing",
    "pants",
    "MALE",
    "navy blue",
    "Gucci pants",
    "Original gucci",
    500,
    60
  );

  return product;
};

let files = [
  {
    fieldname: 'productFiles',
    originalname: 'Screenshot (3).png',
    encoding: '7bit',
    mimetype: 'image/png',
    size: 1074235
  }
]

module.exports = {
    Product,
    generateProduct,
    files
}