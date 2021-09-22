require("dotenv").config();
const mongoose = require("mongoose");

const initializeDBConnection = () => {
  mongoose
    // eslint-disable-next-line no-undef
    .connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => console.log("Connected To Database!"))
    .catch((error) => console.error("Connection To Database failed.", error));
};

module.exports = initializeDBConnection;
