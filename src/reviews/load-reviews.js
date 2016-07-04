'use strict';
var Const = require('../constants');

/** @type {HTMLElement} */
var reviewsBlock = document.querySelector('.reviews');

/** Отрисовка отзывов на страницу
 * @param {callback} callbackAfter - функция отрисовки, которая будет вызвана после загрузки отзывов
 * @param {callback} callbackBefore - отобразить загрузчики
 */
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

  xhr.timeout = Const.IMAGE_LOAD_TIMEOUT;
  xhr.open('GET', Const.REVIEWS_LOAD_URL);
  xhr.send();
};

module.exports = loadReviews;
