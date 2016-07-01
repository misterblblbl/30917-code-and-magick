'use strict';

var loadReviews = require('./reviews/load-reviews');
var renderReviews = require('./reviews/get-reviews');
var Filter = require('./reviews/filters-list');
var getFilteredReviews = require('./reviews/filters');

(function() {
  var reviewsFilters = document.querySelector('.reviews-filter');
  var reviewsContainer = document.querySelector('.reviews-list');
  var reviewsBlock = document.querySelector('.reviews');
  var moreReviewsButton = document.querySelector('.reviews-controls-more');

  /** @type {Array.<Object>} */
  var reviews = [];

  /** @type {Array.<Object>} */
  var filteredReviews = [];

  /** @type {number} */
  var pageNumber = 0;

  /** @constant {number} */
  var PAGE_SIZE = 3;

  var DEFAULT_FILTER = Filter.ALL;


  var showPreloader = function() {
    //Пока длится загрузка файла, показываем прелоадер
    reviewsBlock.classList.add('reviews-list-loading');
    //Прячем блок с фильтрами .reviews-filter
    reviewsFilters.classList.add('invisible');
  };

  var removePreloader = function() {
    //Убираем прелоадер
    reviewsBlock.classList.remove('reviews-list-loading');
    //Отображаем блок с фильтрами.
    reviewsFilters.classList.remove('invisible');
  };

  var setFilter = function(filter) {
    //Очищаем отзывы
    reviewsContainer.innerHTML = '';
    //Показываем кнопку для пролистывания отзывов
    moreReviewsButton.classList.remove('invisible');

    filteredReviews = getFilteredReviews(reviews, filter);
    pageNumber = 0;
    renderReviews(filteredReviews, pageNumber, PAGE_SIZE);
  };

  var setFiltrationEnabled = function() {
    reviewsFilters.addEventListener('click', function(evt) {
      if(evt.target.name === 'reviews') {
        setFilter(evt.target.id);
      }
    });
  };

  moreReviewsButton.onclick = function() {
    var pagesCountLimit = Math.floor(filteredReviews.length / PAGE_SIZE);

    if(pageNumber < pagesCountLimit - 1) {
      pageNumber++;
      renderReviews(filteredReviews, pageNumber, PAGE_SIZE);
    } else if (pageNumber === pagesCountLimit - 1) {
      moreReviewsButton.classList.add('invisible');
      pageNumber++;
      renderReviews(filteredReviews, pageNumber, PAGE_SIZE);
    }
  };

  showPreloader();
  loadReviews(function(loadedReviews) {
    reviews = loadedReviews;
    setFiltrationEnabled(true);
    setFilter(DEFAULT_FILTER);
  },
    removePreloader()
  );

})();
