import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseConfig } from '../utils/firebaseConfig.js';
import store from '../store/posting.js';
import view from '../view/form.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth();

window.addEventListener('DOMContentLoaded', () => {
  onAuthStateChanged(auth, async user => {
    if (user) {
      try {
        const { data } = await store.fetchStudyGroupData(user);
        store.setStudyGroupInfo(data);
        view.render(store.getStudyGroupData());
      } catch (error) {
        console.error(error);
      }
    } else {
      window.location.href = '/';
      console.error('사용자정보없음');
    }
  });
});

// drag and drop
function updateThumbnails(dropZoneElement, file) {
  // let thumbnailElement = dropZoneElement.querySelector('.drop-zone__thumb');

  // first time remove the prompt
  if (dropZoneElement.querySelector('.drop-zone__prompt')) {
    dropZoneElement.querySelector('.drop-zone__prompt').remove();
  }

  const thumbnailElement = document.createElement('div');
  thumbnailElement.classList.add('drop-zone__thumb');
  dropZoneElement.appendChild(thumbnailElement);

  // bring or set file name
  thumbnailElement.dataset.label = file.name;

  // show thumbnails for image files
  if (file.type.startsWith('image/')) {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
    };
  } else {
    thumbnailElement.style.backgroundImage = null;
  }
}

// Event bindings

/*
 * drag and drop
 *@param {HTMLElement} dropZoneElement
 *@param {File} file
 */
document.querySelectorAll('.drop-zone__input').forEach(inputElement => {
  // go up till they find drop zone element
  const dropZoneElement = inputElement.closest('.drop-zone');

  dropZoneElement.addEventListener('click', () => {
    inputElement.click();
  });

  inputElement.addEventListener('change', () => {
    [...inputElement.files].forEach(file => updateThumbnails(dropZoneElement, file));
  });

  // whenever the user drag over the image
  dropZoneElement.addEventListener('dragover', e => {
    e.preventDefault();
    dropZoneElement.classList.add('drop-zone--over');
  });

  ['dragleave', 'dragend'].forEach(type => {
    dropZoneElement.addEventListener(type, () => {
      dropZoneElement.classList.remove('drop-zone--over');
    });
  });
  dropZoneElement.addEventListener('click', () => {});

  dropZoneElement.addEventListener('drop', e => {
    e.preventDefault();
    [...e.dataTransfer.files].forEach(file => updateThumbnails(dropZoneElement, file));
    dropZoneElement.classList.remove('drop-zone--over');
  });
});

// validation check
const $approvalTitle = document.querySelector('.approval-title');
const $submitBtn = document.querySelector('.submit');
const $errorMsg = document.querySelector('.error');
const $form = document.querySelector('form');
$approvalTitle.oninput = e => {
  $submitBtn.disabled = !e.target.value.trim();
  $errorMsg.textContent = e.target.value.trim() ? '' : '인증글 제목을 선택해주세요';
};

$form.onkeydown = e => {
  if (e.key !== 'Enter' || e.target.name === 'text-content') return;
  e.preventDefault();
};
