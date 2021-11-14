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
  const myStudyList = [];
  const myStudyDB = await db
    .collection('users')
    .doc(userUid)
    .collection('myStudy')
    .where('status', '==', 'ready')
    .get();

  myStudyDB.forEach(async doc => {
    myStudyList.push(doc.data());
    console.log((await db.doc(doc.data().ref.path).get()).data());
  });

  res.send({ readyStudyList, myStudyList });
});

// GET '/study/:id' { user: { uid: "dfkjdkf" } }
// user정보로 가입되어있는 스터디인 경우 finishedDate 비교 후 처리
app.get('/study/:id/member/:uid', async (req, res) => {
  const { id, uid } = req.params;
  const targetStudyDB = db.collection('studyGroups').doc(id);
  const targetStudyData = await targetStudyDB.get().then(res => res.data());
  // console.log(targetStudyData);

  // console.log(test);
  // 스터디그룹 완료 시 포인트 배분 및 상태변경
  // const now = new Date();
  // if (now > targetStudy.data().finishDate.toDate() && !targetStudy.data().isFinished) {
  //   studyDB.update({
  //     isFinished: true,
  //   });
  //   targetStudy.data().userList.forEach(async user => {
  //     const userData = await user.get();
  //     const pointDB = db.collection('points').doc(userData.data().uid);
  //     const record = { point: 100, category: '스터디완료보너스점수', date: new Date() };
  //     await pointDB.update({
  //       total: admin.firestore.FieldValue.increment(record.point),
  //       history: admin.firestore.FieldValue.arrayUnion(record),
  //     });
  //   });
  // }

  // 인증글
  // 스터디 피드들을 보여줘야 함 응답으로
  res.send(targetStudyData);
});

app.get('/mypage/:userUid', async (req, res) => {
  const { userUid } = req.params;
  const targetUserDB = db.collection('users').doc(userUid);
  const targetUserData = await targetUserDB.get().then(res => res.data());
  res.send(targetUserData);
});

// GET '/mypoints/:userUid' 포인트 조회페이지
app.get('/mypoints/:userUid', async (req, res) => {
  const { userUid } = req.params;
  const targetUserPointsDB = await db.collection('users').doc(userUid).collection('points').get();
  const pointHistory = [];
  targetUserPointsDB.forEach(doc => {
    pointHistory.push(doc.data());
  });
  res.send(pointHistory);
});

// POST '/signup' { email, nickname, password } password는 6글자 이상 string
app.post('/signup', async (req, res) => {
  const { email, nickname, uid } = req.body;

  const pointsDB = db.collection('points').doc(uid);
  const userDB = db.collection('users').doc(uid);

  await pointsDB.set({ total: 50, history: [{ date: new Date(), point: 50, category: '회원가입' }] });
  await userDB.set({ email, nickname, point: 50, pointsDB, studyGroup: [] });

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

// POST '/posting' { user: uid를 가진 유저객체, newPosting: 새로운 스터디 객체 }
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
//  studyGroupId: {string - studyGroupId}, // 요청에서 온 id를 자동으로 넣어주기
// }
app.post('/posting', async (req, res) => {
  const { user, newPosting } = req.body;

  const id = generateNextPostingId();
  const authorUserDB = db.collection('users').doc(user.uid);
  const createDate = new Date();
  const studyGroupDB = db.collection('studyGroups').doc(newPosting.studyGroupId);
  const postingDB = db.collection('postings').doc(id);
  const pointDB = db.collection('points').doc(user.uid);
  const POSTING_POINT = 10;
  const record = { point: POSTING_POINT, category: '인증추가점수', date: new Date() };
  await postingDB.set({ ...newPosting, authorUserDB, createDate, studyGroupDB, likes: 0, id });
  await studyGroupDB.update({
    postingList: admin.firestore.FieldValue.arrayUnion(postingDB),
  });
  await pointDB.update({
    total: admin.firestore.FieldValue.increment(record.point),
    history: admin.firestore.FieldValue.arrayUnion(record),
  });
  await authorUserDB.update({
    point: admin.firestore.FieldValue.increment(POSTING_POINT),
  });

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
app.patch('/study/:id', async (req, res) => {
  const { user } = req.body;
  const { id } = req.params;
  const userDB = db.collection('users').doc(user.uid);
  const studyDB = db.collection('studyGroups').doc(id + '');
  await userDB.update({
    studyGroup: admin.firestore.FieldValue.arrayUnion(studyDB),
  });
  await studyDB.update({
    userList: admin.firestore.FieldValue.arrayUnion(userDB),
  });
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
