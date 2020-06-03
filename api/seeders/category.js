const generateUUID = require('uuid/v4');

class Category {
    constructor(category_id, category) {
        this.category_id = category_id;
        this.category = category;
    }
}

class SubCategory {
    constructor(subcategory_id, subcategory, category_id) {
        this.subcategory_id = subcategory_id;
        this.subcategory = subcategory;
        this.category_id = category_id;
    }
}

const generateCategory = (objectClass) => {
    let category_id = generateUUID();
    let category = new objectClass(category_id, 'Category A');

    return category;
}

const generateSubCategory = (objectClass, categoryId) => {
    let subcategory_id = generateUUID();
    let subcategory = new objectClass(subcategory_id, 'Subcategory A', categoryId);

    return subcategory;
}

module.exports = {
    Category,
    SubCategory,
    generateCategory,
    generateSubCategory
}