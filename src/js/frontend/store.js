// 서버에서 가져오기
let users = [];
let studyGroups = [];
let points = [];
let postings = [];

export default {
  get users() {
    return users;
  },
  set users(newUsers) {
    users = newUsers;
  },
  get studyGroups() {
    return studyGroups;
  },
  set studyGroups(newStudyGroups) {
    studyGroups = newStudyGroups;
  },
  get points() {
    return points;
  },
  set points(newPoints) {
    points = newPoints;
  },
  get postings() {
    return postings;
  },
  set postings(newPostings) {
    postings = newPostings;
  },
};
