const express = require("express");
const router = express.Router();
const Joi = require("joi"); // Pascal naming for classes.

const courses = [
    { id: 1, name: "çourse1" },
    { id: 2, name: "çourse2" },
    { id: 3, name: "çourse3" },
  ];

router.get("/", (req, res) => {
  res.send(courses);
});

router.get("/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given ID was not found");

  res.send(course);
});

router.post("/", (req, res) => {
  const { error } = validateCourse(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  const course = { id: courses.length + 1, name: req.body.name };
  courses.push(course);
  res.send(course);
});

router.put("/:id", (req, res) => {
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

router.delete("/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given ID was not found");

  const index = courses.indexOf(course);
  courses.splice(index, 1);

  res.send(course);
});

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  const { error, value } = schema.validate(course);
  return { error, value };
}

module.exports = router;
