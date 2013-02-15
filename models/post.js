/* # Post model
================================================== */

var mongoose = require("mongoose"),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var postSchema = new Schema ({
	content: 	String,
	postType: 	String,
	postDate: 	{ type: String, default: Date.now },
	viewed: 	{ type: Boolean, default: false }
});

module.exports = mongoose.model("Post", postSchema);
