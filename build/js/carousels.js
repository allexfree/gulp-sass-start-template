'use strict';

(function () {

  let headerCarousel = document.querySelector('.js-header-carousel'); // variable for using in mouseover/mouseout handler

  let headerSlider = new Swiper('.js-header-carousel', {
    slidesPerView: 'auto',
    freeMode: false,
    autoplay: {
      delay: 5000,
    },
    pagination: {
      el: '.js-header-carousel-pagination',
      type: 'bullets',
      bulletClass: 'page-header__carousel-bullet',
      bulletActiveClass: 'page-header__carousel-bullet--active'
    },
  });

  let headerCarouselMouseoverHandler = function() {
    headerSlider.autoplay.stop();
  };

  let headerCarouselMouseoutHandler = function() {
    headerSlider.autoplay.start();
  };

  headerCarousel.addEventListener('mouseover', headerCarouselMouseoverHandler);

  headerCarousel.addEventListener('mouseout', headerCarouselMouseoutHandler);

})();
