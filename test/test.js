var expect  = require('expect.js')
,   Browser = require('zombie');

describe('Start page', function() {
  before(function () {
    this.browser = new Browser({ site: 'http://localhost:3000' });
  });

  before(function(done) {
    this.browser.visit('/', done);
  });

  it('should load the page correctly', function () {
    expect(this.browser.success).to.be.true;
  });

  it('should set the correct title', function () {
    expect(this.browser.text('title')).to.equal('Movee');
  });

  it('should load 100 movies', function () {
    expect(this.browser.queryAll('body > .container > .row').length).to.eql(100);
  });

  it('should navigate to an actor on click', function () {
    var url = this.browser.query('body > .container > .row .cast li:first-child a');
    this.browser.clickLink('body > .container > .row .cast li:first-child a', function () {
      expect(this.browser.location).to.equal(url.href);
    });
  });
});

describe('Actor page', function() {
  before(function () {
    this.browser = new Browser({ site: 'http://localhost:3000' });
  });

  before(function(done) {
    this.browser.visit('/actor?name=Hugh+Jackman', done);
  });

  it('should get the correct actor', function () {
    expect(this.browser.text('.title h1')).to.equal('Hugh Jackman');
  });

  it('should calculate the correct amount of movies', function () {
    expect(this.browser.queryAll('.actor ul li').length).to.eql(parseInt(this.browser.text('.rating'),10));
  });
});
