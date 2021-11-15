let group = [];
let users = [];
let postings = [];

const feedState = {
  feedLists: ['teamFeed', 'myFeed', 'info'],
  currentFeed: 'teamFeed',
};

const filterState = {
  sortOfFilters: ['weeks', 'days', 'member'],
  week: [],
  day: [],
  memeber: [],
};

export default {
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
