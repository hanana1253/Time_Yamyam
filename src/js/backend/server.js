const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./secretKey.json');
// console.log(express);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const auth = admin.auth();

const app = express();
const PORT = 9999;
app.use(express.static('public'));
app.use(express.json());

// POST '/signup' { email, nickname, password } password는 6글자 이상 string
app.post('/signup', async (req, res) => {
  const { email, nickname, password } = req.body;
  const user = await auth.createUser({
    email,
    emailVerified: false,
    password,
    nickname,
    photoURL: 'http://www.example.com/12345678/photo.png',
    disabled: false,
  });
  const userDB = db.collection('users').doc(user.uid);
  await userDB.set({ email, nickname });
  console.log(user.uid);
  res.send(user.uid);
});

// POST '/study' { creator: 유저인증id, newStudy: 새로운 스터디 객체 }
app.post('/study', async (req, res) => {
  const { creator, newStudy } = req.body;
  console.log(newStudy);
  const studyDB = db.collection('studyGroups').doc(`${newStudy.id}`);
  const test = await studyDB.set(newStudy);
  res.send(test);
});

// POST '/posting' { creator: 유저인증id, newStudy: 새로운 스터디 객체 }
app.post('/posting', async (req, res) => {
  const { creator, newStudy } = req.body;
  console.log(newStudy);
  const studyDB = db.collection('studyGroups').doc(`${newStudy.id}`);
  const test = await studyDB.set(newStudy);
  res.send(test);
});


app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}.`);
});
