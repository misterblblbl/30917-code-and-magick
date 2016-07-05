'use strict';

var Filter = require('./filters-list');

/** Фильтрация отзывов
 * @param {Array.<Object>} reviewsList
 * @param {string} filter - применяемый фильтр
 * @returns {Array.<Object>} - отфильтрованный массив с отзывами
 */
var getFilteredReviews = function(reviewsList, filter) {
  var reviewsToFilter = reviewsList.slice(0);

  switch (filter) {
    case Filter.BAD:
      reviewsToFilter.sort(function(a, b) {
        return a.rating - b.rating;
      });
      break;
    case Filter.GOOD:
      reviewsToFilter.sort(function(a, b) {
        return b.rating - a.rating;
      });
      break;
    case Filter.RECENT:
      reviewsToFilter.sort(function(a, b) {
        return new Date(b.date) - new Date(a.date);
      });
      break;
    case Filter.POPULAR:
      reviewsToFilter.sort(function(a, b) {
        return b.review_usefulness - a.review_usefulness;
      });
      break;
  }
  return reviewsToFilter;
};

module.exports = getFilteredReviews;
