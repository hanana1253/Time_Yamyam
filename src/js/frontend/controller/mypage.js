import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { firebaseConfig } from '../utils/firebaseConfig';

import store from '../store/mypage';
import view from '../view/mypage';

initializeApp(firebaseConfig);

const auth = getAuth();

window.addEventListener('DOMContentLoaded', () => {
  onAuthStateChanged(auth, async user => {
    if (user) {
      try {
        const { data } = await store.fetchUserData(user);
        store.setUserInfo(data);
        view.render(store.getUserData());
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
