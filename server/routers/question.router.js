const express = require("express");
const { createQuestion } = require("../controllers/question.controller");

const router = express.Router();

router.route("/:quizId/create").post(createQuestion);

module.exports = router;
