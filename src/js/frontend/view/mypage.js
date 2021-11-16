import { getLevel, WEEKS } from '../utils/helper';

const $userInfoInner = document.querySelector('.user-info__inner');
const $nickname = document.querySelector('.user-info__nickname');
const $level = document.querySelector('.user-info__level');
const $point = document.querySelector('.user-info__point span');
const $inprogressStudy = document.querySelector('.inprogress-study');
const $waitingStudy = document.querySelector('.waiting-study');
const $closeStudy = document.querySelector('.close-study');

const render = ({ nickname, point, myStudy }) => {
  $userInfoInner.classList.add(`level--${getLevel(point)}`);
  $nickname.textContent = nickname;
  $level.textContent = `레벨 ${getLevel(point)}`;
  $point.textContent = `${point}P`;

  console.log(nickname, point, myStudy);

  [
    [$inprogressStudy, 'started'],
    [$waitingStudy, 'ready'],
    [$closeStudy, 'finished'],
  ].forEach(([$container, currentStatus]) => {
    const filterArray = myStudy.filter(({ status }) => status === currentStatus);

    if (!filterArray.length) return;

    $container.innerHTML = filterArray
      .map(
        ({ title, description, postingDays }) => `
          <li>
            <a href="#">
              <div class="study-info">
                <div class="study-info__wrap">
                  <span class="study-info__label">스터디 이름</span>
                  <span class="study-info__name">${title}</span>
                </div>
                <div class="study-info__wrap">
                  <span class="study-info__label">스터디 설명</span>
                  <p class="study-info__description">${description}</p>
                </div>
                <div class="study-info__wrap">
                  <span class="study-info__label">인증 요일</span>
                  <ul class="study-info__days">
                    ${postingDays.map(day => `<li class="${WEEKS[day].class}">${WEEKS[day].content}</li>`).join('')}
                  </ul>
                </div>
              </div>
            </a>
          </li>`
      )
      .join('');
  });
};

export default {
  render,
};
