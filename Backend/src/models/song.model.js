const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  postUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  mood: {
    type: String,
    emun: {
      values: ["sad, happy, surprised"],
      message: "This is Enum",
    },
  },
});

const songModel = mongoose.model("songs", songSchema);
module.exports = songModel;
