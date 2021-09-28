const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const constant = require("../config/constant");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).lean().exec();

    if (!user) {
      return res.status(404).send({
        message: "User not found.",
      });
    }

    const isPasswordRight = await bcrypt.compare(password, user.password);

    if (!isPasswordRight) {
      return res.status(401).json({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    const accessToken = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      constant.jwt.JWT_SECRET,
      {
        expiresIn: Number(constant.jwt.JWT_EXPIRY),
      }
    );

    // console.log("In login verify token");
    // const decodedToken = jwt.verify(accessToken, constant.jwt.JWT_SECRET);
    // console.log("After");

    const refreshToken = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      constant.jwt.JWT_REFRESH_SECRET,
      { expiresIn: Number(constant.jwt.JWT_REFRESH_EXPIRY) }
    );

    // Set httpOnly cookie that stores our refresh token.
    res.cookie("refresh-token", refreshToken, {
      maxAge: 604800000, // 7 days (milliseconds)
      httpOnly: true,
    });

    return res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

const signup = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const userAlreadyExists = await User.findOne({ email }).lean().exec();
    if (userAlreadyExists) {
      return res.status(400).json({
        message: "Fail! email is already in use.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    return res.status(201).json({
      message: "Successfully created a new account.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};

const getNewRefreshToken = async (req, res) => {
  // read refresh token from httpOnly cookie.
  const requestToken = req.cookies["refresh-token"];

  // check if the refreshtoken was set in cookies.
  if (!requestToken) {
    return res.status(403).json({
      message: "Refresh Token is required.",
    });
  }

  try {
    // check if refresh token is not expired or tampered.
    jwt.verify(
      requestToken,
      constant.jwt.JWT_REFRESH_SECRET,
      (err, decodedToken) => {
        if (err) {
          return res.status(403).json({
            message:
              "Refresh token was expired. Please make new sign in request.",
          });
        }

        const accessToken = jwt.sign(
          {
            id: decodedToken.id,
            name: decodedToken.name,
            email: decodedToken.email,
          },
          constant.jwt.JWT_SECRET,
          { expiresIn: Number(constant.jwt.JWT_EXPIRY) }
        );

        // Send new access token back to client.
        return res.status(200).json({
          accessToken,
          id: decodedToken.id,
          name: decodedToken.name,
          email: decodedToken.email,
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};

module.exports = { login, signup, getNewRefreshToken };
