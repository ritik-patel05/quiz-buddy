const Question = require("../models/question.model");
const Quiz = require("../models/quiz.model");

// Create a Question
const createQuestion = async (req, res) => {
  try {
    const { questionBody } = req.body;
    const { quizId } = req.params;

    let question = new Question({
      questionBody,
    });
    question = await question.save();

    // add this question to quiz.
    await Quiz.findOneAndUpdate(
      { _id: quizId },
      { $push: { questions: question._id } }
    );

    return res.status(201).json({
      message: "Question created.",
      question,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

// Get question details
const getQuestionDetails = async (req, res) => {
  try {
    const { questionId } = req.params;

    const question = await Question.findById(questionId).lean().exec();

    return res.status(200).json({
      question,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

// Edit Question
const editQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    const question = await Question.findOneAndUpdate(
      { _id: questionId },
      req.body,
      { new: true }
    );

    return res.status(200).json({
      question,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

module.exports = { createQuestion, getQuestionDetails, editQuestion };
