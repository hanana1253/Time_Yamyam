import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import axios from 'axios';
import { firebaseConfig } from '../utils/firebaseConfig.js';
import { debounce } from '../utils/helper.js';
import {
  getCurrentForm,
  getErrorMsgByInputName,
  getIsValid,
  getIsValidByInputName,
  setCurrentForm,
  setCurrentSchema,
  setSchemaValueByInputName,
} from '../store/login.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

const $loginForm = document.querySelector('.login.auth-form');
const $signupForm = document.querySelector('.signup.auth-form');
const $loginFormSubmit = document.querySelector('.login.button');
const $signupFormSubmit = document.querySelector('.signup.button');
const $loginFailMsg = document.querySelector('.login-fail');
const $signupFailMsg = document.querySelector('.signup-fail');
let $currentForm = $loginForm;
let $currentFormSubmit = $loginFormSubmit;
let $currentFailMsg = $loginFailMsg;

const toggleCurrentForm = () => {
  $currentForm.reset();
  $currentFailMsg.textContent = '';
  setCurrentForm(getCurrentForm() === 'login' ? 'signup' : 'login');
  setCurrentSchema(getCurrentForm());
  $currentForm = getCurrentForm() === 'login' ? $loginForm : $signupForm;
  $currentFailMsg = getCurrentForm() === 'login' ? $loginFailMsg : $signupFailMsg;
  $currentFormSubmit = getCurrentForm() === 'login' ? $loginFormSubmit : $signupFormSubmit;
  document.querySelectorAll('.auth-form').forEach($form => $form.classList.toggle('hidden'));
};

const setErrorMsg = inputName => {
  $currentForm.querySelector(`input[name=${inputName}] ~ .error`).textContent = getIsValidByInputName(inputName)
    ? ''
    : getErrorMsgByInputName(inputName);
};

const activateSubmitButton = () => {
  $currentFormSubmit.disabled = !getIsValid();
};

const validate = debounce(e => {
  $currentFailMsg.textContent = '';
  const { name, value } = e.target;

  setSchemaValueByInputName(name, value.trim());
  setErrorMsg(name);
  activateSubmitButton();
}, 300);

const submit = async e => {
  try {
    e.preventDefault();

    const formData = [...new FormData($currentForm)].reduce((obj, [key, value]) => ((obj[key] = value), obj), {});

    // console.log(`POST /${currentForm}`, formData);

    if (getCurrentForm() === 'login') {
      const { user } = await signInWithEmailAndPassword(auth, formData.email, formData.password);
    } else {
      const { user } = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const { data } = await axios.post('/signup', { ...formData, userUid: user.uid });
    }
    window.location.href = '/';
  } catch (e) {
    $currentFailMsg.textContent =
      getCurrentForm() === 'login'
        ? '올바른 로그인 정보가 아닙니다.'
        : e.code === 'auth/email-already-in-use'
        ? '중복된 이메일입니다.'
        : '회원가입이 정상적으로 처리되지 않았습니다. 다시 시도해주세요.';
  }
};

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.querySelector('.login-body').style.opacity = 1;
  }, 500);
});

[$loginForm, $signupForm].forEach($form => {
  $form.onsubmit = submit;
  $form.oninput = validate;
  $form.querySelector('.toggle-btn').onclick = toggleCurrentForm;
});
