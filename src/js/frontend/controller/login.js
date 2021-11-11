import { loginSchema, signupSchema } from "../utils/schema.js";

const $loginForm = document.querySelector('.login.auth-form');
const $signupForm = document.querySelector('.signup.auth-form');
const $loginFormSubmit = document.querySelector('.login.button');
const $signupFormSubmit = document.querySelector('.signup.button');

let currentForm = 'login';
let schema = loginSchema;
let $currentForm = $loginForm;
let $currentFormSubmit = $loginFormSubmit;

const toggleCurrentForm = () => {
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

const submit = e => {
  e.preventDefault();
}

[$loginForm, $signupForm].forEach($form => {
  $form.onsubmit = submit;
  $form.querySelector('.toggle-btn').onclick = toggleCurrentForm;
});
