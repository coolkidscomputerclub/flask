/* # Initialize database
================================================== */

var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/flask");

console.log("MongoDB connection established");
