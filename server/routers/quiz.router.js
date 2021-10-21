const express = require("express");
const {
  createQuiz,
  getAllQuizDetails,
  getQuizDetails,
} = require("../controllers/quiz.controller");

const router = express.Router();

router.route("/").get(getAllQuizDetails);
router.route("/create").post(createQuiz);
router.route("/:quizId").get(getQuizDetails);

module.exports = router;
