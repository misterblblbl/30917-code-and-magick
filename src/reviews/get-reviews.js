'use strict';

var reviewsContainer = document.querySelector('.reviews-list');
var template = document.getElementById('review-template');
var elementToClone;

/** @constant {number} */
var IMAGE_LOAD_TIMEOUT = 10000;

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
  }, IMAGE_LOAD_TIMEOUT);

  reviewsContainer.appendChild(element);
  return element;
};

var renderReviews = function(reviewsToRender, page, pageSize) {
  //reviewsContainer.innerHTML = '';

  var from = page * pageSize;
  var to = from + pageSize;

  if(reviewsToRender.length) {
    reviewsToRender.slice(from, to).forEach(function(review) {
      getReviewElement(review);
    });
  } else {
    var reviewsMessage = document.createElement('div');
    reviewsMessage.textContent = 'Подходящие отзывы не найдены';
    reviewsMessage.style.marginBottom = '30px';
    reviewsContainer.appendChild(reviewsMessage);
  }
};

module.exports = renderReviews;
