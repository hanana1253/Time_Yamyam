const $groupList = document.querySelector('.group-list');
const render = ({ studyGroup }) => {
  $groupList.innerHTML = studyGroup
    .map(({ title, id }) => `<option class="group-selected" value="${title}" data-id="${id}">${title}</option>`)
    .join('');
};

export default {
  render,
};
