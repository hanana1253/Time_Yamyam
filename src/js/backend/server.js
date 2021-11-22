const express = require('express');
const path = require('path');
const admin = require('firebase-admin');
const schedule = require('node-schedule');
const serviceAccount = require('./secretKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
const PORT = 3001;

app.use(express.static('public'));
app.use(express.json());

// GET '/' { userUid: {string} 또는 null }

const diffDays = (from, to) => Math.abs(to - from) / (24 * 60 * 60 * 1000);

const setSchedule = () => {
  const rule = new schedule.RecurrenceRule();
  // rule.dayOfWeek = [4, 5]; // 목요일, 금요일

  // rule.hour = 0;
  // rule.minute = 48;

  // test 용
  // rule.hour = 1;
  // rule.minute = 11;
  // rule.second = 40;

  schedule.scheduleJob(rule, async () => {
    console.log('완료된 스터디그룹 체크 실행', new Date());
    // 스터디그룹 완료 시 포인트 배분 및 상태변경
    const now = new Date();
    const startedGroupsDB = await db.collection('studyGroups').where('status', '==', 'started').get();
    const readyGroupsDB = await db.collection('studyGroups').where('status', '==', 'ready').get();

    startedGroupsDB.forEach(doc => {
      const finishDate = doc.data().finishDate.toDate();
      // console.log(finishDate);
      if (finishDate < now) {
        doc.ref.update({ status: 'finished' });

        doc.data().userList.forEach(userUid => {
          const pointRecord = { point: 100, category: `[${doc.data().title}] 스터디완료`, date: new Date() };
          const notiRecord = {
            category: '알림',
            msg: `[${doc.data().title}] 스터디완료 포인트가 지급되었습니다.`,
            date: new Date(),
          };
          db.collection('users').doc(userUid).collection('points').add(pointRecord);
          db.collection('users').doc(userUid).collection('noti').add(notiRecord);
        });
      } else {
        const { postingDays } = doc.data();

        console.log(postingDays, now.getDay());
        if (postingDays.includes(now.getDay())) {
          doc.data().userList.forEach(userUid => {
            const notiRecord = {
              category: '알림',
              msg: `'${doc.data().title}' 스터디 인증 요일입니다.`,
              date: new Date(),
            };
            db.collection('users').doc(userUid).collection('noti').add(notiRecord);
          });
        }
      }
    });

    readyGroupsDB.forEach(doc => {
      const expireDate = doc.data().expireDate.toDate();

      if (expireDate < now) {
        let record = {};

        if (doc.data().userList.length < 3) {
          doc.ref.update({ status: 'expired' });
          record = {
            category: '알림',
            msg: `3명이 모이지 않아서 [${doc.data().title}] 스터디가 삭제되었습니다.`,
            date: new Date(),
          };
        } else {
          doc.ref.update({ status: 'started' });
          record = {
            category: '알림',
            msg: `[${doc.data().title}] 스터디가 시작되었습니다.`,
            date: new Date(),
          };
        }

        doc.data().userList.forEach(userUid => {
          db.collection('users').doc(userUid).collection('noti').add(record);
        });
      }
    });
  });
};

setSchedule();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './../../../public/index.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, './../../../public/login.html'));
});

app.get('/group', (req, res) => {
  res.sendFile(path.join(__dirname, './../../../public/group.html'));
});

app.get('/mypage', (req, res) => {
  res.sendFile(path.join(__dirname, './../../../public/mypage.html'));
});

app.get('/newstudy', (req, res) => {
  res.sendFile(path.join(__dirname, './../../../public/newstudy.html'));
});

app.get('/posting', (req, res) => {
  res.sendFile(path.join(__dirname, './../../../public/posting.html'));
});

app.get('/point', (req, res) => {
  res.sendFile(path.join(__dirname, './../../../public/point.html'));
});

app.get('/notice', (req, res) => {
  res.sendFile(path.join(__dirname, './../../../public/notice.html'));
});

app.get('/setting', (req, res) => {
  res.sendFile(path.join(__dirname, './../../../public/setting.html'));
});

app.get('/:userUid', async (req, res) => {
  const { userUid } = req.params;
  const studyDB = await db.collection('studyGroups').where('status', '==', 'ready').get();
  const readyStudyGroups = [];
  studyDB.forEach(doc => {
    readyStudyGroups.push({
      ...doc.data(),
      createDate: doc.data().createDate.toDate(),
      expireDate: doc.data().expireDate.toDate(),
      finishDate: doc.data().finishDate.toDate(),
    });
  });
  const myGroups = [];
  const myStudyDB = await db.collection('studyGroups').where('userList', 'array-contains', userUid).get();
  myStudyDB.forEach(doc => {
    myGroups.push({
      ...doc.data(),
      createDate: doc.data().createDate.toDate(),
      expireDate: doc.data().expireDate.toDate(),
      finishDate: doc.data().finishDate.toDate(),
    });
  });
  const userData = (await db.collection('users').doc(userUid).get()).data();

  // 출석체크
  const user = await db.collection('users').where('id', '==', userUid).get();

  user.forEach(doc => {
    // console.log(doc.data().attend.toDate());

    const lastAttend = new Date(doc.data().attend.toDate());

    // console.log(diffDays(lastAttend, new Date()));
    if (diffDays(lastAttend, new Date()) > 1) {
      const pointRecord = { point: 1, category: '출석체크', date: new Date() };
      db.collection('users').doc(userUid).collection('points').add(pointRecord);
      db.collection('users')
        .doc(userUid)
        .update({ point: admin.firestore.FieldValue.increment(1), attend: new Date() });
    }
  });

  res.send({ readyStudyGroups, myGroups, userData });
});

app.get('/allGroups', async (req, res) => {
  const studyDB = await db.collection('studyGroups').where('status', '==', 'ready').get();
  const readyStudyGroups = [];
  studyDB.forEach(doc => {
    readyStudyGroups.push({
      ...doc.data(),
      createDate: doc.data().createDate.toDate(),
      expireDate: doc.data().expireDate.toDate(),
      finishDate: doc.data().finishDate.toDate(),
    });
  });

  res.send({ readyStudyGroups });
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
  targetStudy.createDate = targetStudy.createDate.toDate();
  const postingsDB = await db.collection(`studyGroups/${id}/postings`).orderBy('createDate', 'desc').get();
  const postingList = [];
  postingsDB.forEach(doc => {
    postingList.push({ ...doc.data(), createDate: doc.data().createDate.toDate() });
  });
  const { userList } = (await db.doc(`studyGroups/${id}`).get()).data();
  const targetStudyGroupUserList = await Promise.all(
    userList.map(async uid => (await db.collection('users').doc(uid).get()).data())
  );
  res.send({ ...targetStudy, userList: targetStudyGroupUserList, postingList });
});

// GET '/posting/:id' 포스팅 페이지
app.get('/posting/:userUid', async (req, res) => {
  const { userUid } = req.params;
  const targetUserDB = db.collection('users').doc(userUid);
  const targetUserData = await targetUserDB.get().then(res => res.data());

  const targetUserStudyGroups = await Promise.all(
    targetUserData.myStudy.map(async uid => (await db.collection('studyGroups').doc(uid).get()).data())
  );
  console.log(targetUserStudyGroups);
  res.send({ studyGroup: targetUserStudyGroups });
});

// GET '/mypage/:userUid' 마이페이지
app.get('/mypage/:userUid', async (req, res) => {
  const { userUid } = req.params;
  const targetUserDB = db.collection('users').doc(userUid);
  const targetUserData = await targetUserDB.get().then(res => res.data());
  // 처음가입하고 마이페이지 들어가면 에러
  // let targetUserStudyGroups = [];
  // if (targetUserData) {
  const targetUserStudyGroups = await Promise.all(
    targetUserData.myStudy.map(async uid => (await db.collection('studyGroups').doc(uid).get()).data())
  );
  // }
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
    pointHistory.push({ ...doc.data(), date: doc.data().date.toDate() });
  });
  const total = pointHistory.reduce((acc, cur) => acc + cur.point, 0);
  res.send({ total, pointHistory });
});

app.get('/mynotice/:userUid', async (req, res) => {
  const { userUid } = req.params;

  const targetUserNotiDB = await db.collection('users').doc(userUid).collection('noti').orderBy('date', 'desc').get();
  const notiHistory = [];
  targetUserNotiDB.forEach(doc => {
    notiHistory.push({ ...doc.data(), date: doc.data().date.toDate() });
  });
  res.send({ notiHistory });
});

// POST '/signup' { email, nickname, password } password는 6글자 이상 string
app.post('/signup', async (req, res) => {
  const { email, nickname, userUid } = req.body;

  const temp = new Date(new Date() - 86400000);

  const userDB = db.collection('users').doc(userUid);
  userDB.collection('points').add({ point: 25, category: '회원가입', date: new Date() });
  await userDB.set({
    email,
    nickname,
    point: 25,
    myStudy: [],
    id: userUid,
    attend: temp,
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
  const { userUid, newStudy } = req.body;
  const createDate = new Date();
  const studyDB = db.collection('studyGroups').doc();
  const userDB = db.collection('users').doc(userUid);
  userDB.update({ myStudy: admin.firestore.FieldValue.arrayUnion(studyDB.id) });
  studyDB.collection('postings').add({ checked: true, createDate: new Date() });

  await studyDB.set({
    ...newStudy,
    id: studyDB.id,
    createDate,
    expireDate: new Date(new Date().setDate(createDate.getDate() + 7)),
    finishDate: new Date(new Date().setDate(createDate.getDate() + 7 + newStudy.duration * 7)),
    leader: userUid,
    userList: [userUid],
    status: 'ready',
    postingList: [],
  });
  res.send(studyDB.id);
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
  const record = { point: POSTING_POINT, category: '인증 완료', date: new Date() };

  authorUserDB.update({
    point: admin.firestore.FieldValue.increment(POSTING_POINT),
  });
  const postingDB = await studyGroupDB.collection('postings').add({
    ...newPosting,
    id: null,
    author,
    authorUid: userUid,
    createDate,
    studyGroupDB,
    likes: 0,
    img: { url: null },
    likedBy: [],
    checked: false,
  });
  authorUserDB.collection('points').add(record);
  postingDB.update({ id: postingDB.id });
  res.send('success');
});

app.patch('/study/:id/posting/', async (req, res) => {
  const { id } = req.params;
  const { userUid, postingId } = req.body;
  const postingDB = db.collection('studyGroups').doc(id).collection('postings').doc(postingId);
  const postingData = (await postingDB.get()).data();
  if (postingData.likedBy.includes(userUid)) {
    postingDB.update({
      likes: admin.firestore.FieldValue.increment(-1),
      likedBy: admin.firestore.FieldValue.arrayRemove(userUid),
    });
  } else {
    postingDB.update({
      likes: admin.firestore.FieldValue.increment(1),
      likedBy: admin.firestore.FieldValue.arrayUnion(userUid),
    });
  }
  res.send(postingData);
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

app.delete('/study/:groupId/posting/:postingId', async (req, res) => {
  const { groupId, postingId } = req.params;
  const postingDB = db.collection(`studyGroups/${groupId}/postings`).doc(postingId);
  await postingDB.delete();
  res.send('success');
});

app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}.`);
});
