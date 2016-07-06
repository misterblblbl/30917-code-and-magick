'use strict';

var Utils = {
  /**
   * Очистить хэш страницы
   */
  clearHash: function() {
    window.location.hash = '';
  },

  /**
   * Проверка хэша на соответсвие регулярному выражению
   * @param {regExp} regExp
   * @return {string|boolean}
   */
  checkHash: function(regExp) {
    var matchedHash = location.hash.match(regExp);
    if (Array.isArray(matchedHash)) {
      return matchedHash[1];
    } else {
      return false;
    }
  },

  /**
   * При поялении попапа убратб скролл с body для избежания двойного скролла
   */
  removeBodyScroll: function() {
    document.body.classList.add('non-scrollable');
  },

  /**
   * Вернуть скролл body
   */
  returnBodyScroll: function() {
    document.body.classList.remove('non-scrollable');
  }
};

module.exports = Utils;
