const mongoose = require("mongoose");
const { isEmail } = require("validator");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required."],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: [true, "email is requried."],
      unique: [true, "email is already taken."],
      validate: [isEmail, "invalid email"],
    },
    password: {
      type: String,
      required: [true, "password is required."],
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    age: String,
    quizzesGiven: [
      {
        quiz: {
          type: Schema.Types.ObjectId,
          ref: "Quiz",
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

const User = mongoose.model("User", userSchema);

module.exports = User;
