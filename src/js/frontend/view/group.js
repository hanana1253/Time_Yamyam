import { stateFunc } from '../store/group.js';
import { WEEKS, getLevel, removeActive } from '../utils/helper.js';

const filtering = (postings, filterState) => {
  const { group } = stateFunc;
  const userNickname = group.userList.map(user => user.nickname);

  let newPostings = postings.filter(posting => filterState.weeks[posting.weeks]);
  newPostings = newPostings.filter(posting => filterState.days[posting.days]);
  newPostings = newPostings.filter(posting => filterState.member[userNickname.indexOf(posting.author)]);

  return newPostings;
};
const $loading = document.querySelector('.loading');

const render = {
  teamFeed() {
    setTimeout(() => {
      removeActive([$loading, document.body]);
    }, 300);

    const newPostings = filtering(stateFunc.postings, stateFunc.filterState);

    const content = newPostings
      .map(
        (posting, i) => `
            <li class="group-feed__item" data-id="${i + 1}" data-week="${posting.week}" data-day="${
          posting.day
        }" data-member="${posting.author}" data-post="${posting.id}" style="${
          posting.isNoti ? 'background-color: #e9bcd0;' : 'background-color: #f0eeee;'
        }">
                <figure class="group-feed__image">
                    <img src="${posting.img.url ? posting.img.url : '../../images/feedImage.jpeg'}" alt="이미지" />
                </figure>
                <h3 class="group-feed__title">${posting.title}</h3>
                <p class="group-feed__date">${posting.createDate.slice(0, 10)}</p>
                <p class="group-feed__author">${posting.author}</p>
                <div class="group-feed__likes">
                    <div class="likes-number">${posting.likes}</div>
                    <button style="${posting.isNoti ? 'background-color: #e9bcd0;' : 'background-color: #f0eeee;'}">
                        ${
                          posting.likedBy.includes(stateFunc.userInfo.uid)
                            ? '<i class="bx bxs-heart"></i>'
                            : '<i class="bx bx-heart"></i>'
                        }
                    </button>
                </div>
                <button class="modal">자세히</button>
            </li>`
      )
      .join('');

    document.querySelector('ul.group-teamFeed__list').innerHTML = content;

    // const { height } = document.querySelector('ul.group-teamFeed__list');
    // document.querySelector('.swiper-wrapper').setAttribute('height', height);
    // this.filter();
  },
  myFeed() {
    const { userInfo } = stateFunc;
    const newPostings = filtering(stateFunc.postings, stateFunc.filterState).filter(
      post => post.authorUid === userInfo.uid
    );

    // image random 만들기
    const content = newPostings
      .map(
        (posting, i) => `
            <li class="group-feed__item" data-id="${i + 1}" data-week="${posting.week}" data-day="${
          posting.day
        }" data-member="${posting.author}" data-post="${posting.id}">
                <figure class="group-feed__image">
                    <img src="${posting.img.url ? posting.img.url : '../../images/feedImage.jpeg'}" alt="이미지" />
                </figure>
                <h3 class="group-feed__title">${posting.title}</h3>
                <p class="group-feed__date">${posting.createDate.slice(0, 10)}</p>
                <p class="group-feed__author">${posting.author}</p>
                <div class="group-feed__likes">
                    <div class="likes-number">${posting.likes}</div>
                    <button>
                    ${
                      posting.likedBy.includes(stateFunc.userInfo.uid)
                        ? '<i class="bx bxs-heart"></i>'
                        : '<i class="bx bx-heart"></i>'
                    }
                    </button>
                </div>
                <button class="delete">&times;</button>
                <button class="modal">자세히</button>
            </li>`
      )
      .join('');

    document.querySelector('ul.group-myFeed__list').innerHTML = content;

    // const { height } = window.getComputedStyle(document.querySelector('.group-myFeed__list'));
    // console.log(height);
    // document.querySelector('.swiper-wrapper').setAttribute('height', height);
    // console.log(document.querySelector('.swiper-wrapper').getAttribute('height'));
    // this.filter();
  },
  info() {
    const { group, users } = stateFunc;

    const content = `
        <div class="group-info__summary">
            <h3 class="group-info__title">스터디 개요</h3>
            <button class="group-info__edit hidden">수정</button>
            <div class="study-info">
            <div class="study-info__wrap">
                <span class="study-info__label">스터디 이름</span>
                <span class="study-info__name">${group.title}</span>
            </div>
            <div class="study-info__wrap">
                <span class="study-info__label">스터디 설명</span>
                <p class="study-info__description">${group.description}</p>
            </div>
            <div class="study-info__wrap">
                <span class="study-info__label">인증 요일</span>
                <ul class="study-info__days">
                ${group.postingDays.map(day => `<li class="${WEEKS[day].class}">${WEEKS[day].content}</li>`).join('')}
                </ul>
            </div>
            </div>
            </div>
            <div class="group-info__teamList">
            <h3 class="group-info__title">나의 팀원 목록</h3>
            <ul class="group-teamList__list">
            ${users
              .map(
                user => `<li class="group-teamList__member" tabindex="0">
                    <span class="group-teamList__member--nickname">${user.nickname}</span>
                    <span class="group-teamList__member--level">Lv.${getLevel(+user.point)}</span>
                </li>`
              )
              .join('')}
            </ul>
            </div>
            <div class="group-info__description">
            <h3 class="group-info__title">스터디 인증 상세</h3>
            <div class="group-info__description">
            <h4 class="group-info__description--title">인증방법</h4>
            <p class="group-info__description--desc"></p>
            </div>
        </div>`;

    [...document.querySelectorAll('div.group-info')].forEach(info => {
      info.innerHTML = content;
    });
  },
  filter() {
    const { group, users } = stateFunc;
    const durationArr = Array.from({ length: group.duration }, (_, i) => i);
    const { postingDays } = group;

    const week = `${durationArr
      .map(
        duration =>
          `<label><i class="bx bx-check"></i><input type="checkbox" value="weeks-${duration}" />${
            duration + 1
          }주차</label>`
      )
      .join('')}`;

    const day = `${postingDays
      .map(
        day =>
          `<label><i class="bx bx-check"></i><input type="checkbox" value="days-${day}" />${WEEKS[day].content}</label>`
      )
      .join('')}`;

    const member = `${users
      .map(
        (user, i) =>
          `<label> <i class="bx bx-check"></i><input type="checkbox" value="member-${i}" />${user.nickname}</label>`
      )
      .join('')}`;

    document.querySelector('.filters-weeks__checkbox').innerHTML = week;
    document.querySelector('.filters-days__checkbox').innerHTML = day;
    document.querySelector('.filters-member__checkbox').innerHTML = member;
    // console.log(week);
  },
};

export default render;
