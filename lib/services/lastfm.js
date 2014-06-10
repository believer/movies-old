'use strict';

var Q       = require('q')
,   request = require('request');

// Get the POST body and split with an colon trying to find a user
// other than iteam1337, otherwise fall back to iteam1337
exports.get = function (req) {
  var body = req.body
  ,   user = body.text.split(':')[1] ? body.text.split(':')[1].trim().split(' ')[0] : 'iteam1337'
  ,   url = 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user={user}&api_key=59a34f30f3c5163f936e755463780ad2&format=json&limit=1';

  console.log(body);

  var deferred = Q.defer();

  console.log(user);

  request(url.replace('{user}',user),function (err, response, body) {
    var lastfm = JSON.parse(body);
    lastfm = lastfm.recenttracks.track[0] || lastfm.recenttracks.track;

    console.log(body);

    var sendUser = (user !== 'iteam1337') ? ' (_' + user + '_)' : '';
    console.log(obj);
    var obj = {
      'text': lastfm.artist['#text'] + ' - ' + lastfm.name + sendUser,
    };

    deferred.resolve(obj);
  });

  return deferred.promise;
};