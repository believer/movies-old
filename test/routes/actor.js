var chai       = require('chai')
,   expect     = chai.expect
,   sinon      = require('sinon')
,   proxyquire = require('proxyquire');

chai.use(require('sinon-chai'));

describe('#actor', function() {
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
    req = {
      query: {
        name:'Tom Hanks'
      }
    };
    next = sinon.spy();
    res = {
      render: sinon.spy()
    };
    service = {
      get: sinon.stub().returns(promise),
    };
    route = proxyquire(process.cwd() + '/lib/routes/actor', {
      '../services/actor': service
    });
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('should be a function', function () {
    expect(route.actor).to.be.a('function');
  });

  it('should get movies from db', function () {
    route.actor(req,res);
    expect(service.get).calledOnce.and.calledWith({ query: { name: 'Tom Hanks' }});
  });

  it('should send result', function () {
    var result = [{ title: 'Forrest Gump' }];
    route.actor(req,res,next);
    promise.then.yield(result);
    expect(res.render).calledOnce.and.calledWith('actor', { actor: 'Tom Hanks', movies: result});
  });

  it('should call next with error if any', function () {
    var result = { oh: 'noes' };
    route.actor(req, res, next);
    promise.catch.yield(result);
    expect(next).calledOnce.and.calledWith(result);
  });
});