'use strict';

var getReviewElement = require('./reviews/get-reviews');

/**
 * @param {Object} data
 * @param {Element} container
 * @constructor
 */

var Review = function(data, container) {
  this.data = data;

  this.element = getReviewElement(this.data);

  this.onReviewClick = function() {

    /** @type {HTMLElement} */
    var reviewQuiz = document.querySelector('.review-quiz-answer');
    reviewQuiz.classList.add('review-quiz-answer-active');
  };

  this.remove = function() {
    this.element.removeEventListener('click', this.onReviewClick);
    this.element.parentNode.removeChild(this.element);
  };

  this.element.addEventListener('click', this.onReviewClick);
  container.appendChild(this.element);
};

module.exports = Review;
