let group = [];
let users = [];
let postings = const postings = [{
	isNoti: {boolean}, // user input
	author: {string - userId}, // 서버에서 자동생성
  title: {string}, // user input
	description: {string}, // user input
	url: {string}, // user input
  img: {object} {
    url: {string},
    width: '300',
    height: '300',
    type: 'image/png'
  }, // user input
  createDate: {Date}, // 서버에서 자동생성
  studyGroupId: {string - studyGroupId}, // 요청에서 온 id를 자동으로 넣어주기
	likes: {number} // (0 ~ studyGroup.userList.length)
}]
;

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
  get filterState() {
    return filterState;
  },
};
