var moment = require('moment');

module.exports = function (app) {

    var blocks = {};
    var handlebars = require('express-handlebars')
        .create({
            defaultLayout: 'main',
            helpers: {
                extend: function (name, context) {
                    var block = blocks[name];
                    if (!block) {
                        block = blocks[name] = [];
                    }
                    block.push(context.fn(this)); // for older versions of handlebars, use block.push(context(this));

                },
                block: function (name) {
                    var val = (blocks[name] || []).join('\n');
                    // clear the block
                    blocks[name] = [];
                    return val;
                },
                format: function (time, format) {
                    if (typeof format !== 'string') {
                        format = 'YYYY-MM-DD';
                    }
                    return moment(time).format(format);
                }
            }
        });


    // view engine setup
    app.engine('handlebars', handlebars.engine);
    app.set('view engine', 'handlebars');

};