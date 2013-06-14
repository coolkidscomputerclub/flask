var helpers = {

    extend: function () {

        var object = {},
            args = arguments;

        for (var i = 0, j = args.length; i < j; i++) {

            Object.getOwnPropertyNames(args[i]).forEach(function (name) {

                object[name] = args[i][name];

            });

        }

        return object;

    }

};

module.exports = helpers;