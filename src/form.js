'use strict';

var Utils = require('./utilities');
var Const = require('./constants');
var browserCookies = require('browser-cookies');

/** @type {HTMLElement} */
var formContainer = document.querySelector('.overlay-container');

/** @type {HTMLElement} */
var formOpenButton = document.querySelector('.reviews-controls-new');

/** @type {HTMLElement} */
var formCloseButton = document.querySelector('.review-form-close');

/** @type {HTMLElement} */
var form = document.querySelector('.review-form');

/** @type {HTMLElement} */
var reviewLinks = document.querySelector('.review-fields');

/** @type {HTMLElement} */
var reviewLinksText = document.querySelector('.review-fields-text');

/** @type {HTMLElement} */
var reviewLinksName = document.querySelector('.review-fields-name');

/** @type {HTMLElement} */
var nameField = document.querySelector('#review-name');

/** @type {HTMLElement} */
var reviewField = document.querySelector('#review-text');

/** @type {HTMLElement} */
var formSubmitButton = document.querySelector('.review-submit');

/** @type {HTMLElement} */
var ratingForm = document.querySelector('.review-form-group-mark');

/** @type {boolean} */
var isLowRating;

/** @type {Date} */
var now = new Date();

/**
 * Проверка рейтинга, если рейтинг отрицательный, то значение переменной isLowRating устанавливается в true
 * */
var checkRating = function() {
  for(var i = 0; i < ratingForm.elements.length; i++) {
    if(i < Const.MIN_RATING && ratingForm.elements[i].checked) {
      isLowRating = true;
      reviewField.required = true;
      break;
    } else if (i >= Const.MIN_RATING && ratingForm.elements[i].checked) {
      isLowRating = false;
      reviewField.required = false;
    }
  }
};

/**
 * Проверка поля, если поле заполнено, то возврщается true
 * @param {HTMLElement} field
 * @return {boolean}
 * */
var checkField = function(field) {
  return field.value !== '';
};

/**
 * Получить количество дней, прошедшее с последнего дня рождения
 * @return {number}
 * */
var getExpirationDate = function() {
  var myLastBirthday;
  if(now < new Date(now.getFullYear(), Const.MY_BIRTHDAY_DATE.month, Const.MY_BIRTHDAY_DATE.day)) {
    myLastBirthday = new Date(now.getFullYear() - 1, Const.MY_BIRTHDAY_DATE.month, Const.MY_BIRTHDAY_DATE.day);
  } else {
    myLastBirthday = new Date(now.getFullYear() - 1, Const.MY_BIRTHDAY_DATE.month, Const.MY_BIRTHDAY_DATE.day);
  }
  return Math.ceil((now - myLastBirthday) / Const.DAYS_IN_MILISECONDS);
};

/**
 * Получить из cookies предыдущий отзыв и имя
 * */
var getPreviousReview = function() {
  nameField.value = browserCookies.get('userName');
  reviewField.value = browserCookies.get('reviewText');
};

/**
 * Поле "Имя" всегда обязательное
 * */
nameField.required = true;
reviewField.required = isLowRating && !(reviewField.value);
formSubmitButton.disabled = true;

/**
 * При изменении рейтинга, проверяем, не установлен ли он в значение меньше 3
 * @param {Event} evt
 * */
ratingForm.onchange = function(evt) {
  evt.preventDefault();
  checkRating();
  reviewLinksText.classList.toggle('invisible', !isLowRating);
};

/**
 * Проверить валидность всех полей формы
 * */
var checkFormValidity = function() {
  //Проверить рейтинг
  checkRating();

  //Если рейтинг низкий, то проверить заполнено ли поле Имя и Отзыв
  //Если рейтинг высокий, то проверить только Имя

  if(isLowRating) {
    reviewLinksText.classList.toggle('invisible', checkField(reviewField));
    reviewLinksName.classList.toggle('invisible', checkField(nameField));
    reviewLinks.classList.toggle('invisible', checkField(nameField) && checkField(reviewField));

    formSubmitButton.disabled = !(checkField(nameField) && checkField(reviewField));
  } else {
    reviewField.required = isLowRating;
    reviewLinks.classList.toggle('invisible', checkField(nameField));

    formSubmitButton.disabled = !checkField(nameField);
  }
};

form.oninput = function() {
  checkFormValidity();
};

/**
 * Сохранить введенные данные в cookies при отправке формы
 * */
form.onsubmit = function() {
  browserCookies.set('userName', nameField.value, {expires: getExpirationDate()});
  browserCookies.set('reviewText', reviewField.value, {expires: getExpirationDate()});
};

/**
 * Сделать видимым блок с формой
 * @param {Event} evt
 * */
formOpenButton.onclick = function(evt) {
  evt.preventDefault();
  formContainer.classList.remove('invisible');
  Utils.removeBodyScroll();
};

/**
 * Сделать невидимым блок с формой
 * @param {Event} evt
 * */
formCloseButton.onclick = function(evt) {
  evt.preventDefault();
  formContainer.classList.add('invisible');
  Utils.returnBodyScroll();
};

/**
 * Сделать невидимой форму при нажатии ESC
 * @param {Event} evt
 * */
window.addEventListener('keydown', function(evt) {
  if(evt.keyCode === Const.Keycodes.ESC) {
    evt.preventDefault();
    formContainer.classList.add('invisible');
    Utils.returnBodyScroll();
  }
});

/**
 * Как только документ загружен — получить данные из cookies и добавить в форму
 * */
window.addEventListener('load', function() {
  getPreviousReview();
  checkFormValidity();
});
