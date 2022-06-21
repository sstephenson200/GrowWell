const router = require("express").Router();
const { upload } = require('../middleware/imageUpload');
const plantController = require("../controllers/plantController");

router.post("/createPlant", upload.array("file", 3), plantController.createPlant);

module.exports = router;