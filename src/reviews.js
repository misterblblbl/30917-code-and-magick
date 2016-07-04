'use strict';

var loadReviews = require('./reviews/load-reviews');
var Filter = require('./reviews/filters-list');
var getFilteredReviews = require('./reviews/filters');
var Review = require('./reviews/review');
var Const = require('./constants');

/** @type {HTMLElement} */
var reviewsFilters = document.querySelector('.reviews-filter');

/** @type {HTMLElement} */
var reviewsContainer = document.querySelector('.reviews-list');

/** @type {HTMLElement} */
var reviewsBlock = document.querySelector('.reviews');

/** @type {HTMLElement} */
var moreReviewsButton = document.querySelector('.reviews-controls-more');

/** @type {Array.<Object>} */
var reviews = [];

/** @type {Array.<Object>} */
var filteredReviews = [];

/** @type {Array.<Object>} */
var renderedReviews = [];

/** @type {number} */
var pageNumber = 0;

/** @constant {Filter} */
var DEFAULT_FILTER = Filter.ALL;

/** Отрисовка отзывов на страницу
 * @param {Array.<Object>} reviewsToRender
 * @param {number} page - страница, с которой начинается отрисовка
 * @param {number} pageSize - размер отрисовываемой страницы
 */

var renderReviews = function(reviewsToRender, page, pageSize) {
  var from = page * pageSize;
  var to = from + pageSize;

  var container = document.createDocumentFragment();

  if(reviewsToRender.length) {
    reviewsToRender.slice(from, to).forEach(function(data) {
      renderedReviews.push(new Review(data, container));
    });
  } else {
    var reviewsMessage = document.createElement('div');
    reviewsMessage.textContent = 'Подходящие отзывы не найдены';
    reviewsMessage.style.marginBottom = '30px';
    reviewsContainer.appendChild(reviewsMessage);
  }
  reviewsContainer.appendChild(container);
};

//Пока длится загрузка файла, показываем прелоадер и прячем блок с фильтрами .reviews-filter
var showPreloader = function() {
  reviewsBlock.classList.add('reviews-list-loading');
  reviewsFilters.classList.add('invisible');
};

//Убираем прелоадер и отображаем блок с фильтрами
var removePreloader = function() {
  reviewsBlock.classList.remove('reviews-list-loading');
  reviewsFilters.classList.remove('invisible');
};

/** Отрисовка отфильтрованных отзывов на страницу
 * @param {string} filter
 */
var setFilter = function(filter) {
  //Очищаем отзывы
  if(renderedReviews) {
    renderedReviews.forEach(function(review) {
      review.remove();
    });
    renderedReviews = [];
  }

  //Показываем кнопку для пролистывания отзывов
  moreReviewsButton.classList.remove('invisible');

  filteredReviews = getFilteredReviews(reviews, filter);
  pageNumber = 0;
  renderReviews(filteredReviews, pageNumber, Const.PAGE_SIZE);
};

//Проверить, сохранён ли последний примененный фильтр в localStorage, если да, то применить его
//и подсветить инпут с выбранным фильтром
var checkLastFilters = function() {
  var lastFilter = localStorage.getItem('lastFilter') || DEFAULT_FILTER;
  reviewsFilters.querySelector('#' + lastFilter).checked = true;
  setFilter(lastFilter);
};

// установить обработчик изменения фильтра
var setFiltrationEnabled = function() {
  reviewsFilters.addEventListener('click', function(evt) {
    if(evt.target.name === 'reviews') {
      setFilter(evt.target.id);
      localStorage.setItem('lastFilter', evt.target.id);
    }
  });
};

moreReviewsButton.onclick = function() {
  var pagesCountLimit = Math.floor(filteredReviews.length / Const.PAGE_SIZE);

  if(pageNumber < pagesCountLimit - 1) {
    pageNumber++;
    renderReviews(filteredReviews, pageNumber, Const.PAGE_SIZE);
  } else if (pageNumber === pagesCountLimit - 1) {
    moreReviewsButton.classList.add('invisible');
    pageNumber++;
    renderReviews(filteredReviews, pageNumber, Const.PAGE_SIZE);
  }
};

showPreloader();
loadReviews(function(loadedReviews) {
  reviews = loadedReviews;
  setFiltrationEnabled(true);
  checkLastFilters();
}, removePreloader()
);
