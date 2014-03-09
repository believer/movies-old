'use strict';

var input = document.getElementById('search')
,   xmlHttp = null;

function ProcessRequest() {
  if ( xmlHttp.readyState === 4 && xmlHttp.status === 200 ) {
    var res = JSON.parse(xmlHttp.responseText);
    var results = document.getElementById('search-results');

    while(results.firstChild) {
      results.removeChild(results.firstChild);
    }

    res.forEach(function (movie) {
      var li = document.createElement('li');
      li.innerText = movie.title;

      results.appendChild(li);
    });
  }
}

function search() {
  var q = input.value;

  if (q.length > 2) {
    var url = '/search?title=' + q;

    xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = ProcessRequest;
    xmlHttp.open( 'GET', url, true );
    xmlHttp.send( null );
  }
}

if (input) {
  input.addEventListener('keyup', search, false);
}
