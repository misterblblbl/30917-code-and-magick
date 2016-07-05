'use strict';

/**
 * @param {Object} images - Массив с изображениями, которые будут открыты в галерее
 * @constructor
 */

var Const = require('../constants');
var Utils = require('../utilities');

var Gallery = function(images) {
  var self = this;

  this.galleryOverlay = document.querySelector('.overlay-gallery');
  this.imageContainer = document.querySelector('.overlay-gallery-preview');

  this.numberCurrent = document.querySelector('.preview-number-current');
  this.numberTotal = document.querySelector('.preview-number-total');

  this.closeOverlay = document.querySelector('.overlay-gallery-close');
  this.arrowLeft = document.querySelector('.overlay-gallery-control-left');
  this.arrowRight = document.querySelector('.overlay-gallery-control-right');

  this.image = new Image();

  this.numberTotal.innerHTML = images.length;

  this.changeLocation = function(src) {
    window.location.hash = 'photo/' + src;
  };

  this.renderGallery = function(indexOrSrc) {
    if(typeof indexOrSrc === 'string') {
      this.currentIndex = images.indexOf(indexOrSrc);
    } else if(typeof indexOrSrc === 'number') {
      this.currentIndex = indexOrSrc;
    }

    if(this.currentIndex > images.length - 1) {
      this.currentIndex = 0;
    } else if (this.currentIndex < 0) {
      this.currentIndex = images.length - 1;
    }

    this.image.src = images[this.currentIndex];
    this.imageContainer.appendChild(this.image);
    this.numberCurrent.innerHTML = this.currentIndex + 1;
  };

  this.showGallery = function() {
    if(self.galleryOverlay.classList.contains('invisible')) {
      self.galleryOverlay.classList.remove('invisible');
      Utils.removeBodyScroll();
    }
    document.addEventListener('keydown', self._onDocumentKeyDown);
    self.closeOverlay.addEventListener('click', self._onCloseClick);
    self.arrowLeft.addEventListener('click', self._onArrowLeft);
    self.arrowRight.addEventListener('click', self._onArrowRight);
  };

  this.hideGallery = function() {
    Utils.clearHash();
    self.galleryOverlay.classList.add('invisible');
    Utils.returnBodyScroll();

    document.removeEventListener('keydown', self._onDocumentKeyDown);
    self.closeOverlay.removeEventListener('click', self._onCloseClick);
    self.arrowLeft.removeEventListener('click', self._onArrowLeft);
    self.arrowRight.removeEventListener('click', self._onArrowRight);
  };

  this._onHashChange = function() {
    var matchedHash = Utils.checkHash(Const.GALLERY_REG_EXP);
    if (matchedHash) {
      self.changeLocation(matchedHash);
      self.renderGallery(matchedHash);
    } else {
      self.hideGallery();
      Utils.clearHash();
    }
  };

  this._onDocumentKeyDown = function(evt) {
    if(evt.keyCode === Const.Keycodes.ESC) {
      self.hideGallery();
    } else if(evt.keyCode === Const.Keycodes.LEFT) {
      self.renderGallery(--self.currentIndex);
    } else if(evt.keyCode === Const.Keycodes.RIGHT) {
      self.renderGallery(++self.currentIndex);
    }
  };

  this._onCloseClick = function() {
    self.hideGallery();
  };

  this._onArrowLeft = function() {
    self.changeLocation(images[--self.currentIndex]);
  };

  this._onArrowRight = function() {
    self.changeLocation(images[++self.currentIndex]);
  };

  window.addEventListener('hashchange', self._onHashChange);
};

module.exports = Gallery;
