'use strict';

(function () {

  window.addEventListener('DOMContentLoaded', function () {
    const mainForm = document.querySelector('.main-form');

    function req(evt) {
      evt.preventDefault();
      let formData = new FormData(mainForm);
      const request = new XMLHttpRequest();
      let xhrUrl = './form.php';

      request.open('POST', xhrUrl);
      request.send(formData);
      request.addEventListener('load', function () {
        createPopUp(request.status, window.utils.popupOverlay);
        mainForm.reset();
      });
    };

    mainForm.addEventListener('submit', (function (evt) { req(evt) }), { 'once': true });

    function createPopUp(requestStatus, overlay) {
      let popup = document.createElement('div');
      popup.classList.add('popup');

      if (requestStatus === 200) {
        popup.innerHTML = '<p class="popup-text">Форма успешно отправлена</p><a href="index.html">Ок</a>';
      } else {
        popup.innerHTML = '<p class="popup-text">Что-то пошло не так</p><a href="index.html">Попробовать снова</a>';
      }

      overlay.classList.remove('popup-overlay--hidden');
      overlay.appendChild(popup);
    };

  });

})();
