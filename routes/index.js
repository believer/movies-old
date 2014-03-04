
/*
 * GET home page.
 */

var mongo    = require('mongodb')
,   request  = require('request')
,   mongoUri = process.env.MONGO_URL;

/**
 * Gets all movies from db
 * @param  {obj} req 
 * @param  {obj} res 
 */
exports.index = function(req, res) {

  mongo.Db.connect(mongoUri, function(err, db) {
    db.collection(process.env.MONGODB_DATABASE, function (er, collection) {
      collection.find().sort({date:-1}).limit(100).toArray(function(error, movies) {
        res.render('index', { movies:movies });
      });
    });
  });

};

exports.actor = function(req, res) {
  
  var name = req.query.name;

  mongo.Db.connect(mongoUri, function(err, db) {
    db.collection(process.env.MONGODB_DATABASE, function (er, collection) {
      collection.find({ cast: { $regex:name, $options:'i' } }).sort({date:-1}).toArray(function(error, movies) {
        res.render('actor', { movies:movies, actor:name } );
      });
    });
  });


};