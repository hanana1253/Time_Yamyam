import { WEEKS } from '../utils/helper.js';

export const render = {
  allGroups({ allGroups, userData }) {
    document.querySelector('.all-groups__list').innerHTML = allGroups
      .map(
        studyGroup => `<li class="all-groups__item" data-id="${studyGroup.id}">
                    <figure class="all-groups__image">
                        <img src="${studyGroup.img?.url}" alt="스터디그룹사진" />
                    </figure>
                    <h3 class="all-groups__title">${studyGroup.title}</h3>
                    <p class="all-groups__date">${
                      7 - Math.round((Date.now() - new Date(studyGroup.createDate)) / (24 * 60 * 60 * 1000)) > 1
                        ? `${
                            7 - Math.round((Date.now() - new Date(studyGroup.createDate)) / (24 * 60 * 60 * 1000))
                          }일 뒤 시작`
                        : '오늘 시작'
                    }</p>
                    <span>#Lv.${studyGroup.minLevel}</span>
                    <span>#${studyGroup.duration}주</span>
                    <button class="join" type="button" ${
                      (studyGroup.userList.includes(userData?.id) || studyGroup.minLevel > userData?.level)
                        ? 'disabled'
                        : ''
                    }>참여하기</button>
                </li>`
      )
      .join('');
  },
  myGroups(myGroups) {
    const content = '<ul class="my-groups__list">' + myGroups
      .map(
        myGroup => `<li class="my-groups__item">
                      <figure class="my-groups__image">
                          <img src="${myGroup.img?.url}" alt="스터디그룹사진" />
                      </figure>
                      <h3 class="my-groups__title">${myGroup.title}</h3>
                      <p class="my-groups__day">${myGroup.postingDays.map(day => WEEKS[day].content).join(', ')}</p>
                  </li>`).join('') +  '</ul>';
    [...document.querySelectorAll('.my-groups')].forEach($list => {
      $list.innerHTML = content;
    });
  },
  redirectPage () {
    const content = '<div class="anonymous-page"><a href="/login.html" class="button anonymous">로그인하고 참여해보세요</a></div>';
    [...document.querySelectorAll('.my-groups')].forEach($div => {
      $div.innerHTML = content;
    });
  }
};
