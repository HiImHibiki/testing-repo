const asyncFunc = require("../middleware/async");
const User = require("../models").User;
const Note = require("../models").Note;
const Upload = require("../models").Upload;
const { Op } = require("sequelize");

exports.getAllUsers = asyncFunc(async (req, res, next) => {
  const users = await User.findAll({
    include: {
      model: Note,
      as: "note",
    },
  });

  res.status(200).json({
    message: "Get All Users",
    data: users,
  });
});

exports.uploadProfilePicture = asyncFunc(async (req, res, next) => {
  const user_id = req.user.id;
  const { filename, path, mimetype } = req.file;

  const publicIndex = path.indexOf("/public");
  const newPath = path.substring(publicIndex);

  const upload = await Upload.create({
    file_name: filename,
    file_path: newPath,
    file_type: mimetype,
    user_id,
  });

  res.status(201).json({
    message: "Image Upload",
    data: upload,
  });
});
