const Quiz = require("../models/quiz.model");
const User = require("../models/user.model");
const Topic = require("../models/topic.model");
const { nanoid } = require("nanoid");

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
    const isTopicExists = await Topic.findOne({ topic })
      .select("_id")
      .lean()
      .exec();
    let currTopic = isTopicExists;
    if (!isTopicExists) {
      currTopic = new Topic({
        topic,
        quizzes: [],
      });
      currTopic = await currTopic.save();
    }

    // Add quizCode if isPrivate is true.
    let quiz;
    if (isPrivate === true) {
      quiz = new Quiz({
        topic: currTopic._id,
        title,
        time,
        createdBy,
        scoreForCorrectResponse,
        scoreForIncorrectResponse,
        isPrivate,
        quizCode: nanoid(),
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

    // Add quiz to this topic.
    await Topic.updateOne(
      { _id: currTopic._id },
      { $push: { quizzes: savedQuiz._id } },
      { new: true }
    );

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

const getAllCreatedQuizzes = async (req, res) => {
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
    const { userId } = req.user;

    let quiz = await Quiz.findById(quizId)
      .populate({ path: "topic", model: "Topic", select: "topic" })
      .lean()
      .exec();

    const isUserExists = await Quiz.findOne({
      _id: quizId,
      "usersParticipated.user": userId,
    })
      .select("usersParticipated -_id")
      .lean()
      .exec();

    if (isUserExists) {
      quiz = {
        ...quiz,
        hasAttemptedPreviously: true,
        userScore: isUserExists.usersParticipated[0].score,
      };
    } else {
      quiz = { ...quiz, hasAttemptedPreviously: false };
    }

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

    // If user already exits in usersParticipated, reset the fields of quiz.
    // else, add new user to usersParticipated.
    const isUserExists = await Quiz.findOne({
      _id: quizId,
      "usersParticipated.user": userId,
    })
      .select("_id")
      .lean()
      .exec();

    let quiz;
    if (isUserExists) {
      console.log("Yes user exists");
      const objReset = {
        "usersParticipated.$.started_at": Date.now(),
        "usersParticipated.$.response": {},
      };
      quiz = await Quiz.updateOne(
        { _id: quizId, "usersParticipated.user": userId },
        { $set: objReset },
        { new: true }
      );
    } else {
      console.log("new user added");
      quiz = await Quiz.updateOne(
        { _id: quizId },
        {
          $push: {
            usersParticipated: {
              user: userId,
              started_at: Date.now(),
              response: {},
            },
          },
        },
        { new: true }
      );
    }

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

const saveOption = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { userId } = req.user;

    const { questionId, optionSelected } = req.body;

    const toSet = { $set: {} };
    toSet.$set[`usersParticipated.$.response.${questionId}`] = optionSelected;

    const updatedQuiz = await Quiz.updateOne(
      { _id: quizId, "usersParticipated.user": userId },
      toSet,
      { new: true }
    );

    console.log("updated -> ", updatedQuiz);

    return res.status(200).json({
      message: "Successfully saved option.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

const endQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { userId } = req.user;

    // get all questions of this quiz.
    const quiz = await Quiz.findOne({
      _id: quizId,
      "usersParticipated.user": userId,
    })
      .select("questions usersParticipated")
      .populate({
        path: "questions",
        model: "Question",
        select: "correctOption",
      })
      .populate("scoreForCorrectResponse scoreForIncorrectResponse")
      .lean()
      .exec();

    const correctResponse = {};
    quiz.questions.forEach((question, index) => {
      correctResponse[String(index)] = String(question.correctOption);
    });

    console.log("correct -> ", correctResponse);

    // Compare to responses of user and calculate score
    let totalScore = 0;
    const userResponse = quiz.usersParticipated[0].response;
    console.log("user response -> ", userResponse);
    Object.keys(userResponse).forEach((key) => {
      if (key in correctResponse) {
        if (correctResponse[key] === userResponse[key]) {
          totalScore += quiz.scoreForCorrectResponse;
        } else {
          totalScore -= quiz.scoreForIncorrectResponse;
        }
      }
    });

    console.log(totalScore);
    // Update the score and ended_at parameters.
    const objToAdd = {
      "usersParticipated.$.ended_at": Date.now(),
      "usersParticipated.$.score": totalScore,
    };
    const updatedQuiz = await Quiz.updateOne(
      { _id: quizId, "usersParticipated.user": userId },
      objToAdd,
      { new: true }
    );

    // Add this quiz to quizzesGiven of user.
    const conditions = {
      _id: userId,
      quizzesGiven: { $ne: quizId },
    };
    const update = {
      $addToSet: { quizzesGiven: quizId },
    };
    const updatedUser = await User.updateOne(conditions, update, {
      new: true,
    });

    console.log("user updated -> ", updatedUser);

    console.log("updated Quiz -> ", updatedQuiz);
    return res.status(200).json({
      message: "success",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

const getAllGivenQuizzes = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId)
      .select("quizzesGiven")
      .populate({
        path: "quizzesGiven",
        model: "Quiz",
        select: "title topic time",
        populate: { path: "topic", model: "Topic", select: "topic" },
      })
      .lean()
      .exec();

    console.log(user);

    return res.status(200).json({
      quizzes: user.quizzesGiven,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

const getAllPublicQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ isPrivate: false }, "-usersParticipated")
      .populate({ path: "createdBy", model: "User", select: "name" })
      .populate({ path: "topic", model: "Topic", select: "topic" })
      .lean()
      .exec();

    // console.log(quizzes);
    return res.status(200).json({
      quizzes,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error.",
    });
  }
};

const getQuizIdFromQuizCode = async (req, res) => {
  try {
    const { quizCode } = req.params;
    const quiz = await Quiz.findOne({ quizCode }, "_id").lean().exec();

    if (!quiz) {
      return res.status(404).json({
        message: "No quiz found",
      });
    }

    return res.status(200).json({
      message: "Success",
      quizId: quiz._id,
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
  getAllCreatedQuizzes,
  getAllGivenQuizzes,
  getQuizDetails,
  getQuizQuestions,
  startQuiz,
  saveOption,
  endQuiz,
  getAllPublicQuizzes,
  getQuizIdFromQuizCode,
};
