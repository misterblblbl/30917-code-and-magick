'use strict';

var Const = require('../constants');

/** @type {HTMLElement} */
var template = document.getElementById('review-template');
var elementToClone;


if('content' in template) {
  elementToClone = template.content.querySelector('.review');
} else {
  elementToClone = template.querySelector('.review');
}

/**
 * @param {Object} data
 * @return {HTMLElement}
 */

var getReviewElement = function(data) {
  var element = elementToClone.cloneNode(true);

  element.querySelector('.review-text').textContent = data.description;
  element.querySelector('.review-rating').style.width = (data.rating * 30) + 'px';

  var authorPhoto = new Image(124, 124);

  authorPhoto.onload = function() {
    clearTimeout(imageLoadTimeOut);
  };

  authorPhoto.onerror = function() {
    element.classList.add('review-load-failure');
  };

  authorPhoto.src = data.author.picture;
  authorPhoto.alt = data.author.name;
  element.replaceChild(authorPhoto, element.querySelector('.review-author'));
  authorPhoto.classList.add('review-author');

  var imageLoadTimeOut = setTimeout(function() {
    authorPhoto.src = '';
    element.classList.add('review-load-failure');
  }, Const.IMAGE_LOAD_TIMEOUT);

  return element;
};

module.exports = getReviewElement;
