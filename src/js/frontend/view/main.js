import { getLevel, WEEKS, removeActive } from '../utils/helper';
const $loading = document.querySelector('.loading');

export const render = {
  allGroups({ allGroups, userData }) {
    setTimeout(() => {
      removeActive([$loading, document.body]);
    }, 300);
    document.querySelector('.all-groups__list').innerHTML = allGroups
      .map((studyGroup, index) => {
        const joined = studyGroup.userList.includes(userData?.id);
        const isValidLevel = studyGroup.minLevel <= getLevel(userData?.point);
        const shouldDisable = joined || !isValidLevel;
        const leftDates = 7 - Math.round((Date.now() - new Date(studyGroup.createDate)) / (24 * 60 * 60 * 1000));
        return `<li class="all-groups__item" data-index="${index}">
                    <figure class="all-groups__image">
                        <img src="${studyGroup.img?.url || './images/feedImage.jpeg'}" alt="스터디그룹사진" />
                    </figure>
                    <h3 class="all-groups__title">${studyGroup.title}</h3>
                    <div class="all-groups__detail">
                    <p class="all-groups__date">${leftDates > 1 ? `${leftDates}일 뒤 시작` : '오늘 시작'}</p>
                    <span>#Lv.${studyGroup.minLevel}</span>
                    <span>#${studyGroup.duration}주</span></div>
                    <button class="join" type="button" ${shouldDisable ? 'disabled' : ''}>${
          joined ? '신청완료' : isValidLevel ? '참여하기' : '참여불가'
        }</button>
                </li>`;
      })
      .join('');
  },
  myGroups(myGroups) {
    const content =
      '<ul class="my-groups__list">' +
      myGroups
        .map(myGroup => {
          const expireDate = new Date(myGroup.expireDate);
          const finishDate = new Date(myGroup.finishDate);
          return `<li class="my-groups__item">
                      <a href="/group.html?studyId=${myGroup.id}">
                      <figure class="my-groups__image">
                          <img src="/images/feedImage.jpeg" alt="스터디그룹사진" />
                      </figure>
                      <h3 class="my-groups__title">${myGroup.title}</h3>
                      <div class="my-groups__detail">
                      <p class="my-groups-duration">${
                        expireDate.toISOString().slice(0, 10) + ' ~ ' + finishDate.toISOString().slice(0, 10)
                      }</p>
                      <p class="my-groups__day">${myGroup.postingDays
                        .map(day => WEEKS[day].content + '요일')
                        .join(', ')}</p>
                        </div>
                        </a>
                  </li>`;
        })
        .join('') +
      '</ul>';
    [...document.querySelectorAll('.my-groups')].forEach($list => {
      $list.innerHTML = content;
    });
  },
  redirectPage() {
    const content =
      '<div class="anonymous-page"><a href="/login.html" class="button anonymous">로그인하고 참여해보세요</a></div>';
    [...document.querySelectorAll('.my-groups')].forEach($div => {
      $div.innerHTML = content;
    });
  },
  modal(studyGroup) {
    const content = `<figure class="study-modal__image">
    <img src="${studyGroup.img?.url || './images/feedImage.jpeg'}" alt="스터디그룹사진" />
</figure>
<h3 class="study-modal__title">${studyGroup.title}</h3>
<div class="study-modal__detail">
<span>#Lv.${studyGroup.minLevel}</span>
<span>#${studyGroup.duration}주</span></div>
<button class="join" type="button" >참여하기</button><button class="cancel">취소</button>`;
    document.querySelector('.study-modal').innerHTML = content;
  },
};
