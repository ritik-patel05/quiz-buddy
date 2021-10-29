const express = require("express");
const {
  createQuiz,
  getAllCreatedQuizzes,
  getAllGivenQuizzes,
  getQuizDetails,
  getQuizQuestions,
  startQuiz,
  saveOption,
  endQuiz,
} = require("../controllers/quiz.controller");

const router = express.Router();

router.route("/created-quizzes").get(getAllCreatedQuizzes);
router.route("/given-quizzes").get(getAllGivenQuizzes);
router.route("/create").post(createQuiz);
router.route("/:quizId").get(getQuizDetails);
router.route("/:quizId/questions").get(getQuizQuestions);
router.route("/:quizId/start").get(startQuiz);
router.route("/:quizId/save").post(saveOption);
router.route("/:quizId/end").get(endQuiz);

module.exports = router;
