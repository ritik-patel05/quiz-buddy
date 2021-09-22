const mongoose = require("mongoose");

const { Schema } = mongoose;

const optionSchema = Schema(
  {
    optionBody: {
      type: String,
      required: [true, "Option is required."],
    },
  },
  // eslint-disable-next-line comma-dangle
  { timestamps: true }
);

const Option = mongoose.model("Option", optionSchema);
module.exports = Option;
