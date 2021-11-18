import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseConfig } from '../utils/firebaseConfig';

import store from '../store/notice';
import view from '../view/notice';

initializeApp(firebaseConfig);

const auth = getAuth();

window.addEventListener('DOMContentLoaded', () => {
  onAuthStateChanged(auth, async user => {
    if (user) {
      try {
        const { data } = await store.fetchNotiList(user);
        store.setNotiList(data);
        view.render(store.getNotiList());
      } catch (error) {
        console.log(error);
      }
    } else {
      alert('로그인정보가없습니다. 확인을 누르면 로그인페이지로 이동합니다');
      window.location.href = '/login';
      console.log('사용자정보없음');
    }
  });
});
