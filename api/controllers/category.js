const { Category, Subcategory } = require("../models");
const generateUUID = require("uuid/v4");

const fetchCategory = async (req, res, next) => {
  if (req.query.category) {
    try {
      let subcategories = await Subcategory.findAll({
        where: {
          category_id: req.query.category,
        },
      });
      if (subcategories) {
        res.status(200).json(subcategories);
      } else {
        throw {
          statusCode: 404,
          error: "Category not found",
        };
      }
    } catch (err) {
      res.locals.error = err;
      next();
    }
  } else {
    try {
      let categories = await Category.findAll({
        where: {},
      });
      if (categories) {
        res.status(200).json(categories);
      } else {
        throw {
          statusCode: 404,
          error: "Category not found",
        };
      }
    } catch (err) {
      res.locals.error = err;
      next();
    }
  }
};

const addCategory = async (req, res, next) => {
  let category = {};
  category["category"] = req.body.category;
  category["category_id"] = generateUUID();

  try {
    let addedCategory = await Category.create(category);

    console.log("cat", addedCategory);

    if (addedCategory) {
      res.status(201).json(addedCategory);
    } else {
      throw {
        statusCode: 400,
        error: "Operation failed",
      };
    }
  } catch (err) {
    res.locals.error = err;
    next();
  }
};

const addSubcategory = async (req, res, next) => {
  try {
    let subcategory = req.body;

    let addedSubCategory = await Subcategory.create(subcategory);

    if (addedSubCategory) {
      res.status(201).json(addedSubCategory.dataValues);
    } else {
      throw {
        statusCode: 400,
        error: "Operation failed",
      };
    }
  } catch (err) {
    res.locals.error = err;
    next();
  }
};

module.exports = {
  fetchCategory,
  addCategory,
  addSubcategory,
};
