import '../../scss/index.scss';
import './controller/nav';

const $cancelBtn = document.querySelector('.cancel');

$cancelBtn.onclick = () => {
  window.location.href = './';
};
