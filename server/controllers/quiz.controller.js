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
      topic,
      time,
      createdBy,
      scoreForCorrectResponse,
      scoreForIncorrectResponse,
      isPrivate,
    } = req.body;

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
    if (isPrivate) {
      const quizCode = Math.floor(1000 + Math.random() * 9000);
      quiz = new Quiz({
        topic: currTopic._id,
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
        time,
        createdBy,
        scoreForCorrectResponse,
        scoreForIncorrectResponse,
        isPrivate,
      });
    }
    const savedQuiz = await quiz.save();

    currTopic.quizzes.push(savedQuiz);
    await currTopic.save();

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

module.exports = { createQuiz };
