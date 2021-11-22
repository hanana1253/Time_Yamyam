import { getLevel, removeActive, WEEKS } from '../utils/helper';
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
        const leftDates = Math.round((new Date(studyGroup.expireDate) - Date.now()) / (24 * 60 * 60 * 1000));
        return `<li class="all-groups__item" data-index="${index}" data-id="${studyGroup.id}">
                    <figure class="all-groups__image">
                        <img src="${studyGroup.img?.url || './images/feedImage.jpeg'}" alt="스터디그룹사진" />
                    </figure>
                    <h3 class="all-groups__title">${studyGroup.title}</h3>
                    <div class="all-groups__detail">
                    <p class="all-groups__date">${leftDates > 1 ? `${leftDates}일 뒤 시작` : '오늘 시작'}</p>
                    <span>#Lv.${studyGroup.minLevel}</span>
                    <span>#${studyGroup.duration}주</span>
                    ${studyGroup.hashtags.map(tag => `<span>#${tag}</span>`).join(' ')}</div>
          
                    <button class="join" type="button" ${shouldDisable ? 'disabled' : ''}>${
          joined ? '신청완료' : isValidLevel ? '참여하기' : '참여불가'
        }</button>
                </li>`;
      })
      .join('');
  },
  myGroups(myGroups) {
    if (myGroups.length === 0) {
      const content =
        '<div class="anonymous-page"><span class="button anonymous newbie">스터디 그룹에 참여해보세요</span></div>';
      [...document.querySelectorAll('.my-groups')].forEach($div => {
        $div.innerHTML = content;
      });
      return;
    }
    const content =
      '<ul class="my-groups__list">' +
      myGroups
        .map(myGroup => {
          return `<li class="my-groups__item">
                      <a href="/group.html?studyId=${myGroup.id}">
                      <figure class="my-groups__image">
                          <img src="${myGroup.img?.url || './images/feedImage.jpeg'}" alt="스터디그룹사진" />
                      </figure>
                      <h3 class="my-groups__title">${myGroup.title}</h3>
                      <div class="my-groups__detail">
                      <p class="my-groups-duration">${
                        myGroup.expireDate.slice(0, 10) + ' ~ ' + myGroup.finishDate.slice(0, 10)
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
    if (!studyGroup) {
      document.querySelector('.study-modal').innerHTML = '';
      document.querySelector('.study-modal').style.zIndex = '-10';
      return;
    }
    const content = `<figure class="study-modal__image">
    <img src="${studyGroup.img?.url || './images/feedImage.jpeg'}" alt="스터디그룹사진" />
</figure>
<div class="study-modal__overview">
<h3 class="study-modal__title">${studyGroup.title}</h3>
<span class="tag">#Lv.${studyGroup.minLevel}</span>
<span class="tag">#${studyGroup.duration}주</span>
${studyGroup.hashtags.map(tag => `<span>${tag}</span>`).join('')}</div>
<p>${studyGroup.description}</p>
<h4 class="study-modal__posting-description">인증 방법</h4>
<p>${studyGroup.postingDescription}</p>
<h4 class="study-modal__notice">꼭 알아주세요!</h4>
<p>기간: ${studyGroup.expireDate.slice(0, 10) + ' ~ ' + studyGroup.finishDate.slice(0, 10)}</p>
<p>인증: ${studyGroup.postingDays.map(day => `<span>${WEEKS[day].content + '요일'}</span>`).join(', ')}</p>
<p>레벨: Lv.${studyGroup.minLevel} 이상</p>
<div class="modal-button"><button class="confirm button" type="button">신청</button><button class="cancel button">나가기</button></div>
`;
    document.querySelector('.study-modal').innerHTML = content;
    document.querySelector('.study-modal').style.zIndex = '9999';
  },
};
