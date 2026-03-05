const songModel = require("../models/song.model");
const id3 = require("node-id3");
const storageService = require("../services/storage.service");

async function uploadSongController(req, res) {
  const songBuffer = req.file.buffer;
  const tags = id3.read(songBuffer);
  const { mood } = req.body;

  //   console.log(songBuffer, tags, mood);

  const [songFile, posterFile] = await Promise.all([
    storageService.uploadFile({
      buffer: songBuffer,
      filename: tags.title + ".mp3",
      folder: "/Moofiy/songs",
    }),
    storageService.uploadFile({
      buffer: tags.image.imageBuffer,
      filename: tags.title + ".jpeg",
      folder: "/Moodify/posters",
    }),
  ]);

  const song = await songModel.create({
    title: tags.title,
    url: songFile.url,
    postUrl: posterFile.url,
    mood,
  });

  res.status(201).json({
    message: "Song Created Successfully",
    song,
  });
}

async function getSongController(req, res) {
  const { mood } = req.query;

  const song = await songModel.find({ mood });
  res.status(200).json({
    message: "Song Fetched Successfully",
    song,
  });
}

module.exports = {
  uploadSongController,
  getSongController,
};
