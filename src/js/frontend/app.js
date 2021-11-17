import '../../scss/index.scss';

const $cancelBtn = document.querySelector('.cancel');

$cancelBtn.onclick = () => {
  window.location.href = './';
};
