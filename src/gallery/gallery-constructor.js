'use strict';

var Const = require('../constants');
var Utils = require('../utilities');

/**
 * @param {Array<String>} images - Массив адресами изображений, которые будут открыты в галерее
 * @constructor
 */
var Gallery = function(images) {

  this.images = images;

  /** @type {HTMLElement} */
  this.galleryOverlay = document.querySelector('.overlay-gallery');

  /** @type {HTMLElement} */
  this.imageContainer = document.querySelector('.overlay-gallery-preview');

  /** 
   * Номер текущего изображения в галерее
   * @type {HTMLElement} */
  this.numberCurrent = document.querySelector('.preview-number-current');

  /** 
   * Всего изображений в галерее
   * @type {HTMLElement} */
  this.numberTotal = document.querySelector('.preview-number-total');

  /** 
   * Кнопка закрытия галереи
   * @type {HTMLElement} */
  this.closeOverlay = document.querySelector('.overlay-gallery-close');

  /** @type {HTMLElement} */
  this.arrowLeft = document.querySelector('.overlay-gallery-control-left');

  /** @type {HTMLElement} */
  this.arrowRight = document.querySelector('.overlay-gallery-control-right');

  /**
   * Индекс отображаемого изображения в переданном массиве адресов
   * @type {number} */
  this.currentIndex = 0;

  /** @type {Image} */
  this.image = new Image();

  /** @type {number} */
  this.numberTotal.innerHTML = this.images.length;

  this.changeLocation = this.changeLocation.bind(this);

  this.renderGallery = this.renderGallery.bind(this);

  this.showGallery = this.showGallery.bind(this);

  this.hideGallery = this.hideGallery.bind(this);

  this._onHashChange = this._onHashChange.bind(this);

  this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);

  this._onCloseClick = this._onCloseClick.bind(this);

  this._onArrowLeft = this._onArrowLeft.bind(this);

  this._onArrowRight = this._onArrowRight.bind(this);

  window.addEventListener('hashchange', this._onHashChange);
};

/**
 * Отрисовка галереи. Принимает как параметр индекс адреса изображения в массиве 
 * или строку с адресом изображения
 * @param {number|string} indexOrSrc
 */
Gallery.prototype.renderGallery = function(indexOrSrc) {
  if(typeof indexOrSrc === 'string') {
    this.currentIndex = this.images.indexOf(indexOrSrc);
  } else if(typeof indexOrSrc === 'number') {
    this.currentIndex = indexOrSrc;
  }

  if(this.currentIndex > this.images.length - 1) {
    this.currentIndex = 0;
  } else if (this.currentIndex < 0) {
    this.currentIndex = this.images.length - 1;
  }

  this.image.src = this.images[this.currentIndex];
  this.imageContainer.appendChild(this.image);
  this.numberCurrent.innerHTML = this.currentIndex + 1;
};

/**
 * Изменияет хэш страницы
 * @param {string} src
 */
Gallery.prototype.changeLocation = function(src) {
  window.location.hash = 'photo/' + src;
};

/**
 * Делает видимым контейнер с галереей
 * Добавляет обработчики на кнопки управления галереей
 */
Gallery.prototype.showGallery = function() {
  if(this.galleryOverlay.classList.contains('invisible')) {
    this.galleryOverlay.classList.remove('invisible');
    Utils.removeBodyScroll();
  }
  document.addEventListener('keydown', this._onDocumentKeyDown);
  this.closeOverlay.addEventListener('click', this._onCloseClick);
  this.arrowLeft.addEventListener('click', this._onArrowLeft);
  this.arrowRight.addEventListener('click', this._onArrowRight);
};

/**
 * Делает невидимым контейнер с галереей
 * Удаляет обработчики с кнопок управления галереей
 */
Gallery.prototype.hideGallery = function() {
  Utils.clearHash();
  this.galleryOverlay.classList.add('invisible');
  Utils.returnBodyScroll();

  document.removeEventListener('keydown', this._onDocumentKeyDown);
  this.closeOverlay.removeEventListener('click', this._onCloseClick);
  this.arrowLeft.removeEventListener('click', this._onArrowLeft);
  this.arrowRight.removeEventListener('click', this._onArrowRight);
};

/**
 * Перерисовывает галерею при изменении хэша страницы
 * @private
 */
Gallery.prototype._onHashChange = function() {
  var matchedHash = Utils.checkHash(Const.GALLERY_REG_EXP);
  if (matchedHash) {
    this.changeLocation(matchedHash);
    this.renderGallery(matchedHash);
  } else {
    this.hideGallery();
    Utils.clearHash();
  }
};

/**
 * Прячет галерею при клику на кнопку закрытия
 * @private
 */
Gallery.prototype._onCloseClick = function() {
  this.hideGallery();
};

/**
 * Прячет галерею при клику на кнопку закрытия
 * @private
 */
Gallery.prototype._onArrowLeft = function() {
  this.changeLocation(this.images[--this.currentIndex]);
};

/**
 * Показывает следующее изображение в галерее
 * @private
 */
Gallery.prototype._onArrowRight = function() {
  this.changeLocation(this.images[++this.currentIndex]);
};

/**
 * Показывает предыдущее изображение в галерее
 * @private
 */
Gallery.prototype._onDocumentKeyDown = function(evt) {
  if(evt.keyCode === Const.Keycodes.ESC) {
    this.hideGallery();
  } else if(evt.keyCode === Const.Keycodes.LEFT) {
    this.changeLocation(this.images[--this.currentIndex]);
  } else if(evt.keyCode === Const.Keycodes.RIGHT) {
    this.changeLocation(this.images[++this.currentIndex]);
  }
};

module.exports = Gallery;
