import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseConfig } from '../utils/firebaseConfig.js';
import store from '../store/posting.js';
import view from '../view/form.js';

/*
 *@param {HTMLElement} dropZoneElement
 *@param {File} file
 */

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const swiper = new Swiper('.swiper', {
  // Optional parameters
  direction: 'horizontal',
  loop: true,
  a11y: {
    prevSlideMessage: 'Previous slide',
    nextSlideMessage: 'Next slide',
  },
});
const $swiper = document.querySelector('.swiper').swiper;

const $approvalTitle = document.querySelector('.approval-title');
const $submitBtn = document.querySelector('.submit');
const $errorMsg = document.querySelector('.error');
const $form = document.querySelector('form');
const $postingTitle = document.querySelector('.posting-title');
const $notice = document.querySelector('.notice');
const $cancelBtn = document.querySelector('.cancel');

// Functions --------------------------------------------
function updateThumbnails(dropZoneElement, file) {
  if (dropZoneElement.querySelector('.drop-zone__prompt')) {
    dropZoneElement.querySelector('.drop-zone__prompt').remove();
  }

  const thumbnailElement = document.createElement('div');
  thumbnailElement.classList.add('drop-zone__thumb');
  dropZoneElement.appendChild(thumbnailElement);

  thumbnailElement.dataset.label = file.name;

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

// Event bindings----------------------------
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

[...document.querySelectorAll('.drop-zone__input')].forEach(inputElement => {
  const dropZoneElement = inputElement.closest('.drop-zone');

  dropZoneElement.addEventListener('click', () => {
    inputElement.click();
  });

  inputElement.addEventListener('change', () => {
    [...inputElement.files].forEach(file => updateThumbnails(dropZoneElement, file));
  });

  dropZoneElement.addEventListener('dragover', e => {
    e.preventDefault();
    dropZoneElement.classList.add('drop-zone--over');
  });

  ['dragleave', 'dragend'].forEach(type => {
    dropZoneElement.addEventListener(type, () => {
      dropZoneElement.classList.remove('drop-zone--over');
    });
  });
  dropZoneElement.addEventListener('drop', e => {
    e.preventDefault();
    [...e.dataTransfer.files].forEach(file => updateThumbnails(dropZoneElement, file));
    dropZoneElement.classList.remove('drop-zone--over');
  });
});

$approvalTitle.oninput = e => {
  $submitBtn.disabled = !e.target.value.trim();
  $errorMsg.textContent = e.target.value.trim() ? '' : '인증글 제목을 선택해주세요';
};

$notice.oninput = e => {
  $postingTitle.textContent = e.target.checked ? '공지 글을 입력해주세요' : '인증 글을 입력해주세요';
};

$form.onkeydown = e => {
  if (e.key !== 'Enter' || e.target.name === 'text-content') return;
  e.preventDefault();
};

$cancelBtn.onclick = () => {
  window.location.href = './';
};

// send data to server-----------------------------
$form.onsubmit = e => {
  e.preventDefault();
  const newPosting = {};
  const selectedId = $form.querySelector('.group-selected').dataset.id;
  newPosting.isNoti = $form.querySelector('.notice').checked;
  newPosting.title = $form.querySelector('.approval-title').value;
  newPosting.description = $form.querySelector('.text-content').value;
  newPosting.url = $form.querySelector('.url').value;
  const userUid = auth.currentUser.uid;
  axios.post(`/study/${selectedId}/posting`, { userUid, newPosting });
  // query string으로 study id 보내기
  window.location.href = '/group.html';
};
