'use strict';

(function () {

  const body = document.querySelector('body');
  const popupOverlay = document.createElement('div');

  popupOverlay.classList.add('popup-overlay');
  popupOverlay.classList.add('popup-overlay--hidden');
  body.appendChild(popupOverlay);

  window.utils = {
    body: body,
    popupOverlay: popupOverlay
  }

})();
