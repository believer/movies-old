var chai = require('chai'),
  expect = chai.expect,
  sinon = require('sinon'),
  proxyquire = require('proxyquire'),
  Q = require('q');

chai.use(require('sinon-chai'));

describe('lastfmService', function () {
  var lastfmService,
    routes,
    promise,
    req,
    clock,
    movee,
    request,
    url;

  beforeEach(function () {
    sinon.stub(process, 'nextTick').yields();
    clock = sinon.useFakeTimers(new Date(2000, 11, 24).getTime(), 'Date');
    sinon.stub(Date, 'now').returns(123456);

    req = {
      body: {
        'text': 'np:hpbeliever'
      }
    };

    routes = {
      get: sinon.stub()
    };

    movee = {
      mongoConnect: sinon.spy()
    };

    url = 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user={user}&api_key=59a34f30f3c5163f936e755463780ad2&format=json&limit=1';

    request = sinon.stub();

    lastfmService = proxyquire(process.cwd() + '/lib/services/lastfm', {
      '../utils/movee': movee,
      'request': request
    });
  });

  afterEach(function () {
    process.nextTick.restore();
    clock.restore();
  });

  it('should be a function', function () {
    expect(lastfmService.get).to.be.a('function');
  });

  it('should send a request to the Last.fm API when someone types "np:username"', function () {
    req = {
      body: {
        'text': 'np:hpbeliever'
      }
    };

    lastfmService.get(req);

    expect(request).calledOnce.and.calledWith(url.replace('{user}', 'hpbeliever'));
  });

  it('should send a request to the Last.fm API when someone types "nowplaying: username"', function () {
    req = {
      body: {
        'text': 'nowplaying: ankjevel'
      }
    };

    lastfmService.get(req);

    expect(request).calledOnce.and.calledWith(url.replace('{user}', 'ankjevel'));
  });

  it('should send a request to the Last.fm API with "iteam1337" when someone types np or nowplaying', function () {
    req = {
      body: {
        'text': 'np'
      }
    };

    lastfmService.get(req);

    expect(request).calledOnce.and.calledWith(url.replace('{user}', 'iteam1337'));
  });
});