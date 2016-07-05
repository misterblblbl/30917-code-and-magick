'use strict';

/** 
 * Объект со всеми используемыми константами
 * @enum {Object|number|string} */

var Const = {
  Keycodes: {
    ESC: 27,
    LEFT: 37,
    RIGHT: 39
  },

  IMAGE_LOAD_TIMEOUT: 10000,

  PAGE_SIZE: 3,

  REVIEWS_LOAD_URL: 'https://o0.github.io/assets/json/reviews.json',

  GALLERY_REG_EXP: /#photo\/(\S+)/,

  MIN_RATING: 3,

  MY_BIRTHDAY_DATE: {
    day: 9,
    month: 5
  },

  DAYS_IN_MILISECONDS: 1000 * 60 * 60 * 24
};

module.exports = Const;
