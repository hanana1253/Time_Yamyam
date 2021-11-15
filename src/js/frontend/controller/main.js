// const swiper = new Swiper('.swiper', {
//   // Optional parameters
//   direction: 'horizontal',
//   loop: true,
//   a11y: {
//     prevSlideMessage: 'Previous slide',
//     nextSlideMessage: 'Next slide',
//   },
//   //   effect: 'fade',
//   //   fadeEffect: {
//   //     crossFade: true,
//   //   },
// });

// const $swiper = document.querySelector('.swiper').swiper;

document.querySelector('.group-tablist').onclick = e => {
  if (!e.target.matches('button')) return;

  // [...document.querySelector('.group-tablist').children].forEach((child, i) => {
  //   if (child === e.target) {
  //     $swiper.enable();
  //     $swiper.slideTo(i + 1, 250);
  //     $swiper.disable();
  //   }
  //   // $swiper.slideTo(3, 100);
  // });
  [...document.querySelectorAll('.group-tab')].forEach($el => {
    $el.classList.toggle('active', $el === e.target);
  });
};
