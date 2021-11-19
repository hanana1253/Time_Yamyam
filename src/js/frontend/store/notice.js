import axios from 'axios';

let notiList = {};

const setNotiList = newNotiList => {
  notiList = newNotiList;
};

const getNotiList = () => ({ ...notiList });

const fetchNotiList = user => {
  const { uid: userId } = user;

  return axios.get(`/mynotice/${userId}`);
};

export default { setNotiList, fetchNotiList, getNotiList };
