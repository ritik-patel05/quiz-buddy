const jwt = require("jsonwebtoken");
const constant = require("../config/constant");
const User = require("../models/user.model");

const checkAuth = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({
        message: "Access token not found or invalid. Try to log in.",
      });
    }
    token = token.split(" ")[1];
    // Verify token.
    console.log("verify token in checkAuth");
    const decodedToken = jwt.verify(token, constant.jwt.JWT_SECRET);
    console.log("after verification in checkauth");

    const userId = decodedToken.id;

    const user = await User.findById(userId).lean().exec();
    if (!user) {
      return res.status(401).json({
        message: "Access token not found or invalid. Try to log in.",
      });
    }

    // Attach user to further requests.
    req.user = { userId: user._id };

    // Call further middlewares.
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: error });
  }
};

module.exports = checkAuth;
