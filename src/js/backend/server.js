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
  console.log(user.uid);
  res.send(user.uid);
});



app.listen(PORT, () => {
  console.log(`Server is listening at http://localhost:${PORT}.`);
});
