const express = require("express");
const { createQuiz } = require("../controllers/quiz.controller");

const router = express.Router();

router.route("/create").post(createQuiz);

module.exports = router;
