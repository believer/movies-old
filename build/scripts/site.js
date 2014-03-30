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

var quiz = document.getElementById('guess');

if (quiz) {
  quiz.addEventListener('keydown', function (e) {
    if (e.keyCode === 13) {
      var answer = parseInt(document.getElementById('answer').value, 10);

      if (parseInt(quiz.value,10) === answer) {
        document.getElementById('correct').style.display = 'block';
      }
    }
  }, false);
}

var score = document.getElementById('score');
var alternatives = document.querySelectorAll('#quiz ul li');

if (score) {
  score.innerText = localStorage.getItem('quizScore') || 0;
}

function isCorrect (e) {
  if (e.target.classList.contains('correct')) {
    document.getElementById('quiz').style.display = 'none';
    document.getElementById('correct').style.display = 'block';

    if (!localStorage.getItem('quizScore')) {
      localStorage.setItem('quizScore', 1);
    } else {
      localStorage.setItem('quizScore', parseInt(localStorage.getItem('quizScore'),10) + 1);
    }

  } else {
    document.getElementById('quiz').style.display = 'none';
    document.getElementById('incorrect').style.display = 'block';
  }

  setTimeout(function () { location.reload(); }, 1000);
}

if (alternatives) {
  for (var i = 0; i < alternatives.length; i++) {
    alternatives[i].addEventListener('click', isCorrect, false);
  }
}
