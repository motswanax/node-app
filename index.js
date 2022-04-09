const express = require("express");

const app = express();

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

// Port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
