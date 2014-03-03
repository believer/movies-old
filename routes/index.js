
/*
 * GET home page.
 */

var mongo    = require("mongodb")
,   request  = require('request')
,   mongoUri = process.env.MONGO_URL;


exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

/**
 * Gets all movies from db
 * @param  {obj} req 
 * @param  {obj} res 
 */
exports.movies = function(req, res) {
  mongo.Db.connect(mongoUri, function(err, db) {
    db.collection(process.env.MONGODB_DATABASE, function (er, collection) {
      collection.find().sort({date:-1}).limit(100).toArray(function(error, movies) {
        res.send(movies);
      });
    });
  });
};