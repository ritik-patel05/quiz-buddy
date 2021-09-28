const express = require("express");
const {
  createQuiz,
  getAllQuizDetails,
} = require("../controllers/quiz.controller");

const router = express.Router();

router.route("/").get(getAllQuizDetails);
router.route("/create").post(createQuiz);

module.exports = router;
