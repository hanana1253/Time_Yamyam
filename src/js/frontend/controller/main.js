import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { setMyGroups, setAllGroups, setAnonymous } from '../store/main.js';
import { firebaseConfig } from '../utils/firebaseConfig.js';

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

