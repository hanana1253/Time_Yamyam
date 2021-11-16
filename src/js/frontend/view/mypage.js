import { getLevel } from '../utils/helper';

const $userInfoInner = document.querySelector('.user-info__inner');
const $nickname = document.querySelector('.user-info__nickname');
const $level = document.querySelector('.user-info__level');
const $point = document.querySelector('.user-info__point span');

const render = ({ nickname, point, myStudy }) => {
  $userInfoInner.classList.add(`level--${getLevel(point)}`);
  $nickname.textContent = nickname;
  $level.textContent = `레벨 ${getLevel(point)}`;
  $point.textContent = `${point}P`;

  console.log(nickname, point, myStudy);
};

export default {
  render,
};
