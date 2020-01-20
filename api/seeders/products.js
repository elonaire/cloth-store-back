class Product {
  constructor(category, type, gender, color, name, description, price, stock, files) {
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
  let product = new productClass(
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
    destination: 'C:\\Users\\USER\\Documents\\elon projects\\JavaScript\\Node\\cloth-store-api\\public\\images\\products',
    filename: 'undefinedpng',
    path: 'C:\\Users\\USER\\Documents\\elon projects\\JavaScript\\Node\\cloth-store-api\\public\\images\\products\\undefinedpng',
    size: 1074235
  }
]

module.exports = {
    Product,
    generateProduct,
    files
}