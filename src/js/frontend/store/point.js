import axios from 'axios';

let pointList = {};

const setPointList = newPointList => {
  pointList = newPointList;
};

const getPointList = () => ({ ...pointList });

const fetchPointList = user => {
  const { uid: userId } = user;

  return axios.get(`/mypoints/${userId}`);
};

export default { setPointList, fetchPointList, getPointList };
