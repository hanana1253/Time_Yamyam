import axios from 'axios';

let userInfo = {
  nickname: null,
  point: null,
  myStudy: [
    {
      title: null,
      description: null,
      postingDays: null,
      status: null,
    },
  ],
};

const setUserInfo = newUserInfo => {
  userInfo = newUserInfo;
};

const getUserData = () => ({ ...userInfo });

const fetchUserData = user => {
  const { uid: userId } = user;

  return axios.get(`/mypage/${userId}`);
};

export default { setUserInfo, fetchUserData, getUserData };
