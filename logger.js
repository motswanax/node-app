function log (req, res, next) {
  console.log("Logging...");
  next(); // Go to next middleware in the pipeline. Do not omit.
}

module.exports = log;