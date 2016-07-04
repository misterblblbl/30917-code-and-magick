'use strict';

var Gallery = require('./gallery-constructor');

/** @type {Array} */
var images = document.querySelectorAll('.photogallery-image img');

/** @type {HTMLElement} */
var galleryContainer = document.querySelector('.photogallery');

var gallery = new Gallery(images);

galleryContainer.addEventListener('click', function(evt) {
  gallery.showGallery();
  for(var i = 0; i < images.length; i++) {
    if(evt.target === images[i]) {
      gallery.renderGallery(i);
    }
  }
});



