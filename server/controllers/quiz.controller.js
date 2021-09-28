const { response } = require("express");
const Quiz = require("../models/quiz.model");
const User = require("../models/user.model");
const Option = require("../models/option.model");
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
  const { userId } = req.user;

  const user = await User.findById(userId)
    .select("quizzesCreated")
    .populate({
      path: "quizzesCreated",
      model: "Quiz",
      select: "title topic time",
      populate: { path: "topic", model: "Topic", select: "topic" },
    })
    .exec();

  return res.status(200).json({
    quizzes: user.quizzesCreated,
  });
};

module.exports = { createQuiz, getAllQuizDetails };
