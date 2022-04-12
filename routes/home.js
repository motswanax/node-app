const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { title: "My Node App", message: "Hello" }); // View engine template.
});

module.exports = router;
