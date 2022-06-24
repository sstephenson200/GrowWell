const mongoose = require("mongoose");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

//Create Storage Engine
const storage = new GridFsStorage({
  url: process.env.MDB_CONNECT,
  file: (request, file) => ({
    filename: `${file.originalname}_${Date.now()}`,
    bucketName: 'images',
    chunkSize: 500000
  })
});

const upload = multer({ storage });

const connection = mongoose.connection;

const bucket = new mongoose.mongo.GridFSBucket(connection, {
  bucketName: 'images',
  chunkSizeBytes: 1048576
});

module.exports = { upload, bucket };