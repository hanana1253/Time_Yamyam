import {teamFeed, myFeed, info, group, postings, users, filterState } from '../store/group.js';
import { WEEKS } from '../utils/helper.js'


let newPostings = postings.filter(posting => filterState.week.contains(posting))
newPostings = newPostings.filter(posting => filterState.day.contains(posting))
newPostings = newPostings.filter(posting => filterState.memeber.contains(posting))

const render = {
  teamFeed() {
    teamFeed += newPostings
      .map(
        posting => `<li class="group-feed__item" data-id="1" data-week="0" data-day="2" data-member="${users.map(user => user.id === posting.author).map(el => el.nickname)[0]}">
                        <figure class="group-feed__image">
                            <img src="${posting.img.url}" alt="이미지" />
                        </figure>
                        <h3 class="group-feed__title">${posting.title}</h3>
                        <p class="group-feed__date">${posting.createDate}</p>
                        <p class="group-feed__author">${users.map(user => user.id === posting.author).map(el => el.nickname)[0]}</p>
                        <div class="group-feed__likes">
                            <div class="likes-number">${posting.likes}</div>
                            <button>
                                <i class="bx bx-heart"></i>
                            </button>
                        </div>
                    </li>`
      )
      .join('');
    document.querySelector('div.group-teamFeed').innerHTML = teamFeed;
  },
  myFeed() {
    myFeed += newPostings
      .map(
        posting => `<li class="group-feed__item" data-id="1" data-week="0" data-day="2" data-member="${users.map(user => user.id === posting.author).map(el => el.nickname)[0]}">
                        <figure class="group-feed__image">
                            <img src="${posting.img.url}" alt="이미지" />
                        </figure>
                        <h3 class="group-feed__title">${posting.title}</h3>
                        <p class="group-feed__date">${posting.createDate}</p>
                        <p class="group-feed__author">${users.map(user => user.id === posting.author).map(el => el.nickname)[0]}</p>
                        <div class="group-feed__likes">
                            <div class="likes-number">${posting.likes}</div>
                            <button>
                                <i class="bx bx-heart"></i>
                            </button>
                        </div>
                        <button class="delete">&times;</button>
                    </li>`
      )
      .join('');
      document.querySelector('div.group-myFeed').innerHTML = myFeed;
  },
  info() {
    info += newPostings
      .map(
        posting => `<div class="group-info__summary">
                        <h3 class="group-info__title">스터디 개요</h3>
                        <button class="group-info__edit hidden">수정</button>
                        <div class="study-info">
                        <div class="study-info__wrap">
                            <span class="study-info__label">스터디 이름</span>
                            <span class="study-info__name">자바스크립트 뿌시기</span>
                        </div>
                        <div class="study-info__wrap">
                            <span class="study-info__label">스터디 설명</span>
                            <p class="study-info__description">화, 목요일마다 자바스크립트 이론 공부할 분 모집합니다.</p>
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
                        ${}
                        </ul>
                        </div>
                        <div class="group-info__description">
                        <h3 class="group-info__title">스터디 인증 상세</h3>
                        <div class="group-info__description">
                        <h4 class="group-info__description--title">인증방법</h4>
                        <p class="group-info__description--desc"></p>
                        </div>
                    </div>`
      )
      .join('');
      document.querySelector('div.group-info').innerHTML = info;
  },
};

export default render;
