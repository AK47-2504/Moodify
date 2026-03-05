const multer = require("multer");

const storage = multer.memoryStorage();

const uplaod = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 16, // 10MB of FileSize
  },
});

module.exports = uplaod;
