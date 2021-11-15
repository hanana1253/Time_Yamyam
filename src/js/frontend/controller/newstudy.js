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

// auth
const auth = {
  studyName: {
    checker(name) {
      return name.length <= 7;
    },

    alert: '스터디 이름을 입력해주세요',
    completed: false,
  },
  hashTag: {
    checker(tag) {
      return tag.length <= 20;
    },
    alert: '태그는 20개까지 입력이 가능합니다',
    completed: false,
  },
  checkDate: {
    checker(checked) {},
    alert: '인증 요일을 체크해주세요',
    completed: false,
  },
  proveMethod: {
    checker(text) {
      return text.length > 0 && text.length < 300;
    },
    alert: '인증 방법을 적어주세요',
    completed: false,
  },
};
