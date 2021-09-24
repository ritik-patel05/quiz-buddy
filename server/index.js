const express = require("express");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const initializeDBConnection = require("./config/db.connect");
const errorHandlerRoute = require("./middlewares/errorHandler");
const notFoundHandlerRoute = require("./middlewares/routeHandler");
const authRouter = require("./routers/auth.router");
const constants = require("./config/constant");

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
app.get("/", (req, res) => {
  res.send("Hey, Welcome to the backend!");
});

app.use("/api/auth", authRouter);

// Not found route Middleware
app.use(notFoundHandlerRoute);
// Error Handler Route Middleware
app.use(errorHandlerRoute);

app.listen(constants.general.PORT, () => {
  console.log("Backend Server is running.");
});
