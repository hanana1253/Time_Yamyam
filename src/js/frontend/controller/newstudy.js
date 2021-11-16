import { throttle } from '../utils/helper.js';
import { newstudySchema } from '../utils/schema.js';

// hash tag
const $tagInput = document.querySelector('.tag-id');
const $tagList = document.querySelector('.tag-list');

const colors = ['#ff99c8', '#fec8c3', '#fcf6bd', '#d0f4de', '#a9def9', '#c7d0f9', '#e4c1f9'];
const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];
let tags = [];

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
// let li = document.createElement('li');
// $tagList.appendChild()

const setTags = newTags => {
  tags = newTags;
  render();
};

const generateTagId = () => Math.max(...tags.map(tag => tag.id), 0) + 1;

const addTags = content => {
  setTags([{ id: generateTagId(), content }, ...tags]);
};

const removeTag = id => {
  setTags(tags.filter(tag => tag.id !== +id));
};

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

// onchange = e => {
//   const isError = auth.checkDate.checker([...$ul.children].filter(child => child.firstElementChild.checked).length);

// }
// validation
// const $newstudyForm = document.querySelector('.newstudy-form');
// const setErrorMsg = inputName => {
//   if (inputName === 'date-checker') {
//     const formData = new FormData($newstudyForm);
//     document.querySelector('.checkbox-container .error').textContent = formData.has('date-checker')
//       ? ''
//       : '1개이상 체크해주세요';
//   } else {
//     $newstudyForm.querySelector(`input[name = ${inputNmae}] ~ .error`).textContent = ;
//   }
// };
// $newstudyForm.oninput = e => {};
const schema = newstudySchema;
const $newstudyForm = document.querySelector('.newstudy-form');
const $submitBtn = document.querySelector('.submit');
const getErrorMsgByInputName = inputName => schema[inputName].error;
const getIsValidByInputName = inputName => schema[inputName].isValid;
const getIsValid = () => schema.isValid;
const setSchemaValueByInputName = (inputName, value) => {
  schema[inputName].value = value;
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

const validate = throttle(e => {
  const { name, value } = e.target;
  if (name === 'date-checker') {
    const formData = new FormData($newstudyForm);
    setSchemaValueByInputName(name, formData.has('date-checker'));
  } else {
    setSchemaValueByInputName(name, value.trim());
  }
  setErrorMessage(name);
  activateSubmitButton();
}, 300);

$newstudyForm.oninput = validate;
