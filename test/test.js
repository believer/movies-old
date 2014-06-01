'use strict';

var chai   = require('chai')
,   expect = chai.expect
,   sinon  = require('sinon')
,   routes = require('../routes/index');

chai.use(require('sinon-chai'));

describe('index', function() {
  var req,res;

  beforeEach(function () {
    req = {};
    res = {
      send: sinon.spy(),
      render: sinon.spy()
    };
  });

  it('should be a function', function () {
    expect(routes.index).to.be.a('function');
  });
});

describe('actor', function() {
  var req,res;

  beforeEach(function () {
    req = {
      query: {
        name: 'Tom Hanks'
      }
    };
    res = {
      send: sinon.spy(),
      render: sinon.spy()
    };
  });

  it('should be a function', function () {
    expect(routes.actor).to.be.a('function');
  });
});

describe('#search', function() {
  it('should be a function', function () {
    expect(routes.search).to.be.a('function');
  });
});

describe('#stats', function() {
  it('should be a function', function () {
    expect(routes.stats).to.be.a('function');
  });
});

describe('#np', function() {
  it('should be a function', function () {
    expect(routes.np).to.be.a('function');
  });
});

describe('#tmdb', function() {
  it('should be a function', function () {
    expect(routes.tmdb).to.be.a('function');
  });
});

describe('#trakt', function() {
  it('should be a function', function () {
    expect(routes.trakt).to.be.a('function');
  });
});

describe('#watching', function() {
  it('should be a function', function () {
    expect(routes.watching).to.be.a('function');
  });
});

describe('#quiz', function() {
  it('should be a function', function () {
    expect(routes.quiz).to.be.a('function');
  });
});