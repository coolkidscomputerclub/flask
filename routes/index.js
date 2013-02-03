/* Dependencies */

var helpers = require("../helpers");

/* Routes */

var routes = {

    data: {

        title: "Flask"

    },

    routes: {

        index: function (req, res) {

            routes.render(res, "index");

        }

    },

    render: function (res, view, data) {

        var data = data || {};

        data = helpers.extend(this.data, data);

        data.view = view;

        res.render(view, data);

    }

};

module.exports = routes.routes;
