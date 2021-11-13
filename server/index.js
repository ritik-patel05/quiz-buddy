const path = require("path");
const express = require("express");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const initializeDBConnection = require("./config/db.connect");
const errorHandlerRoute = require("./middlewares/errorHandler");
const notFoundHandlerRoute = require("./middlewares/routeHandler");
const authRouter = require("./routers/auth.router");
const quizRouter = require("./routers/quiz.router");
const questionRouter = require("./routers/question.router");
const constants = require("./config/constant");
const checkAuth = require("./middlewares/checkAuth");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet()); // Secure our Express apps by setting various HTTP headers.
app.use(compression()); // Compress routes
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser()); // Populate req.cookies with cookies

// Connect to Database.
initializeDBConnection();

// Routes

app.use("/api/auth", authRouter);
app.use("/api/quiz", checkAuth, quizRouter);
app.use("/api/question", checkAuth, questionRouter);

console.log(__dirname);
console.log(path.join(__dirname, "../client/build"));
if (constants.general.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  console.log("here in prod");
  // anything that is not in our api.. will go to client
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Hey, Welcome to the backend!");
  });
}

// Not found route Middleware
app.use(notFoundHandlerRoute);
// Error Handler Route Middleware
app.use(errorHandlerRoute);

app.listen(constants.general.PORT, () => {
  console.log("Backend Server is running.");
});
