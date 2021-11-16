const $groupList = document.querySelector('.group-list');
const render = ({ studyGroup }) => {
  $groupList.innerHTML = studyGroup.map(({ title }) => `<option value="${title}">${title}</option>`).join('');
};

export default {
  render,
};
