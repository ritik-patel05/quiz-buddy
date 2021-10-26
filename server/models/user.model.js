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
        type: Schema.Types.ObjectId,
        ref: "Quiz",
      },
    ],
    quizzesCreated: [
      {
        type: Schema.Types.ObjectId,
        ref: "Quiz",
      },
    ],
  },
  // eslint-disable-next-line comma-dangle
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
