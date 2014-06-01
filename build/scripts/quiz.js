'use strict';

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

