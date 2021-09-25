const mongoose = require("mongoose");

const { Schema } = mongoose;

const topicSchema = Schema(
  {
    topic: {
      type: String,
      required: [true, "Topic name is required."],
      unique: [true, "Topic name already exists."],
    },
    quizzes: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Quiz",
      },
    ],
  },
  // eslint-disable-next-line comma-dangle
  { timestamps: true }
);

const Topic = mongoose.model("Topic", topicSchema);
module.exports = Topic;
