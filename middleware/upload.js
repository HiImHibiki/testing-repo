// 1. Simpen di local machine -> /public
// 2. Cloud storage -> S3 Bucket

const multer = require("multer");

const storage = (location) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, __dirname + `/../public/${location ? location : ""}`);
    },
    filename: (req, file, cb) => {
      // file1
      // 22dh2u17-image-file1
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueSuffix}-image-${file.originalname}`);
    },
  });
};

const imageFilter = (req, file, cb) => {
  // image/png, image/jpg, image/jpeg
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Error, please upload an image file", false);
  }
};

const uploadFile = (location = null) => {
  return multer({ storage: storage(location), fileFilter: imageFilter });
};

module.exports = uploadFile;
