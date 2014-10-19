var chai       = require('chai')
,   expect     = chai.expect
,   sinon      = require('sinon')
,   proxyquire = require('proxyquire');

chai.use(require('sinon-chai'));

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
    query: sinon.spy()
  };
  next = sinon.spy();
  res = {
    send: sinon.spy(),
    render: sinon.spy()
  };
  service = {
    get: sinon.stub().returns(promise),
  };
  route = proxyquire(process.cwd() + '/lib/routes/movies', {
    '../services/movies': service
  });
});

afterEach(function () {
  sandbox.restore();
});

describe('#index', function() {
  it('should be a function', function () {
    expect(route.index).to.be.a('function');
  });

  it('should call the Db to get one movie', function () {
    route.index(req,res,next);
    expect(service.get).calledOnce.and.calledWith(req);
  });

  it('should get some movies back and render index', function () {
    var result = { results: [{ title: 'Non-Stop' }]};
    route.index(req,res,next);
    promise.then.yield(result);
    expect(res.render).calledOnce.and.calledWith('index', { movies: result.results});
  });

  it("should call next with error if any", function() {
    var result = { oh: 'noes' };
    route.index(req, res, next);
    promise.catch.yield(result);
    expect(next).calledOnce.and.calledWith(result);    
  });
});

describe('#movies', function() {
  it('should be a function', function () {
    expect(route.numberOfMovies).to.be.a('function');
  });

  it('should get an amount of movies from the Db', function () {
    route.numberOfMovies(req,res);
    expect(service.get).calledOnce.and.calledWith(req);
  });

  it('should send result', function () {
    var result = { text: '30 Seconds to Mars' };
    route.numberOfMovies(req,res,next);
    promise.then.yield(result);
    expect(res.send).calledOnce.and.calledWith(result);
  });

  it('should call next with error if any', function () {
    var result = { oh: 'noes' };
    route.numberOfMovies(req, res, next);
    promise.catch.yield(result);
    expect(next).calledOnce.and.calledWith(result);
  });
});