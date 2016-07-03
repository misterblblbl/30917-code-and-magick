'use strict';

var galleryContainer = document.querySelector('.photogallery');
var galleryOverlay = document.querySelector('.overlay-gallery');
var images = document.querySelectorAll('.photogallery-image img');
var imageContainer = document.querySelector('.overlay-gallery-preview');
var image = new Image();

var numberCurrent = document.querySelector('.preview-number-current');
var numberTotal = document.querySelector('.preview-number-total');

var closeOverlay = document.querySelector('.overlay-gallery-close');
var arrowLeft = document.querySelector('.overlay-gallery-control-left');
var arrowRight = document.querySelector('.overlay-gallery-control-right');

var Keycodes = {
  ESC: 27,
  LEFT: 37,
  RIGHT: 39
};

var currentIndex;

var showGallery = function() {
  if(galleryOverlay.classList.contains('invisible')) {
    galleryOverlay.classList.remove('invisible');
  }

  document.addEventListener('keydown', _onDocumentKeyDown);
  closeOverlay.addEventListener('click', _onCloseClick);
  arrowLeft.addEventListener('click', _onArrowLeft);
  arrowRight.addEventListener('click', _onArrowRight);
};

var hideGallery = function() {
  galleryOverlay.classList.add('invisible');

  document.removeEventListener('keydown', _onDocumentKeyDown);
  closeOverlay.removeEventListener('click', _onCloseClick);
  arrowLeft.removeEventListener('click', _onArrowLeft);
  arrowRight.removeEventListener('click', _onArrowRight);
};

var _onDocumentKeyDown = function(evt) {
  if(evt.keyCode === Keycodes.ESC) {
    hideGallery();
  } else if(evt.keyCode === Keycodes.LEFT) {
    renderGallery(--currentIndex);
  } else if(evt.keyCode === Keycodes.RIGHT) {
    renderGallery(++currentIndex);
  }
};

var _onCloseClick = function() {
  hideGallery();
};

var _onArrowLeft = function() {
  renderGallery(--currentIndex);
};

var _onArrowRight = function() {
  renderGallery(++currentIndex);
};

var renderGallery = function(index) {
  currentIndex = index;

  if(currentIndex > images.length - 1) {
    currentIndex = 0;
  } else if (currentIndex < 0) {
    currentIndex = images.length - 1;
  }

  image.src = images[currentIndex].src;
  imageContainer.appendChild(image);
  numberCurrent.innerHTML = currentIndex + 1;
};
numberTotal.innerHTML = images.length;

galleryContainer.addEventListener('click', function(evt) {
  showGallery();
  for(var i = 0; i < images.length; i++) {
    if(evt.target === images[i]) {
      renderGallery(i);
    }
  }
});

module.exports = renderGallery;
