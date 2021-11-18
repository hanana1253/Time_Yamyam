const $nav = document.querySelector('.nav');
const $navButton = document.querySelector('.nav__button');
const $navCloseButton = document.querySelector('.nav__item--close');
const $overlay = document.querySelector('.overlay');

$navButton.onclick = () => {
  $nav.classList.toggle('active');
  document.body.classList.toggle('active');
  $overlay.classList.toggle('active');
};

$navCloseButton.onclick = () => {
  $nav.classList.remove('active');
  document.body.classList.remove('active');
  $overlay.classList.remove('active');
};

$overlay.onclick = () => {
  $nav.classList.remove('active');
  document.body.classList.remove('active');
  $overlay.classList.remove('active');
};
