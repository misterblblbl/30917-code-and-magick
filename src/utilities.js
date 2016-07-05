'use strict';

var Utils = {
  clearHash: function() {
    window.location.hash = '';
  },

  checkHash: function(regExp) {
    var matchedHash = location.hash.match(regExp);
    if (Array.isArray(matchedHash)) {
      return matchedHash[1];
    } else {
      return false;
    }
  }
};

module.exports = Utils;
