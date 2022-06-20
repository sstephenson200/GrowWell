const router = require("express").Router();
const { upload } = require("../middleware/imageUpload");
const noteController = require("../controllers/noteController");

router.post("/createNote", upload.array("file, 3"), noteController.createNote);

module.exports = router;