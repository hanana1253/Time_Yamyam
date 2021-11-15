import state from '../store/group.js';

const { currentFeed, postings, filterState } = state;



const feedList = {
  teamFeed: '',
  myFeed: '',
  info: '',
};

const render = {
  teamFeed() {
    feedList.teamFeed += postings
      .map(
        posting => `<li class="group-feed__item" data-id="1" data-week="0" data-day="2" data-member="Shawn">
        <figure class="group-feed__image">
            <img src="../images/feedImage.jpeg" alt="" />
        </figure>
        <h3 class="group-feed__title">[필독] 가입하신 분들 인증 방법을 확인하세요</h3>
        <p class="group-feed__date">2021.11.01</p>
        <p class="group-feed__author">작성자 ID</p>
        <div class="group-feed__likes">
            <div class="likes-number">2</div>
            <button>
                <i class="bx bx-heart"></i>
            </button>
        </div>
    </li>`
      )
      .join('');
    document.querySelector('div.group-teamFeed').innerHTML = feedList.teamFeed;
  },
  myFeed() {
    feedList.myFeed += postings
      .map(
        posting => `<li class="group-feed__item" data-id="1" data-week="0" data-day="2" data-member="Shawn">
        <figure class="group-feed__image">
            <img src="../images/feedImage.jpeg" alt="" />
        </figure>
        <h3 class="group-feed__title">[필독] 가입하신 분들 인증 방법을 확인하세요</h3>
        <p class="group-feed__date">2021.11.01</p>
        <p class="group-feed__author">작성자 ID</p>
        <div class="group-feed__likes">
            <div class="likes-number">2</div>
            <button>
                <i class="bx bx-heart"></i>
            </button>
        </div>
        <button class="delete">&times;</button>
    </li>`
      )
      .join('');
  },
  info() {
    feedList.info += postings
      .map(
        postings => ` <div class="group-info__summary">
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
          <li class="mon">월</li>
          <li class="tue">화</li>
          <li class="wed">수</li>
          <li class="thur">목</li>
          <li class="fri">금</li>
          <li class="sat">토</li>
          <li class="sun">일</li>
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
  },
};

export default render;
