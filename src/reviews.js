'use strict';

(function() {

  var reviews = [];
  var reviewsFilters = document.querySelector('.reviews-filter');
  var reviewsContainer = document.querySelector('.reviews-list');
  var template = document.querySelector('#review-template');
  var elementToClone;

  if('content' in template) {
    elementToClone = template.content.querySelector('.review');
  } else {
    elementToClone = template.querySelector('.review');
  }

  /** @constant {number} */
  var IMAGE_LOAD_TIMEOUT = 10000;


  /**
   * @param {Object} data
   * @return {HTMLElement}
   */
  var getReviewElement = function(data) {
    var element = elementToClone.cloneNode(true);

    element.querySelector('.review-text').textContent = data.description;
    element.querySelector('.review-rating').style.width = (data.rating * 30) + 'px';
    console.log(element.querySelector('.review-rating').width);

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

    var imageLoadTimeOut = setTimeout(function () {
      authorPhoto.src = '';
      element.classList.add('review-load-failure');
    }, IMAGE_LOAD_TIMEOUT);

    reviewsContainer.appendChild(element);
    return element;
  };


  var loadJSONPData = function (url, callbackAfter, callbackBefore) {
    if(typeof callbackBefore === 'function') {
      callbackBefore();
    }

    var scriptElement = document.createElement('script');
    scriptElement.src = url;
    document.body.appendChild(scriptElement);

    window.__reviewsLoadCallback = function(data) {
      if(typeof callbackAfter === 'function') {
        callbackAfter(data);
      }
    }
  };

  loadJSONPData('https://up.htmlacademy.ru/assets/js_intensive/jsonp/reviews.js', function(data) {
    data.forEach(function(review) {
      getReviewElement(review);
    });

    //Отображаем блок с фильтрами.
    reviewsFilters.classList.remove('invisible');
  }, function() {

    //Прячем блок с фильтрами .reviews-filter
    reviewsFilters.classList.add('invisible');
  });
})();
