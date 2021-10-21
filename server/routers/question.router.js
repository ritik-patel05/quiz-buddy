const express = require("express");
const {
  createQuestion,
  getQuestionDetails,
  editQuestion,
} = require("../controllers/question.controller");

const router = express.Router();

router.route("/:quizId/create").post(createQuestion);
router.route("/:questionId").get(getQuestionDetails).put(editQuestion);

module.exports = router;
