'use strict';

var chai   = require('chai')
,   expect = chai.expect
,   sinon  = require('sinon')
,   movee  = require('../../lib/utils/movee');

describe('#sortNames', function() {
  var sandbox;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('should be a function', function () {
    expect(movee.sortNames).to.be.a('function');
  });

  it('should return an array with keys', function () {
    var names = [
      'Tom Hanks',
      'Samuel L. Jackson'
    ];

    expect(movee.sortNames(names, 5)).to.be.an('object').with.keys(['array', 'total']);
  });

  it('should return how many persons were in the category', function () {
    var names = [
      'Tom Hanks',
      'Samuel L. Jackson'
    ];

    var results = movee.sortNames(names, 5);

    expect(results.total).to.eql(2);
  });

  it('should call getTen with sorted arrays and max number', function () {
    sandbox.spy(movee, 'getTen');

    var names = [
      'Tom Hanks',
      'Samuel L. Jackson',
      'Tom Hanks'
    ];

    var persons = [
      'Samuel L. Jackson',
      'Tom Hanks'
    ];

    var movies = [1,2];

    var collection = [persons, movies];

    movee.sortNames(names, 5);

    expect(movee.getTen).calledOnce.and.calledWith(collection, 5);
  });
});

describe('#getTen', function() {
  var persons, movies, collection;

  beforeEach(function () {
    persons = [
      'Samuel L. Jackson',
      'Tom Hanks'
    ];

    movies = [1,2];

    collection = [persons, movies];
  });

  it('should be a function', function () {
    expect(movee.getTen).to.be.a('function');
  });

  it('should return an array', function () {
    expect(movee.getTen(collection, 5)).to.be.an('array').with.length(2);
  });

  it('should set indidvidual objects for each actor and sort the in order of most movies', function () {
    var results = movee.getTen(collection, 5);

    expect(results[0].name).to.eql('Tom Hanks');
    expect(results[0].movies).to.eql(2);
  });
});

describe('#mongoConnect', function() {
  it('should be a function', function () {
    expect(movee.mongoConnect).to.be.a('function');
  });
});

describe('#getCrew', function() {
  it('should be a function', function () {
    expect(movee.getCrew).to.be.a('function');
  });

  it('should return the crew type Director', function () {
    expect(movee.getCrew('Director')).to.eql('director');
  });

  it('should return the crew type Writer for multiple types', function () {
    expect(movee.getCrew('Writing')).to.eql('writer');
    expect(movee.getCrew('Screenplay')).to.eql('writer');
    expect(movee.getCrew('Writer')).to.eql('writer');
  });

  it('should return the crew type Music', function () {
    expect(movee.getCrew('Original Music Composer')).to.eql('music');
  });
});

describe('#randomIntFromInterval', function() {
  it('should be a function', function () {
    expect(movee.randomIntFromInterval).to.be.a('function');
  });

  it('should return a random integer between a given interval', function () {
    expect(movee.randomIntFromInterval(5,20)).to.be.a('number').gte(5).lte(20);
  });
});

describe('#truncate', function() {
  var text, shorttext;

  it('should be a function', function () {
    expect(movee.truncate).to.be.a('function');
  });

  beforeEach(function () {
    text = 'Cotton candy tiramisu oat cake pudding biscuit caramels candy bear claw jujubes. Fruitcake liquorice jelly jelly beans bonbon cake liquorice tart carrot cake. Liquorice gummies ice cream cake cheesecake apple pie jujubes fruitcake. Fruitcake jelly beans tiramisu candy oat cake chocolate cake muffin icing pudding. Danish caramels chocolate bar gummi bears cupcake. Liquorice topping caramels macaroon lollipop chocolate. Powder cheesecake jelly-o. Macaroon pastry oat cake lollipop cheesecake muffin pastry.Macaroon chocolate bar oat cake apple pie ice cream jelly gingerbread. Applicake candy liquorice chocolate bar croissant cookie cotton candy. Gingerbread candy chocolate bar. Sesame snaps jelly jelly beans ice cream jelly-o. Chupa chups marshmallow brownie halvah. Pie candy canes sweet roll sugar plum. Gingerbread croissant icing. Cookie sweet roll apple pie dessert macaroon brownie.';

    shorttext = 'Cotton candy tiramisu oat';
  });

  it('should return a truncated string', function () {
    expect(movee.truncate(text, 100)).to.have.length(103);
  });

  it('should add ellipsis at the end of the truncated string', function () {
    expect(movee.truncate(text, 100).substr(-3)).to.eql('...');
  });

  it('should not do anything with a short string', function () {
    expect(movee.truncate(shorttext,100)).to.eql(shorttext);
  });
});

describe("#shuffleArray", function() {
  it("should be a function", function() {
    expect(movee.shuffleArray).to.be.a('function');
  });

  it("should shuffle an array", function() {
    var array = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    expect(movee.shuffleArray(array)).to.not.eql([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});

