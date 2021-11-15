import { initializeApp } from 'firebase/app';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { firebaseConfig } from '../utils/firebaseConfig.js';
// import { render } from '../view/group.js';
import { stateFunc, fetchGroups, initialFilter, setFilterState } from '../store/group.js';

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
const filters = stateFunc.filterState.sortOfFilters;

// control function
const forcedUncheckFilters = () => {
  filters.forEach(filter => document.querySelector(`.filters li.filters-${filter}__checkbox`).classList.add('hidden'));
};

// Event handler
window.addEventListener('DOMContentLoaded', () => {
  $swiper.disable();

  fetchGroups();
  initialFilter();
});

document.querySelector('.group-tabList').onclick = e => {
  if (!e.target.matches('button')) return;

  [...document.querySelector('.group-tabList').children].forEach((child, i) => {
    if (child === e.target) {
      $swiper.enable();
      $swiper.slideTo(i + 1, 250);
      $swiper.disable();

      document.querySelector('.filters').classList.toggle('hidden', i === 2);
      stateFunc.currentFeed = stateFunc.feedLists[i];
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

  const value = e.target.parentNode.lastElementChild.value.split('-');

  e.target.parentNode.classList.toggle('checked', e.target.checked);

  const temp = stateFunc.postings.filter(
    posting =>
      new Date(posting.createDate._seconds * 1000).getDate() >= stateFunc.group.date.getDate() + value[1] * 7 &&
      new Date(posting.createDate._seconds * 1000).getDate() <= stateFunc.group.date.getDate() + (+value[1] + 1) * 7
  );

  console.log(
    new Date(stateFunc.postings[0].createDate._seconds * 1000).getDate(),
    stateFunc.group.date.getDate() + value[1] * 7
  );
  console.log(temp);
  console.log(stateFunc.postings);
  console.log(stateFunc.group);

  // if (e.target.checked)
  // setFilterState(value[0], stateFunc.postings.filter(posting => posting.createDate === stateFunc.group.crea));

  const isAllUnChecked =
    [...e.target.closest('li').children].filter($label => $label.classList.contains('checked')).length === 0;

  e.target.closest('li').classList.toggle('hidden', isAllUnChecked);
};

document.querySelector('.group').onclick = e => {
  if (filters.filter(filter => e.target.classList.contains(`filters-${filter}`)).length) return;
  if (filters.filter(filter => e.target.classList.contains(`filters-${filter}__checkbox`)).length) {
    return;
  }

  forcedUncheckFilters();
};
