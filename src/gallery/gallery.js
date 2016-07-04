'use strict';

var Gallery = require('./gallery-constructor');

/** @type {Array} */
var photogalleryImages = document.querySelectorAll('.photogallery-image img');

var images = Array.prototype.map.call(photogalleryImages, function(item) {
  return item.getAttribute('src');
});

/** @type {HTMLElement} */
var galleryContainer = document.querySelector('.photogallery');

var gallery = new Gallery(images);

galleryContainer.addEventListener('click', function(evt) {
  var index = images.indexOf(evt.target.getAttribute('src'));
  console.log(index);
  if (index !== -1) {
    gallery.showGallery();
    gallery.renderGallery(index);
  }
});



