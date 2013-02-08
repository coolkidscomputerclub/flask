/* # Post model
================================================== */

var mongoose = require("mongoose"),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var postSchema = new Schema ({
	content: String,
	postDate: { type: String, default: Date.now },
	postType: String
});

module.exports = mongoose.model("Post", postSchema);
