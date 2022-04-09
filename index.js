const Joi = require("joi"); // Pascal naming for classes.
const express = require("express");

const app = express();
app.use(express.json()); // Middleware

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
    res.status(404).send("The course with the given ID was not found");

  res.send(course);
});

app.post("/api/courses", (req, res) => {
  const { error } = validateCourse(req.body);
  
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  const course = { id: courses.length + 1, name: req.body.name };
  courses.push(course);
  res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
  // Look up the course
  const course = courses.find((c) => c.id === parseInt(req.params.id));

  // Return 404 if not found
  if (!course)
    res.status(404).send("The course with the given ID was not found");

  // Validate
  const { error } = validateCourse(req.body);

  // If invalid, return 400 - Bad Request
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  // Update course
  course.name = req.body.name;

  // Return updated course
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
