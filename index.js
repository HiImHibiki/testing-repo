const express = require("express");
const xss = require("xss-clean");
const path = require("path");
const errorHandler = require("./middleware/error");
require("dotenv").config();

const app = express();

// Route files
const note = require("./route/note");
const user = require("./route/user");
const auth = require("./route/auth");

// Use static folder
// GET -> localhost:3000/public
app.use("/public", express.static(path.join(__dirname, "public")));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Menggunakan library / middleware
app.use(xss());

// Route List
// localhost:3000/note
app.use("/note", note);
app.use("/user", user);
app.use("/auth", auth);

// Error Handler
app.use(errorHandler);

const port = 3000 || process.env.PORT;

const server = app.listen(
  port,
  console.log(
    `Server in running in ${process.env.NODE_ENV} mode on port ${port}`
  )
);

process.on("uncaughtException", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

// const username = "test";
// const password = "test";
