'use strict';

var Gallery = require('./gallery-constructor');
var Const = require('../constants');
var Utils = require('../utilities');

/** @type {Array} */
var photogalleryImages = document.querySelectorAll('.photogallery-image img');

var images = Array.prototype.map.call(photogalleryImages, function(item) {
  return item.getAttribute('src');
});

/** @type {HTMLElement} */
var galleryContainer = document.querySelector('.photogallery');

var gallery = new Gallery(images);

var renderGalleryOnLoad = function() {
  var src = Utils.checkHash(Const.GALLERY_REG_EXP);
  if(typeof src === 'string') {
    gallery.renderGallery(src);
    gallery.showGallery();
  }
};

var renderGalleryOnClick = function(evt) {
  evt.preventDefault();
  var index = images.indexOf(evt.target.getAttribute('src'));
  gallery.showGallery();
  gallery.changeLocation(images[index]);
};

galleryContainer.addEventListener('click', renderGalleryOnClick);

window.addEventListener('load', renderGalleryOnLoad);



