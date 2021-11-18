import { removeActive, toggleActive } from '../utils/helper';

const $nav = document.querySelector('.nav');
const $navButton = document.querySelector('.nav__button');
const $navCloseButton = document.querySelector('.nav__item--close');
const $overlay = document.querySelector('.overlay');

$navButton.onclick = () => {
  toggleActive([$nav, document.body, $overlay]);
};

$navCloseButton.onclick = () => {
  removeActive([$nav, document.body, $overlay]);
};

$overlay.onclick = () => {
  removeActive([$nav, document.body, $overlay]);
};
