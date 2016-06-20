'use strict';

(function() {
  var reviewsFilters = document.querySelector('.reviews-filter');
  var reviewsContainer = document.querySelector('.reviews-list');
  var reviewsBlock = document.querySelector('.reviews');
  var moreReviewsButton = document.querySelector('.reviews-controls-more');

  var template = document.getElementById('review-template');
  var elementToClone;

  /** @type {Array.<Object>} */
  var reviews = [];

  /** @type {Array.<Object>} */
  var filteredReviews = [];

  if('content' in template) {
    elementToClone = template.content.querySelector('.review');
  } else {
    elementToClone = template.querySelector('.review');
  }

  /** @constant {string} */
  var REVIEWS_LOAD_URL = 'https://o0.github.io/assets/json/reviews.json';

  /** @constant {number} */
  var IMAGE_LOAD_TIMEOUT = 10000;

  /** @constant {number} */
  var PAGE_SIZE = 3;

  /** @type {number} */
  var pageNumber = 0;

  var Filter = {
    'ALL': 'reviews-all',
    'BAD': 'reviews-bad',
    'GOOD': 'reviews-good',
    'RECENT': 'reviews-recent',
    'POPULAR': 'reviews-popular'
  };

  var DEFAULT_FILTER = Filter.ALL;


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

  var getReviewsData = function(callbackAfter, callbackBefore) {
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

  var renderReviews = function(reviewsToRender, page) {
    //reviewsContainer.innerHTML = '';

    var from = page * PAGE_SIZE;
    var to = from + PAGE_SIZE;

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

  var setFilter = function(filter) {
    //Очищаем отзывы
    reviewsContainer.innerHTML = '';
    //Показываем кнопку для пролистывания отзывов
    moreReviewsButton.classList.remove('invisible');

    filteredReviews = getFilteredReviews(reviews, filter);
    pageNumber = 0;
    renderReviews(filteredReviews, pageNumber);
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
      renderReviews(filteredReviews, pageNumber);
    } else if (pageNumber === pagesCountLimit - 1) {
      moreReviewsButton.classList.add('invisible');
      pageNumber++;
      renderReviews(filteredReviews, pageNumber);
    }
  };

  showPreloader();
  getReviewsData(function(loadedReviews) {
    reviews = loadedReviews;
    setFiltrationEnabled(true);
    setFilter(DEFAULT_FILTER);
  },
    removePreloader()
  );

})();
