import axios from 'axios';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
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
  onAuthStateChanged(auth, async () => {
    if (auth) {
      const { userUid } = auth.currentUser;
      const data = await axios.get(`${userUid}`).then(({ data }) => data);
      console.log(data);
    } else {
      console.log('로그인해주세요');
    }
  });
});
