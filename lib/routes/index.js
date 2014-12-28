var api = require('../services/api');

/**
 * GET stats from API
 * @param  {object} req - req object
 * @param  {object} res - res object
 */
var stats = function (req, res) {
  api
    .get('/movies')
    .then(function (data) {
      res.render('index', {
        movies: data.results
      });
    })
    .catch(function (error) {
      console.log(error);
    });
};

module.exports = stats;