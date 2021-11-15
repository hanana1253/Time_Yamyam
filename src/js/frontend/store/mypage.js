import axios from 'axios';

import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { firebaseConfig } from '../utils/firebaseConfig';

initializeApp(firebaseConfig);

const auth = getAuth();

const userInfo = { nickname: null, point: null };

const setUserInfo = newUser => {
  userInfo.nickname = newUser.nickname;
  userInfo.point = newUser.point;
  console.log(userInfo);
};

const fetchUserInfo = () => {
//   signOut(auth);
  onAuthStateChanged(auth, async user => {
    if (user) {
      const { uid: userId } = user;

      try {
        const { data } = await axios.get(`/mypage/${userId}`);
        console.log(data);
        setUserInfo(data);
      } catch (error) {
        console.log(error);
      }
    } else {
      window.location.href = '/';
      console.log('사용자정보없음');
    }
  });
};

export default { fetchUserInfo };
