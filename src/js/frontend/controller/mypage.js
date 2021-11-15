import axios from 'axios';

import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseConfig } from '../utils/firebaseConfig';

initializeApp(firebaseConfig);

const auth = getAuth();

window.addEventListener('DOMContentLoaded', () => {
  onAuthStateChanged(auth, async user => {
    if (user) {
      const { uid: userId } = user;

      try {
        const { data } = await axios.get(`/mypage/${userId}`);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    } else {
      window.location.href = '/';
      console.log('사용자정보없음');
    }
  });
});
