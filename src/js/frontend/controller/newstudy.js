import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseConfig } from '../utils/firebaseConfig.js';
import { debounce } from '../utils/helper.js';
import { newstudySchema } from '../utils/schema.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth();
let tags = [];
const colors = ['#ff99c8', '#fec8c3', '#fcf6bd', '#d0f4de', '#a9def9', '#c7d0f9', '#e4c1f9'];

const $form = document.querySelector('form');
const $tagInput = document.querySelector('.tag-id');
const $tagList = document.querySelector('.tag-list');
const $submitBtn = document.querySelector('.submit');
const $newstudyForm = document.querySelector('.newstudy-form');
const $enterRangeInput = document.querySelector('.enter-range');
const $durationRangeInput = document.querySelector('.duration-range');
const schema = newstudySchema;

// Functions -------------------------------------------------
const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const getErrorMsgByInputName = inputName => schema[inputName].error;
const getIsValidByInputName = inputName => schema[inputName].isValid;
const getIsValid = () => schema.isValid;
const setSchemaValueByInputName = (inputName, value) => {
  schema[inputName].value = value;
};

const render = () => {
  $tagList.innerHTML = tags
    .map(
      ({ id, content }) => `
        <li class="item" style="background-color:${getRandomColor()}" data-id="${id}">${content}
          <i class='bx bxs-tag-x' ></i>
        </li>`
    )
    .join('');
};

const setErrorMessage = inputName => {
  $newstudyForm
    .querySelector(`input[name = ${inputName}], textarea[name=${inputName}]`)
    .closest('.input-container').lastElementChild.textContent = getIsValidByInputName(inputName)
    ? ''
    : getErrorMsgByInputName(inputName);
};

const activateSubmitButton = () => {
  $submitBtn.disabled = !getIsValid();
};

const validate = debounce(e => {
  const { name, value } = e.target;
  if (name === 'duration' || name === 'minLevel') return;
  if (name === 'date-checker') {
    const formData = new FormData($newstudyForm);
    setSchemaValueByInputName(name, formData.has('date-checker'));
  }
  if (name !== 'hash-id') {
    setSchemaValueByInputName(name, value.trim());
  }
  setErrorMessage(name);
  activateSubmitButton();
}, 300);

const setTags = newTags => {
  tags = newTags;
  setSchemaValueByInputName($tagInput.name, tags.length);
  setErrorMessage($tagInput.name);
  activateSubmitButton();
  render();
};

const generateTagId = () => Math.max(...tags.map(tag => tag.id), 0) + 1;

const addTags = content => {
  setTags([{ id: generateTagId(), content }, ...tags]);
};

const removeTag = id => {
  setTags(tags.filter(tag => tag.id !== +id));
};

// Event bindings --------------------------------
$newstudyForm.oninput = validate;

$tagInput.onkeyup = e => {
  if (e.key !== 'Enter') return;
  const content = e.target.value.trim();

  if (content) addTags(content);
  $tagInput.value = '';
};

$tagList.onclick = e => {
  if (!e.target.classList.contains('bxs-tag-x')) return;
  removeTag(e.target.closest('li').dataset.id);
};

$form.onkeydown = e => {
  if (e.key !== 'Enter' || e.target.name === 'text-content') return;
  e.preventDefault();
};

const setValue = currentInput => {
  const $rangeInput = document.querySelector(
    `${currentInput === 'enter' ? '.enter-range' : '.duration-range'} .range-input`
  );
  const $rangeOuput = document.querySelector(
    `${currentInput === 'enter' ? '.enter-range' : '.duration-range'} .range-ouput`
  );
  const newValue = (($rangeInput.value - $rangeInput.min) * 100) / ($rangeInput.max - $rangeInput.min);
  const newPosition = 12 - newValue * 0.24; // TODO: thumbsize 변수로 만들기
  $rangeOuput.innerHTML = `<span>${$rangeInput.value}${$rangeInput.dataset.label}</span>`;
  $rangeOuput.style.left = `calc(${newValue}% + (${newPosition}px))`;

  $rangeInput.style = `
    background-image: 
      -webkit-gradient(linear, 0% 0%, 100% 0%, 
        color-stop(${newValue / 100},${currentInput === 'enter' ? '#aaa' : '#5D5FEF'}),
        color-stop(${newValue / 100},${currentInput === 'enter' ? '#5D5FEF' : '#aaa'}));`;
};

document.addEventListener('DOMContentLoaded', () => {
  setValue('enter');
  setValue('duration');
});

$enterRangeInput.oninput = () => {
  setValue('enter');
};

$durationRangeInput.oninput = () => {
  setValue('duration');
};

// send data to server ----------------------------
$form.onsubmit = e => {
  e.preventDefault();
  const newStudy = {};
  newStudy.title = $form.querySelector('.group-name').value;
  newStudy.description = $form.querySelector('.group-introduction').value;
  newStudy.postingDescription = $form.querySelector('.approval-method').value;
  newStudy.hashtags = tags.map(({ content }) => content);
  newStudy.duration = $form.querySelector('.duration').value;
  newStudy.postingDays = [...$form.querySelectorAll('.posting-days')]
    .filter(input => input.checked)
    .map(input => +input.dataset.id);
  newStudy.minLevel = $form.querySelector('.minLevel').value;
  axios.post('/study', { userUid: auth.currentUser.uid, newStudy });
  // query string으로 study id 보내기
  window.location.href = '/group.html';
};
