'use strict';

var Gallery = require('./gallery-constructor');
var Const = require('../constants');
var Utils = require('../utilities');

/** @type {Array<HTMLElement>} */
var photogalleryImages = document.querySelectorAll('.photogallery-image img');

/** Массив из src всех изображений в галерее
 * @type {Array<String>} */
var images = Array.prototype.map.call(photogalleryImages, function(item) {
  return item.getAttribute('src');
});

/** @type {HTMLElement} */
var galleryContainer = document.querySelector('.photogallery');

/** @type {Gallery} */
var gallery = new Gallery(images);

/**
 * При загрузке страницы проверяет хэщ, и если он соответствует регулярному выражению
 * рендерит картинку по хэшу
 */
var renderGalleryOnLoad = function() {
  var src = Utils.checkHash(Const.GALLERY_REG_EXP);
  if(typeof src === 'string') {
    gallery.renderGallery(src);
    gallery.showGallery();
  }
};

/**
 * @param {Event} evt
 * Открывает галерею при клике на картинку
 * изменяет хэш
 */
var renderGalleryOnClick = function(evt) {
  evt.preventDefault();
  var index = images.indexOf(evt.target.getAttribute('src'));
  gallery.showGallery();
  gallery.changeLocation(images[index]);
};

galleryContainer.addEventListener('click', renderGalleryOnClick);

window.addEventListener('load', renderGalleryOnLoad);



