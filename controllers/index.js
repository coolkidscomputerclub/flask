/* # Routes
================================================== */

module.exports = function (app) {

	app.get("/", index);

}

function index (req, res) {

	res.send("hello, World");

}
