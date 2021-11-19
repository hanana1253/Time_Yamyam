import { initializeApp } from 'firebase/app';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { firebaseConfig } from '../utils/firebaseConfig.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth();

document.querySelector('.signout').onclick = e => {
  onAuthStateChanged(auth, () => {
    e.preventDefault();
    signOut(auth);
  });
  window.alert('로그아웃되었습니다.');
  window.location.href = '/';
};
