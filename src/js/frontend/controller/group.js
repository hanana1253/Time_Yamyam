import { initializeApp } from 'firebase/app';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { firebaseConfig } from '../utils/firebaseConfig.js';
import render from '../view/group.js';
import {
  stateFunc,
  fetchGroupData,
  fetchUserInfo,
  initialFilter,
  sendLikesInfo,
  sendDeletePosting,
} from '../store/group.js';

initializeApp(firebaseConfig);

const WEEKDAYS = 7 * 86400000;
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
  onAuthStateChanged(auth, async user => {
    if (user) {
      try {
        $swiper.disable();

        // auth info update
        const userInfo = await fetchUserInfo(user);
        stateFunc.userInfo = { ...userInfo, uid: auth.currentUser.uid };

        // group, posting, users list update
        const group = await fetchGroupData();
        stateFunc.group = group;
        stateFunc.users = group.userList;
        stateFunc.postings = group.postingList.map(posting => {
          posting.week =
            Math.ceil(
              (new Date(posting.createDate).getMilliseconds() - new Date(group.createDate).getMilliseconds()) / WEEKDAYS
            ) - 1;
          posting.day = new Date(posting.createDate).getDay();
          return posting;
        });

        // filter initialize
        initialFilter();

        render[stateFunc.currentFeed]();
        render.filter();

        document.querySelector('.group-title').textContent = group.title;
      } catch (error) {
        console.log(error);
      }
    } else {
      window.location.href = '/';
      alert('로그인 이후 사용 가능합니다');
    }
  });
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
      render[stateFunc.currentFeed]();

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

  const $likes = e.target.closest('div').firstElementChild;
  const content = $likes.textContent;
  $likes.textContent = isBx ? +content + 1 : +content - 1;

  let { postings } = stateFunc;
  const $posting = e.target.closest('li');

  postings = postings.map(posting => {
    if (posting.id === $posting.dataset.post) {
      posting.likes = isBx ? posting.likes + 1 : posting.likes - 1;
      isBx
        ? posting.likedBy.push(auth.currentUser.uid)
        : posting.likedBy.splice(posting.likedBy.indexOf(auth.currentUser.uid), 1);

      sendLikesInfo(auth.currentUser.uid, posting.id);
    }
    return posting;
  });

  stateFunc.postings = postings;
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
    isFirst = { week: true, day: true, member: true };
  }

  stateFunc.filterState[type] = filterType;
  stateFunc.filterState.isFirst = isFirst;

  e.target.closest('li').classList.toggle('hidden', isAllUnChecked);
  render[stateFunc.currentFeed]();
};

document.querySelector('.group').onclick = e => {
  if (filters.filter(filter => e.target.classList.contains(`filters-${filter}`)).length) return;
  if (filters.filter(filter => e.target.classList.contains(`filters-${filter}__checkbox`)).length) {
    return;
  }

  forcedUncheckFilters();
};

document.querySelector('.group-myFeed__list').onclick = e => {
  if (!e.target.classList.contains('delete')) return;

  const $item = e.target.closest('li');

  // 삭제 요청
  const { postings } = stateFunc;
  stateFunc.postings = postings.filter(posting => posting.id !== $item.dataset.post);

  sendDeletePosting($item.dataset.post);

  render[stateFunc.currentFeed]();
};
