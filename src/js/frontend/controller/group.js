import { initializeApp } from 'firebase/app';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { firebaseConfig } from '../utils/firebaseConfig.js';
import state from '../store/group.js';
// import { render } from '../view/group.js';

initializeApp(firebaseConfig);

const auth = getAuth();
const swiper = new Swiper('.swiper', {
  // Optional parameters
  direction: 'horizontal',
  loop: true,
  a11y: {
    prevSlideMessage: 'Previous slide',
    nextSlideMessage: 'Next slide',
  },
});
const $swiper = document.querySelector('.swiper').swiper;
const filters = state.filterState.sortOfFilters;

// control function
const forcedUncheckFilters = () => {
  filters.forEach(filter => document.querySelector(`.filters li.filters-${filter}__checkbox`).classList.add('hidden'));
};

// Event handler
window.addEventListener('DOMContentLoaded', () => {
  $swiper.disable();
});

document.querySelector('.group-tabList').onclick = e => {
  if (!e.target.matches('button')) return;

  [...document.querySelector('.group-tabList').children].forEach((child, i) => {
    if (child === e.target) {
      $swiper.enable();
      $swiper.slideTo(i + 1, 250);
      $swiper.disable();

      document.querySelector('.filters').classList.toggle('hidden', i === 2);
      state.currentFeed = state.feedLists[i];
      // render[state.currentFeed]();
      forcedUncheckFilters();
    }
  });

  [...document.querySelectorAll('.group-tab')].forEach($el => {
    $el.classList.toggle('active', $el === e.target);
  });
};

// 인증 하트버튼
document.querySelector('.swiper-wrapper').onclick = e => {
  if (!e.target.matches('i')) return;

  const isBx = e.target.classList.contains('bx-heart');
  e.target.classList.toggle('bx-heart', !isBx);
  e.target.classList.toggle('bxs-heart', isBx);
};

document.querySelector('.filters').onclick = e => {
  if (!(e.target.matches('ul') || e.target.matches('li'))) return;

  const className = e.target.classList.value;
  const checkbox = document.querySelector(`.${className}__checkbox`);

  checkbox.classList.toggle('hidden', !checkbox.classList.contains('hidden'));
};

document.querySelector('.filters').onchange = e => {
  if (!e.target.matches('.filters label > input')) return;

  e.target.parentNode.classList.toggle('checked', e.target.checked);

  const isAllUnChecked =
    [...e.target.closest('li').children].filter($label => $label.classList.contains('checked')).length === 0;

  e.target.closest('li').classList.toggle('hidden', isAllUnChecked);
};

document.querySelector('.group').onclick = e => {
  const { sortOfFilters } = state.filterState;

  if (sortOfFilters.filter(filter => e.target.classList.contains(`filters-${filter}`)).length) return;
  if (sortOfFilters.filter(filter => e.target.classList.contains(`filters-${filter}__checkbox`)).length) {
    return;
  }

  forcedUncheckFilters();
};
