const mongoose = require("mongoose");

const { Schema } = mongoose;

const quizSchema = Schema(
  {
    title: {
      type: String,
      required: [true, "Title of quiz is required."],
    },
    topic: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
      required: [true, "Topic of quiz is required."],
    },
    questions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    time: {
      type: String,
      required: [true, "Time of quiz is required."],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User who created this quiz is required."],
    },
    quizCode: {
      type: String,
      required() {
        return this.isPrivate === true;
      },
    },
    isPrivate: {
      type: Boolean,
      required: [true, "isPrivate field is required."],
    },
    scoreForCorrectResponse: {
      type: Number,
      default: 2,
      required: [true, "Score for correct response is required."],
    },
    scoreForIncorrectResponse: {
      type: Number,
      default: 0,
      required: [true, "Score for correct response is required."],
    },
    usersParticipated: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        score: {
          type: Number,
        },
        response: {
          type: Object,
        },
        started_at: {
          type: Date,
        },
        ended_at: {
          type: Date,
        },
      },
    ],
  },
  // eslint-disable-next-line comma-dangle
  { timestamps: true }
);

const Quiz = mongoose.model("Quiz", quizSchema);
module.exports = Quiz;
