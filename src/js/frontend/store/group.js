import axios from 'axios';

let group = [];
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
  console.log(group);
  // users = group.userList;
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

export { stateFunc, fetchGroups };
