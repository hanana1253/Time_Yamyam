import axios from 'axios';

let group = {
  authDescription: '',
  date: '',
  description: '',
  duration: 0,
  hashtags: [],
  id: 0,
  minLevel: 0,
  postingDays: [],
  postingList: [],
  status: '',
  teamleader: {},
  title: '',
  userList: [],
};

let users = [];
let postings = [];

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

const feedState = {
  feedLists: ['teamFeed', 'myFeed', 'info'],
  currentFeed: 'teamFeed',
};

const filterState = {
  sortOfFilters: ['weeks', 'days', 'member'],
  week: [],
  day: [],
  member: [],
};

const fetchGroupData = () => axios.get('/study/HTML').then(({ data }) => data);

const fetchUserInfo = user => {
  const { uid: userId } = user;

  return axios.get(`/mypage/${userId}`).then(({ data }) => data);
};

const initialFilter = () => {
  filterState.week = postings;
  filterState.day = postings;
  filterState.member = postings;
};

const setFilterState = (stateName, newState) => {
  filterState[stateName] = newState;
};

const sendLikesInfo = (userUid, postingId) => {
  axios.patch(`/study/${group.id}/posting/`, { userUid, postingId });
};

const sendDeletePosting = postingId => {
  axios.delete(`/study/${group.id}/posting/${postingId}`);
};

const stateFunc = {
  get group() {
    return group;
  },
  set group(newGroup) {
    group = newGroup;
    group.date = new Date(group.date);
  },
  get users() {
    return users;
  },
  set users(newUsers) {
    users = newUsers;
  },
  get postings() {
    return postings;
  },
  set postings(newPostings) {
    postings = newPostings;
  },
  get feedLists() {
    return feedState.feedLists;
  },
  get currentFeed() {
    return feedState.currentFeed;
  },
  set currentFeed(newFeed) {
    feedState.currentFeed = newFeed;
  },
  get filterState() {
    return filterState;
  },
  set userInfo(newUserInfo) {
    userInfo = newUserInfo;
  },
  get userInfo() {
    return userInfo;
  },
};

export { stateFunc, fetchGroupData, fetchUserInfo, initialFilter, setFilterState, sendLikesInfo, sendDeletePosting };
