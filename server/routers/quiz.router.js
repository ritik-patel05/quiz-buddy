const express = require("express");
const {
  createQuiz,
  getAllQuizDetails,
  getQuizDetails,
  getQuizQuestions,
  startQuiz,
  saveOption,
} = require("../controllers/quiz.controller");

const router = express.Router();

router.route("/").get(getAllQuizDetails);
router.route("/create").post(createQuiz);
router.route("/:quizId").get(getQuizDetails);
router.route("/:quizId/questions").get(getQuizQuestions);
router.route("/:quizId/start").get(startQuiz);
router.route("/:quizId/save").post(saveOption);

module.exports = router;
