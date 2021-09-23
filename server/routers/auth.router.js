const express = require("express");
const {
  login,
  signup,
  getNewRefreshToken,
} = require("../controllers/auth.controller");

const router = express.Router();

router.route("/login").post(login);
router.route("/signup").post(signup);
router.route("/refresh_token").get(getNewRefreshToken);

module.exports = router;
