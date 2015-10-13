var models  = require('../models');
var Aticle    = models.Aticle;
var uuid    = require('node-uuid');



exports.newAndSave = function (title, content, authorId, callback) {
  console.log(arguments);
    var topic       = new Aticle();
    topic.title     = title;
    topic.content   = content;
    topic.author_id = authorId;
    topic.save(callback);
};

