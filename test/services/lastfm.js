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
    movee;

  beforeEach(function () {
    sinon.stub(process, 'nextTick').yields();
    clock = sinon.useFakeTimers(new Date(2000, 11, 24).getTime(), 'Date');
    sinon.stub(Date, 'now').returns(123456);

    req = {
      body: {
        decisionId: '123'
      },
      params: {
        sample_id: '09B',
        item_id: '00A'
      },
      query: {
        state: 'reviewed',
        skip: 0,
        limit: 25
      },
      connection: {
        encrypted: false
      },
      headers: {
        host: 'test'
      },
      session: {
        username: 'tester.gonna.test'
      }
    };

    routes = {
      get: sinon.stub()
    };

    movee = {
      mongoConnect: sinon.spy()
    };

    routes.get.deferred = Q.defer();

    lastfmService = proxyquire(process.cwd() + '/lib/services/lastfm', {
      '../utils/movee': movee,
    });
  });

  afterEach(function () {
    process.nextTick.restore();
    clock.restore();
  });

  it('should be a function', function () {
    expect(routes.get).to.be.a('function');
  });
});