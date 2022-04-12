const debug = require("debug")("app:startup");
const config = require("config");
const morgan = require("morgan");
const helmet = require("helmet");
const Joi = require("joi"); // Pascal naming for classes.
const express = require("express");
const logger = require("./logger");
const authenticator = require("./authenticator");
const courses = require("./routes/courses");
const home = require("./routes/home");

const app = express();

app.set("view engine", "pug"); // Express internally loads this module
app.set("views", "./routes/views"); // Default.

app.use(express.json()); // Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // Static resources location.
app.use(helmet());
app.use("/api/courses", courses);
app.use("/", home);

// Configuration.
console.log("Applicaiton Name: " + config.get("name"));
console.log("Mail Server: " + config.get("mail.host"));
console.log("Mail Password: " + config.get("mail.password"));

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  debug("Morgan enabled");
}

// Custom middleware.
app.use(logger);

app.use(authenticator);

// Port from environment variable.
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));