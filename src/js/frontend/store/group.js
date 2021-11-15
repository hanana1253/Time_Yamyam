import axios from 'axios';

const MILISECONDS = 1000;

let group = {};
let users = [];
let postings = [];

const feedState = {
  feedLists: ['teamFeed', 'myFeed', 'info'],
  currentFeed: 'teamFeed',
};

const feedContents = {
  teamFeed: '',
  myFeed: '',
  info: '',
};

const filterState = {
  sortOfFilters: ['weeks', 'days', 'member'],
  week: [],
  day: [],
  memeber: [],
};

const fetchGroups = async () => {
  group = await axios.get('/study/HTML').then(({ data }) => data);
  group.date = new Date(group.date);

  users = group.userList;
  postings = group.postingList;

  // console.log(new Date(postings[0].createDate._seconds * 1000));
  // console.log(postings[0]);
  // console.log(group.date);
  // console.log(Date.parse(group.date));
};

const initialFilter = () => {
  filterState.week = postings;
  filterState.day = postings;
  filterState.memeber = postings;
};

const setFilterState = (stateName, newState) => {
  filterState[stateName] = newState;
};

const setFeedContent = (feedName, newFeed) => {
  feedContents[feedName] = newFeed;
};

const stateFunc = {
  get group() {
    return group;
  },
  set group(newGroup) {
    group = newGroup;
  },
  get user() {
    return users;
  },
  set user(newUser) {
    users = newUser;
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
  get teamFeed() {
    return feedContents.teamFeed;
  },
  set teamFeed(newFeed) {
    feedContents.teamFeed = newFeed;
  },
  get myFeed() {
    return feedContents.myFeed;
  },
  set myFeed(newFeed) {
    feedContents.myFeed = newFeed;
  },
  get info() {
    return feedContents.info;
  },
  set info(newFeed) {
    feedContents.info = newFeed;
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
};

export { stateFunc, fetchGroups, initialFilter, setFilterState, setFeedContent };
