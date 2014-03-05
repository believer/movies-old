var req     = require('supertest')
,   express = require('express');

var app = require('../app.js');

describe('#search', function () {
  it('should respond with json', function (done) {
    req(app)
      .get('/search')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

describe('#actor', function () {
  it('should respond', function (done) {
    req(app)
      .get('/actor')
      .expect(200, done);
  });
});

describe('#index', function () {
  it('should respond', function (done) {
    req(app)
      .get('/')
      .expect(200, done);
  });
});