/* # Endpoints
================================================== */

exports.index = function (req, res) {

	Post.find(

		{},

		{ __v: false },

		function (err, posts) {

			if (err) {

				console.log(err);

			}

			res.send(posts);

		}

	);

};

exports.show = function (req, res) {

	Post.find(

		{ postType: req.params.type },

		{ __v: false },

		function (err, posts) {

			if (err) {

				console.log(err);

			}

			res.send(posts);

		}

	);

};

console.log("API Initialized!");
