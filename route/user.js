const express = require("express");
const { getAllUsers, uploadProfilePicture } = require("../controller/user");

const route = express.Router();

const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

route.get("/", protect, getAllUsers);
route.post(
  "/upload",
  protect,
  upload("images").single("file"),
  uploadProfilePicture
);

module.exports = route;
