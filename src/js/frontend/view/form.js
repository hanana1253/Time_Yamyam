const $groupList = document.querySelector('.group-list');
const render = ({ studyGroup }) => {
  $groupList.innerHTML = studyGroup.filter(({status}) => status === 'started')
    .map(({ title, id }) => `<option class="group-selected" value="${title}" data-id="${id}">${title}</option>`)
    .join('');
};

export default {
  render,
};
