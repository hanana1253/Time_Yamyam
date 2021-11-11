import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { loginSchema, signupSchema } from '../utils/schema.js';
import { throttle } from '../utils/helper.js';
import axios from 'axios';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAoSFp0zS691ErJuAjGbwuQZMSjEtfxgi0',
  authDomain: 'timeyamyam-8101d.firebaseapp.com',
  databaseURL: 'https://timeyamyam-8101d-default-rtdb.firebaseio.com',
  projectId: 'timeyamyam-8101d',
  storageBucket: 'timeyamyam-8101d.appspot.com',
  messagingSenderId: '345524870175',
  appId: '1:345524870175:web:94aef6d22c707ca693892a',
  measurementId: 'G-1HXK10SP5N',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

const $loginForm = document.querySelector('.login.auth-form');
const $signupForm = document.querySelector('.signup.auth-form');
const $loginFormSubmit = document.querySelector('.login.button');
const $signupFormSubmit = document.querySelector('.signup.button');

let currentForm = 'login';
let schema = loginSchema;
let $currentForm = $loginForm;
let $currentFormSubmit = $loginFormSubmit;

const toggleCurrentForm = () => {
  $currentForm.reset();
  if (currentForm === 'login') {
    currentForm = 'signup';
    schema = signupSchema;

    $currentForm = $signupForm;
    $currentFormSubmit = $signupFormSubmit;
  } else {
    currentForm = 'login';
    schema = loginSchema;

    $currentForm = $loginForm;
    $currentFormSubmit = $loginFormSubmit;
  }

  document.querySelectorAll('.auth-form').forEach($form => $form.classList.toggle('hidden'));
};

const setErrorMsg = inputName => {
  $currentForm.querySelector(`input[name=${inputName}] ~ .error`).textContent = schema[inputName].isValid
    ? ''
    : schema[inputName].error;
};

const activateSubmitButton = () => {
  $currentFormSubmit.disabled = !schema.isValid;
};

const validate = throttle(e => {
  const { name, value } = e.target;

  schema[name].value = value.trim();
  setErrorMsg(name);
  activateSubmitButton();
}, 300);

const submit = async e => {
  e.preventDefault();

  const formData = [...new FormData($currentForm)].reduce(
    // eslint-disable-next-line no-return-assign, no-sequences
    (obj, [key, value]) => ((obj[key] = value), obj),
    {}
  );

  // console.log(`POST /${currentForm}`, formData);

  if (currentForm === 'login') {
    const { user } = await signInWithEmailAndPassword(auth, formData.email, formData.password);
  } else {
    const { user } = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
    const { data } = await axios.post('/signup', { ...formData, uid: user.uid });
    console.log(data);
  }
  console.log('submit');
};

[$loginForm, $signupForm].forEach($form => {
  $form.onsubmit = submit;
  $form.oninput = validate;
  $form.querySelector('.toggle-btn').onclick = toggleCurrentForm;
});
