const { File, UserFile, ProductFile } = require("../models");
const path = require("path");

let imgUrl;
if (process.env.NODE_ENV === "development") {
  imgUrl = "http://192.168.214.206:3000/images/";
} else if (process.env.NODE_ENV === "production") {
  imgUrl = "http://34.67.57.125:3000/images/";
}

const fetchFiles = async (req, res, next) => {
  let files = [];
  if (req.query.user_id) {
    try {
      let userFiles = await UserFile.findAll({
        where: {
          user_id: req.query.user_id,
        },
      });

      if (userFiles.length === 0) {
        res.status(404).json({
          message: "No files found for this user",
        });
      } else {
        for (let i = 0; i < userFiles.length; i++) {
          const userFile = userFiles[i];
          let file = await File.findOne({
            where: {
              file_id: userFile.file_id,
            },
          });

          if (!file) {
            throw {
              error: "File not found",
            };
          } else {
            let fileDetails = file.dataValues;
            fileDetails["url"] = `${imgUrl + "users/" + file.file_id}`;
            files.push(fileDetails);
          }
        }
        res.status(200).json(files);
      }
    } catch (error) {
      console.log(error);
    }
  } else if (req.query.product_id) {
    try {
      let productFiles = await ProductFile.findAll({
        where: {
          product_id: req.query.product_id,
        },
      });

      if (productFiles.length === 0) {
        res.status(404).json({
          message: "No files found for this user",
        });
      } else {
        for (let i = 0; i < productFiles.length; i++) {
          const productFile = productFiles[i];
          let file = await File.findOne({
            where: {
              file_id: productFile.file_id,
            },
          });

          if (!file) {
            throw {
              error: "File not found",
            };
          } else {
            let fileDetails = file.dataValues;
            fileDetails["url"] = `${imgUrl + "products/" + file.file_id}`;
            files.push(fileDetails);
          }
        }
        res.status(200).json(files);
      }
    } catch (error) {
      console.log(error);
    }
  }
};

module.exports = {
  fetchFiles,
};
