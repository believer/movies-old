var api = require('../services/api');

/**
 * GET stats from API
 * @param  {object} req - req object
 * @param  {object} res - res object
 */
var stats = function (req, res) {
  api
    .get('/stats')
    .then(function (data) {
      res.send(data);
    })
    .catch(function (error) {
      console.log(error);
    });
};

module.exports = stats;