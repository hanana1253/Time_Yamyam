const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./secretKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const generateNextStudyId = (() => {
  let num = 0;
  return () => num++;
})();

const generateNextPostingId = (() => {
  let num = 0;
  return () => num++;
})();

const app = express();
const PORT = 3001;

app.use(express.static('public'));
app.use(express.json());

// Get '/' { user: {uid: ""} 또는 null }
app.get('/:userUid', async (req, res) => {
  const { userUid } = req.params;
  const studyDB = await db.collection('studyGroups').where('status', '==', 'ready').get();
  const readyStudyList = [];
  studyDB.forEach(doc => {
    readyStudyList.push(doc.data());
  });
  const myReadyStudyList = [];
  const myStudyDB = await db.collection('studyGroups').where('userList', 'array-contains', userUid).get();
  myStudyDB.forEach(doc => {
    myReadyStudyList.push(doc.data());
  });

  res.send({ readyStudyList, myReadyStudyList });
});

// GET '/study/:id'
// user정보로 가입되어있는 스터디인 경우 finishedDate 비교 후 처리
app.get('/study/:id', async (req, res) => {
  const { id } = req.params;
  const targetStudy = await db
    .collection('studyGroups')
    .doc(id)
    .get()
    .then(res => res.data());
  targetStudy.date = targetStudy.date.toDate();
  const userList = [];
  const membersDB = await db.collection(`/studyGroups/${id}/members`).get();
  membersDB.forEach(doc => {
    const userInfo = doc.data();
    userList.push(userInfo);
  });
  const { userList } = (await db.doc(`studyGroups/${id}`).get()).data();
  const targetStudyGroupUserList = await Promise.all(
    userList.map(async uid => (await db.collection('users').doc(uid).get()).data())
  );
  // console.log(test);
  // 스터디그룹 완료 시 포인트 배분 및 상태변경
  // const now = new Date();
  // if (now > targetStudy.finishDate.toDate() && !targetStudy.isFinished) {
  //   db.collection('studyGroups').doc(id).update({
  //     isFinished: true,
  //   });
  //   targetStudy.userList.forEach(async user => {
  //     const userData = await user.get();
  //     const record = { point: 100, category: '스터디완료보너스점수', date: new Date() };
  //     await pointDB.update({
  //       total: admin.firestore.FieldValue.increment(record.point),
  //       history: admin.firestore.FieldValue.arrayUnion(record),
  //     });
  //   });
  // }

  // 인증글
  // 스터디 피드들을 보여줘야 함 응답으로
  res.send({ ...targetStudy, userList: targetStudyGroupUserList, postingList });
});

// GET '/mypage/:userUid' 마이페이지
app.get('/mypage/:userUid', async (req, res) => {
  const { userUid } = req.params;
  const targetUserDB = db.collection('users').doc(userUid);
  const targetUserData = await targetUserDB.get().then(res => res.data());
  const targetUserStudyGroups = await Promise.all(
    targetUserData.myStudy.map(async uid => (await db.collection('studyGroups').doc(uid).get()).data())
  );
  res.send({ ...targetUserData, myStudy: targetUserStudyGroups });
});

// GET '/mypoints/:userUid' 포인트 조회페이지, date 기준 내림차순 정렬된 적립 내역 데이터
app.get('/mypoints/:userUid', async (req, res) => {
  const { userUid } = req.params;
  const targetUserPointsDB = await db
    .collection('users')
    .doc(userUid)
    .collection('points')
    .orderBy('date', 'desc')
    .get();
  const pointHistory = [];
  targetUserPointsDB.forEach(doc => {
    pointHistory.push(doc.data());
  });
  res.send(pointHistory);
});

// POST '/signup' { email, nickname, password } password는 6글자 이상 string
app.post('/signup', async (req, res) => {
  const { email, nickname, userUid } = req.body;

  const userDB = db.collection('users').doc(userUid);
  userDB.collection('points').add({ point: 50, category: '회원가입', date: new Date() });
  await userDB.set({
    email,
    nickname,
    point: 50,
    myStudy: [],
  });

  res.send('success');
});

// POST '/study' { user: 유저 uid를 갖는 객체, newStudy: 새로운 스터디 객체 }
// newStudy = {
//   title: str,
//   description,
//   str,
//   postingDescription: str,
//   hashtags: arr,
//   duration: number,
//   postingDays: arr,
//   minLevel: number,
//   capacity: number,
// };
app.post('/study', async (req, res) => {
  const { user, newStudy } = req.body;
  const leader = db.collection('users').doc(user.uid);
  const createDate = new Date();

  const id = generateNextStudyId();
  const studyDB = db.collection('studyGroups').doc(id);

  await studyDB.set({
    ...newStudy,
    createDate,
    expireDate: new Date(new Date().setDate(createDate.getDate() + 7)),
    finishDate: new Date(new Date().setDate(createDate.getDate() + 7 + newStudy.duration * 7)),
    leader,
    userList: [leader],
    status: 'ready',
    postingList: [],
  });
  res.send('success');
});

// POST '/posting' { userUid: uid string, newPosting: 새로운 스터디 객체 }
// {
// 	isNoti: {boolean}, // user input
//  title: {string}, // user input
// 	description: {string}, // user input
// 	url: {string}, // user input
//   img: {object} {
//     url: {string},
//     width: '300',
//     height: '300',
//     type: 'image/png'
//   },
// }
app.post('/study/:id/posting', async (req, res) => {
  const { id } = req.params;
  const { userUid, newPosting } = req.body;
  const authorUserDB = db.collection('users').doc(userUid);
  const author = (await authorUserDB.get()).data().nickname;
  const createDate = new Date();
  const studyGroupDB = db.collection('studyGroups').doc(id);
  const POSTING_POINT = 10;
  const record = { point: POSTING_POINT, category: '인증추가점수', date: new Date() };

  authorUserDB.update({
    point: admin.firestore.FieldValue.increment(POSTING_POINT),
  });
  studyGroupDB.collection('postings').add({
    ...newPosting,
    author,
    authorUid: userUid,
    createDate,
    studyGroupDB,
    likes: 0,
  });
  authorUserDB.collection('points').add(record);

  res.send('success');
});

// post 말고 get요청으로 만들기 (마이페이지용)
// app.post('/point', async (req, res) => {
//   // req.headers에서 uid를 받아서 req.body의 user 대신 넣어주기
//   const { user, newPoint } = req.body;
//   const pointDB = db.collection('points').doc(user.uid);
//   const record = { diff: newPoint.diff, msg: newPoint.msg, date: new Date() };
//   await pointDB.update({
//     total: admin.firestore.FieldValue.increment(newPoint.diff),
//     history: admin.firestore.FieldValue.arrayUnion(record),
//   });
//   res.send('success');
// });

// PATCH '/study/:id' { user :{ uid: ""} }
app.patch('/study/:id/member/:userUid', async (req, res) => {
  const { id, userUid } = req.params;
  const studyDB = db.collection('studyGroups').doc(id);
  studyDB.update({
    userList: admin.firestore.FieldValue.arrayUnion(userUid),
  });
  db.collection('users')
    .doc(userUid)
    .update({ myStudy: admin.firestore.FieldValue.arrayUnion(id) });
  res.send('success');
});

// DELETE '/study/:id' { user :{ uid: ""} }
app.delete('/study/:groupId/member/:userUid', async (req, res) => {
  const { groupId, userUid } = req.params;
  const userDB = db.collection('users').doc(userUid);
  const studyDB = db.collection('studyGroups').doc(groupId + '');
  await userDB.update({
    studyGroup: admin.firestore.FieldValue.arrayRemove(studyDB),
  });
  await studyDB.update({
    userList: admin.firestore.FieldValue.arrayRemove(userDB),
  });
  res.send('success');
});

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}.`);
});
