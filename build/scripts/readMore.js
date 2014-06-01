'use strict';

var read = document.querySelector('.read-more');

if (!!read) {
  read.addEventListener('click', readMore);
}

function readMore () {
  var col = document.querySelector('.row.index > .col-md-12');
  col.classList.toggle('more');
}