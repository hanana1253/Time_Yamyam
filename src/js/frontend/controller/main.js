import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { setMyGroups, setAllGroups, setAnonymous, getAllGroups, filterState} from '../store/main.js';
import { firebaseConfig } from '../utils/firebaseConfig.js';
import { render } from '../view/main.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth();

const swiper = new Swiper('.swiper', {
  // Optional parameters
  direction: 'horizontal',
  spaceBetween: 100,
  loop: true,
  a11y: {
    prevSlideMessage: 'Previous slide',
    nextSlideMessage: 'Next slide',
  },
});

const $swiper = document.querySelector('.swiper').swiper;
const $allGroupsList = document.querySelector('.all-groups__list');

document.querySelector('.group-tablist').onclick = e => {
  if (!e.target.matches('button')) return;

  [...document.querySelector('.group-tablist').children].forEach((child, i) => {
    if (child === e.target) {
      $swiper.enable();
      $swiper.slideTo(i + 1, 250);
      $swiper.disable();
    }
  });
  [...document.querySelectorAll('.group-tab')].forEach($el => {
    $el.classList.toggle('active', $el === e.target);
  });
};

document.addEventListener('DOMContentLoaded', () => {
  $swiper.disable();
  onAuthStateChanged(auth, async () => {
    if (auth.currentUser) {
      const { uid: userUid } = auth.currentUser;
      const { readyStudyGroups, myGroups, userData } = await axios.get(`/${userUid}`).then(({ data }) => data);
      setAllGroups(readyStudyGroups, userData);
      setMyGroups(myGroups);
    } else {
      const { readyStudyGroups } = await axios.get('/allGroups').then(({ data }) => data);
      setAllGroups(readyStudyGroups);
      setAnonymous();
    }
  });
});

$allGroupsList.onclick = e => {
  if (!e.target.matches('li > .join')) return;
  const studyIndex = e.target.closest('li').dataset.index;
  const study = getAllGroups()[+studyIndex];
  document.querySelector('.overlay').classList.add('active');
  render.modal(study);
};

document.querySelector('.filters').onclick = e => {
  if (!(e.target.matches('ul') || e.target.matches('li'))) return;

  const className = e.target.classList.value;
  const checkbox = document.querySelector(`.${className}__checkbox`);

  checkbox.classList.toggle('hidden', !checkbox.classList.contains('hidden'));
};

document.querySelector('.filters').onchange = e => {
  if (!e.target.matches('.filters label > input')) return;

  const [type, number] = e.target.parentNode.lastElementChild.value.split('-');
  let filterType = stateFunc.filterState[type];
  let { isFirst } = stateFunc.filterState;

  if (stateFunc.filterState.isFirst[type]) {
    filterType = filterType.map(_ => 0);
    isFirst[type] = false;
  }

  e.target.parentNode.classList.toggle('checked', e.target.checked);
  filterType[number] = e.target.checked ? 1 : 0;

  const isAllUnChecked =
    [...e.target.closest('li').children].filter($label => $label.classList.contains('checked')).length === 0;

  if (isAllUnChecked) {
    filterType = filterType.map(_ => 1);
    isFirst = { weeks: true, days: true, member: true };
    document.querySelector(`.filters-${type}`).setAttribute('color', 'black');
  }

  stateFunc.filterState[type] = filterType;
  stateFunc.filterState.isFirst = isFirst;

  e.target.closest('li').classList.toggle('hidden', isAllUnChecked);
  render[stateFunc.currentFeed]();
};
