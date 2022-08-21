const mongoose = require("mongoose");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

//Create Storage Engine
const storage = new GridFsStorage({
  url: process.env.MDB_CONNECT || "Test url",
  file: (request, file) => ({
    filename: `${file.originalname}_${Date.now()}`,
    bucketName: "images",
    chunkSize: 500000
  })
});

const upload = multer({ storage });

const connection = mongoose.connection;

const bucket = new mongoose.mongo.GridFSBucket(connection, {
  bucketName: "images",
  chunkSizeBytes: 1048576
});

//Function to delete images from image.files and image.chunks
function deleteImages(images) {
  images.forEach((image) => {
    bucket.delete(image);
  });
}

module.exports = { upload, bucket, deleteImages };