const Option = require("../models/option.model");
const Question = require("../models/question.model");
const Quiz = require("../models/quiz.model");

let correctOption;
let optionsIds;

async function asyncForLoop(options) {
  try {
    const results = [];
    options.forEach((option) => {
      // Good: all asynchronous operations are immediately started.
      const newOption = new Option({
        optionBody: option.optionBody,
      });

      results.push(newOption.save());
      optionsIds.push(newOption._id);

      if (option?.isCorrect === true) {
        correctOption = newOption._id;
      }
    });
    // Now that all the asynchronous operations are running, here we wait until they all complete.
    // and return a promise.
    return Promise.all(results);
  } catch (error) {
    // handles rejection, of any of the promises.
    console.log("Error in asyncForLoop, ", error);
    return false;
  }
}

// Create a Question
const createQuestion = async (req, res) => {
  try {
    const { questionBody, options } = req.body;
    const { quizId } = req.params;

    correctOption = null;
    optionsIds = [];

    // create new options and save them.
    await asyncForLoop(options);

    // create question
    console.log("After iterating, correctOption is: ", correctOption);
    const question = new Question({
      questionBody,
      correctOption,
      options: optionsIds,
    });
    await question.save();

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

module.exports = { createQuestion };
