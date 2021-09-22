const mongoose = require("mongoose");

const { Schema } = mongoose;

const quizSchema = Schema(
  {
    topic: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Topic",
      required: [true, "Topic of quiz is required."],
    },
    questions: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Question",
      },
    ],
    time: {
      type: String,
      required: [true, "Time of quiz is required."],
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    quizCode: {
      type: String,
      minlength: 4,
      maxlength: 4,
      required() {
        return this.isPrivate === false;
      },
    },
    isPrivate: {
      type: Boolean,
    },
    scoreForCorrectResponse: {
      type: Number,
      default: 2,
    },
    scoreForIncorrectResponse: {
      type: Number,
      default: 0,
    },
    usersParticipated: [
      {
        user: {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "User",
        },
        score: {
          type: Number,
          required: [true, "Score of user in the quiz is required."],
        },
        response: {
          type: Array,
          required: [true, "response for the quiz is required."],
        },
        started_at: {
          type: Date,
          required: [true, "Start Time of quiz is required."],
        },
        ended_at: {
          type: Date,
          required: [true, "End Time of quiz is required."],
        },
      },
    ],
  },
  // eslint-disable-next-line comma-dangle
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);
module.exports = Quiz;
