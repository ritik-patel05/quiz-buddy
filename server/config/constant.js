require("dotenv").config();

module.exports = {
  jwt: {
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRY: process.env.JWT_EXPIRY,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY,
  },
  db: {
    MONGO_URI: process.env.MONGO_URI,
  },
  general: {
    PORT: process.env.PORT,
  },
};
