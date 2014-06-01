'use strict';

var read = document.querySelector('.read-more');

if (!!read) {
  read.addEventListener('click', readMore);
}

function readMore () {
  var col = document.querySelector('.row.index');
  col.classList.toggle('more');
}

var a = document.getElementsByTagName("a");

for(var i=0; i < a.length; i++) {
  a[i].onclick = function () {
    window.location=this.getAttribute("href");
    return false
  }
}