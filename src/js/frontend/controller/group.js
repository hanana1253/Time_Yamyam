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

import { removeActive } from '../utils/helper';

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
        const studyId = new URL(window.location.href).searchParams.get('studyId');
        const group = await fetchGroupData(studyId);
        const notiPost = group.postingList.filter(post => post.isNoti);
        const noneNotiPost = group.postingList.filter(post => !post.isNoti);

        stateFunc.group = group;
        stateFunc.users = group.userList;
        stateFunc.postings = [...notiPost, ...noneNotiPost].map(posting => {
          posting.weeks =
            Math.ceil(
              (new Date(posting.createDate).getMilliseconds() - new Date(group.createDate).getMilliseconds()) / WEEKDAYS
            ) - 1;
          posting.days = new Date(posting.createDate).getDay();
          return posting;
        });

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
const changeHeartNum = target => {
  const isBx = target.classList.contains('bx-heart');
  target.classList.toggle('bx-heart', !isBx);
  target.classList.toggle('bxs-heart', isBx);

  const $likes = target.closest('div').firstElementChild;
  const content = $likes.textContent;
  $likes.textContent = isBx ? +content + 1 : +content - 1;

  let { postings } = stateFunc;
  const $posting = target.closest('li');

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

const activeModal = target => {
  const postingId = target.closest('li').dataset.post;
  const postings = stateFunc.group.postingList;
  const posting = postings.filter(posting => posting.id === postingId)[0];

  document.querySelector('.overlay').classList.add('active');
  document.querySelector('.modal-container').classList.remove('hidden');
  document.querySelector('.modal-img > img').src = posting.img.url ? posting.img.url : '../../images/feedImage.jpeg';
  document.querySelector('.modal-title').textContent = posting.title;
  document.querySelector('.modal-description').textContent = posting.description;
};

const deactiveModal = () => {
  document.querySelector('.overlay').classList.remove('active');
  document.querySelector('.modal-container').classList.add('hidden');
};

document.querySelector('.swiper-wrapper').onclick = e => {
  if (!(e.target.matches('i') || e.target.classList.contains('modal'))) return;

  e.target.matches('i') ? changeHeartNum(e.target) : activeModal(e.target);
};

document.querySelector('.overlay').onclick = e => {
  deactiveModal();
  removeActive([document.querySelector('.nav'), document.body, document.querySelector('.overlay')]);
};

document.querySelector('.modal-close').onclick = () => {
  deactiveModal();
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
