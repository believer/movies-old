"use strict";function isCorrect(e){e.target.classList.contains("correct")?(document.getElementById("quiz").style.display="none",document.getElementById("correct").style.display="block",localStorage.getItem("quizScore")?localStorage.setItem("quizScore",parseInt(localStorage.getItem("quizScore"),10)+1):localStorage.setItem("quizScore",1)):(document.getElementById("quiz").style.display="none",document.getElementById("incorrect").style.display="block"),setTimeout(function(){location.reload()},1e3)}function readMore(){var e=document.querySelector(".row.index > .col-md-12");e.classList.toggle("more")}var quiz=document.getElementById("guess");quiz&&quiz.addEventListener("keydown",function(e){if(13===e.keyCode){var t=parseInt(document.getElementById("answer").value,10);parseInt(quiz.value,10)===t&&(document.getElementById("correct").style.display="block")}},!1);var score=document.getElementById("score"),alternatives=document.querySelectorAll("#quiz ul li");if(score&&(score.innerText=localStorage.getItem("quizScore")||0),alternatives)for(var i=0;i<alternatives.length;i++)alternatives[i].addEventListener("click",isCorrect,!1);var read=document.querySelector(".read-more");read&&read.addEventListener("click",readMore);