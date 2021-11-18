import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseConfig } from '../utils/firebaseConfig';

import store from '../store/point';
import view from '../view/point';

initializeApp(firebaseConfig);

const auth = getAuth();

window.addEventListener('DOMContentLoaded', () => {
  onAuthStateChanged(auth, async user => {
    if (user) {
      try {
        const { data } = await store.fetchPointList(user);
        store.setPointList(data);
        view.render(store.getPointList());
      } catch (error) {
        console.log(error);
      }
    } else {
      window.location.href = '/';
      console.log('사용자정보없음');
    }
  });
});
