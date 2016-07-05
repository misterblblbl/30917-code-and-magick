'use strict';

var getReviewElement = require('./get-reviews');

/**
 * @param {Object} data
 * @param {Element} container
 * @constructor
 */

var Review = function(data, container) {
  this.data = data;

  this.element = getReviewElement(this.data);
  container.appendChild(this.element);

  /** @type {HTMLElement} */
  this.reviewQuizYes = this.element.querySelector('.review-quiz-answer-yes');

  /** @type {HTMLElement} */
  this.reviewQuizNo = this.element.querySelector('.review-quiz-answer-no');

  this.onReviewClickYes = this.onReviewClickYes.bind(this);
  this.onReviewClickNo = this.onReviewClickNo.bind(this);

  this.reviewQuizYes.addEventListener('click', this.onReviewClickYes);
  this.reviewQuizNo.addEventListener('click', this.onReviewClickNo);

  this.remove = function() {
    this.element.removeEventListener('click', this.onReviewClick);
    this.element.parentNode.removeChild(this.element);
  };
};

Review.prototype.onReviewClickYes = function() {
  this.reviewQuizYes.classList.add('review-quiz-answer-active');
  this.reviewQuizNo.classList.remove('review-quiz-answer-active');
};

Review.prototype.onReviewClickNo = function() {
  this.reviewQuizNo.classList.add('review-quiz-answer-active');
  this.reviewQuizYes.classList.remove('review-quiz-answer-active');
};

module.exports = Review;
