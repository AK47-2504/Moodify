const express = require("express");
const songRouter = express.Router();
const {
  uploadSongController,
  getSongController,
} = require("../controllers/songController");
const upload = require("../middleware/upload.middleware");

songRouter.post("/", upload.single("song"), uploadSongController);

songRouter.get("/get-song", getSongController);

module.exports = songRouter;
