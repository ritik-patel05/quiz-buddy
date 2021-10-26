const Quiz = require("../models/quiz.model");
const User = require("../models/user.model");
const Topic = require("../models/topic.model");

// Create a new quiz.
// Required fields: [topic, time, createdBy, scoreForCorrectResponse, scoreForIncorrectResponse,
// isPrivate(if true: quizCode is also required) ]
const createQuiz = async (req, res) => {
  try {
    const {
      title,
      topic,
      time,
      scoreForCorrectResponse,
      scoreForIncorrectResponse,
      isPrivate,
    } = req.body;

    // // for testing errors
    // return res.status(401).json({
    //   message: "failed",
    // });

    const createdBy = req.user.userId;
    // Create new topic if it doesn't exist.
    const isTopicExists = await Topic.findOne({ topic }).exec();
    let currTopic = isTopicExists;
    if (!isTopicExists) {
      currTopic = new Topic({
        topic,
      });
    }

    // Add quizCode if isPrivate is true.
    let quiz;
    if (isPrivate === true) {
      const quizCode = Math.floor(1000 + Math.random() * 9000);
      quiz = new Quiz({
        topic: currTopic._id,
        title,
        time,
        createdBy,
        scoreForCorrectResponse,
        scoreForIncorrectResponse,
        isPrivate,
        quizCode,
      });
    } else {
      quiz = new Quiz({
        topic: currTopic._id,
        title,
        time,
        createdBy,
        scoreForCorrectResponse,
        scoreForIncorrectResponse,
        isPrivate,
      });
    }
    const savedQuiz = await quiz.save();

    currTopic.quizzes.push(savedQuiz);
    currTopic = await currTopic.save();

    await User.updateOne(
      { _id: createdBy },
      { $push: { quizzesCreated: savedQuiz._id } }
    );

    return res.status(201).json({
      message: "Quiz created",
      quiz: savedQuiz,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

const getAllQuizDetails = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId)
      .select("quizzesCreated")
      .populate({
        path: "quizzesCreated",
        model: "Quiz",
        select: "title topic time",
        populate: { path: "topic", model: "Topic", select: "topic" },
      })
      .lean()
      .exec();

    return res.status(200).json({
      quizzes: user.quizzesCreated,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

const getQuizDetails = async (req, res) => {
  try {
    const { quizId } = req.params;

    const quiz = await Quiz.findById(quizId)
      .populate({ path: "topic", model: "Topic", select: "topic" })
      .lean()
      .exec();

    console.log(quiz);
    return res.status(200).json({
      quiz,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

const getQuizQuestions = async (req, res) => {
  try {
    const { quizId } = req.params;

    const questions = await Quiz.findById(quizId)
      .select("questions -_id")
      .lean()
      .exec();

    console.log(questions);
    return res.status(200).json(questions);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

const startQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { userId } = req.user;

    const quiz = await Quiz.findOneAndUpdate(
      { _id: quizId },
      {
        $push: { usersParticipated: { user: userId, started_at: Date.now() } },
      },
      { new: true }
    );

    console.log(quiz);
    return res.status(200).json({
      message: "Quiz started",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

module.exports = {
  createQuiz,
  getAllQuizDetails,
  getQuizDetails,
  getQuizQuestions,
  startQuiz,
};
