require("dotenv").config();
const express = require("express");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const initializeDBConnection = require("./config/db.connect");
const errorHandlerRoute = require("./middlewares/errorHandler");
const notFoundHandlerRoute = require("./middlewares/routeHandler");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet()); // Secure our Express apps by setting various HTTP headers.
app.use(compression()); // Compress routes
app.use(cors());

// Connect to Database.
initializeDBConnection();

// Routes
app.get("/", (req, res) => {
  res.send("Hey, Welcome to the backend!");
});

// Not found route Middleware
app.use(notFoundHandlerRoute);
// Error Handler Route Middleware
app.use(errorHandlerRoute);

const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  console.log("Backend Server is running.");
});
