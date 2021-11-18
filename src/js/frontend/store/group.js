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

let filterState = {
  sortOfFilters: ['weeks', 'days', 'member'],
  isFirst: {
    weeks: true,
    days: true,
    member: true,
  },
  weeks: [],
  days: [],
  member: [],
};

const feedState = {
  feedLists: ['teamFeed', 'myFeed', 'info'],
  currentFeed: 'teamFeed',
};

const fetchGroupData = () => axios.get('/study/HTML').then(({ data }) => data);

const fetchUserInfo = user => {
  const { uid: userId } = user;

  return axios.get(`/mypage/${userId}`).then(({ data }) => data);
};

const sendLikesInfo = (userUid, postingId) => {
  axios.patch(`/study/${group.id}/posting/`, { userUid, postingId });
};

const sendDeletePosting = postingId => {
  axios.delete(`/study/${group.id}/posting/${postingId}`);
};

const initialFilter = () => {
  const weekNum = group.duration;
  const memberNum = group.userList.length;

  filterState.weeks = Array(weekNum).fill(1);
  filterState.days = Array(7).fill(1);
  filterState.member = Array(memberNum).fill(1);
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
  set filterState(newFilterState) {
    filterState = newFilterState;
  },
  get userInfo() {
    return userInfo;
  },
  set userInfo(newUserInfo) {
    userInfo = newUserInfo;
  },
};

export { stateFunc, fetchGroupData, fetchUserInfo, initialFilter, sendLikesInfo, sendDeletePosting };
