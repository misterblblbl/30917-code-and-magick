'use strict';

/** @constant {string} */
var REVIEWS_LOAD_URL = 'https://o0.github.io/assets/json/reviews.json';

/** @constant {number} */
var IMAGE_LOAD_TIMEOUT = 10000;

var reviewsBlock = document.querySelector('.reviews');

var loadReviews = function(callbackAfter, callbackBefore) {
  if(typeof callbackBefore === 'function') {
    callbackBefore();
  }
  var xhr = new XMLHttpRequest();

  xhr.onload = function(evt) {
    var loadedData = JSON.parse(evt.target.response);
    callbackAfter(loadedData);
  };

  xhr.ontimeout = function() {
    reviewsBlock.classList.remove('reviews-list-loading');
    reviewsBlock.classList.add('reviews-load-failure');
  };

  xhr.timeout = IMAGE_LOAD_TIMEOUT;
  xhr.open('GET', REVIEWS_LOAD_URL);
  xhr.send();
};

module.exports = loadReviews;
