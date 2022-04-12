const debug = require("debug")("app:startup");
const config = require("config");
const morgan = require("morgan");
const helmet = require("helmet");
const Joi = require("joi"); // Pascal naming for classes.
const express = require("express");
const logger = require("./logger");
const authenticator = require("./authenticator");

const app = express();

app.use(express.json()); // Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // Static resources location.
app.use(helmet());

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

const courses = [
  { id: 1, name: "çourse1" },
  { id: 2, name: "çourse2" },
  { id: 3, name: "çourse3" },
];

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given ID was not found");

  res.send(course);
});

app.post("/api/courses", (req, res) => {
  const { error } = validateCourse(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const course = { id: courses.length + 1, name: req.body.name };
  courses.push(course);
  res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
  // Look up the course
  const course = courses.find((c) => c.id === parseInt(req.params.id));

  // Return 404 if not found
  if (!course)
    return res.status(404).send("The course with the given ID was not found");

  // Validate
  const { error } = validateCourse(req.body);

  // If invalid, return 400 - Bad Request
  if (error) return res.status(400).send(error.details[0].message);

  // Update course
  course.name = req.body.name;

  // Return updated course
  res.send(course);
});

app.delete("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given ID was not found");

  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.send(course);
});

// Port from environment variable.
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  const { error, value } = schema.validate(course);
  return { error, value };
}
