const swiper = new Swiper('.swiper', {
  // Optional parameters
  direction: 'horizontal',
  loop: true,
  a11y: {
    prevSlideMessage: 'Previous slide',
    nextSlideMessage: 'Next slide',
  },
  //   effect: 'fade',
  //   fadeEffect: {
  //     crossFade: true,
  //   },
});

const $swiper = document.querySelector('.swiper').swiper;

// 네비게이션
document.querySelector('.group-tabList').onclick = e => {
  if (!e.target.matches('button')) return;

  [...document.querySelector('.group-tabList').children].forEach((child, i) => {
    if (child === e.target) {
      $swiper.enable();
      $swiper.slideTo(i + 1, 250);
      $swiper.disable();
    }
    // $swiper.slideTo(3, 100);
  });

  [...document.querySelectorAll('.group-tab')].forEach($el => {
    $el.classList.toggle('active', $el === e.target);
  });
};

// 인증 하트버튼
document.querySelector('.bx').onclick = e => {
  console.log(e.target);

  const isBx = e.target.classList.contains('bx-heart');

  e.target.classList.toggle('bx-heart', !isBx);
  e.target.classList.toggle('bxs-heart', isBx);
};
