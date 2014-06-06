var chai       = require('chai')
,   expect     = chai.expect
,   sinon      = require('sinon')
,   proxyquire = require('proxyquire');

chai.use(require('sinon-chai'));

describe('#lastfm', function() {
  var route, 
    sandbox,
    service,
    req,
    res,
    next,
    promise;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    promise = {
      then: sinon.stub(),
      catch: sinon.spy()
    };
    promise.then.returns(promise);
    req = {};
    next = sinon.spy();
    res = {
      send: sinon.spy()
    };
    service = {
      get: sinon.stub().returns(promise),
    };
    route = proxyquire(process.cwd() + '/lib/routes/lastfm', {
      '../services/lastfm': service
    });
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('should be a function', function () {
    expect(route.lastfm).to.be.a('function');
  });

  it('should call Last.fm API', function () {
    route.lastfm(req,res);
    expect(service.get).calledOnce.and.calledWith({});
  });

  it('should send result', function () {
    var result = { text: '30 Seconds to Mars' };
    route.lastfm(req,res,next);
    promise.then.yield(result);
    expect(res.send).calledOnce.and.calledWith(result);
  });

  it('should call next with error if any', function () {
    var result = { oh: 'noes' };
    route.lastfm(req, res, next);
    promise.catch.yield(result);
    expect(next).calledOnce.and.calledWith(result);
  });
});