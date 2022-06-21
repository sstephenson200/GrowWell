const router = require("express").Router();
const { check, validationResult } = require('express-validator');
const gardenController = require("../controllers/gardenController");

router.post("/createGarden", [
    check('user_id')
        .not().isEmpty().withMessage("User_id required."),
    check('name')
        .not().isEmpty().withMessage("Name required.")
        .isLength({ min: 4, max: 30 }).withMessage("Name must be between 4 and 30 characters.")
        .escape(),
    check('length')
        .isInt({ min: 1, max: 6 }).withMessage("Length must be between 1 and 6m."),
    check('width')
        .isInt({ min: 1, max: 6 }).withMessage("Width must be between 1 and 6m."),
], gardenController.createGarden);

module.exports = router;