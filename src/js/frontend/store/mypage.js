import axios from 'axios';

import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { firebaseConfig } from '../utils/firebaseConfig';

initializeApp(firebaseConfig);

const auth = getAuth();

let userInfo = { nickname: null, point: null };
let userStudyGroups = [
  {
    title: null,
    description: null,
    postingDays: null,
    status: null,
  },
];

const setUserInfo = ({ nickname, point }) => {
  userInfo = { nickname, point };
  console.log(userInfo);
};

const setUserStudyGroups = studyGroups => {
  userStudyGroups = studyGroups.map(({ title, description, postingDays, status }) => ({
    title,
    description,
    postingDays,
    status,
  }));
  console.log(userStudyGroups);
};

const fetchUserData = () => {
  //   signOut(auth);
  onAuthStateChanged(auth, async user => {
    if (user) {
      const { uid: userId } = user;

      try {
        const { data } = await axios.get(`/mypage/${userId}`);
        console.log(data);
        setUserInfo(data.targetUserData);
        setUserStudyGroups(data.targetUserStudyGroups);
      } catch (error) {
        console.log(error);
      }
    } else {
      window.location.href = '/';
      console.log('사용자정보없음');
    }
  });
};

export default { fetchUserData };
