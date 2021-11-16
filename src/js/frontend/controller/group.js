import { initializeApp } from 'firebase/app';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { firebaseConfig } from '../utils/firebaseConfig.js';
import render from '../view/group.js';
import { stateFunc, fetchGroupData, fetchUserInfo, initialFilter, setFilterState } from '../store/group.js';

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
  onAuthStateChanged(auth, async user => {
    if (user) {
      try {
        $swiper.disable();

        const userInfo = await fetchUserInfo(user);
        stateFunc.userInfo = userInfo;

        const group = await fetchGroupData();
        stateFunc.group = group;
        stateFunc.users = group.userList;
        stateFunc.postings = group.postingList.map(posting => {
          posting.week = Math.ceil((new Date(posting.createDate).getDate() - group.date.getDate()) / 7);
          posting.day = new Date(posting.createDate).getDay();
          return posting;
        });

        initialFilter();

        render[stateFunc.currentFeed]();
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
      posting.likedBy.push(auth.currentUser.uid);
    }
    return posting;
  });
  stateFunc.postings = postings;

  console.log(stateFunc.postings);

  // console.log(postings);
  // console.log($posting.dataset.member);
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

  if (e.target.checked) {
    const [type, number] = e.target.parentNode.lastElementChild.value.split('-');

    setFilterState(
      type,
      stateFunc.postings.filter(posting => posting[type] === +number)
    );

    render[stateFunc.currentFeed]();
  }

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
