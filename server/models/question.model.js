const mongoose = require("mongoose");

const { Schema } = mongoose;

const questionSchema = Schema(
  {
    questionBody: {
      type: String,
      required: [true, "Question body is required."],
    },
    options: [],
    correctOption: {
      type: Number,
    },
  },
  // eslint-disable-next-line comma-dangle
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
