import { WEEKS } from '../utils/helper.js';

export const render = {
  allGroups(allGroups) {
    document.querySelector('.all-groups__list').innerHTML = allGroups
      .map(
        studyGroup => `<li class="all-groups__item" data-id="${studyGroup.id}">
                    <figure class="all-groups__image">
                        <img src="${studyGroup.img?.url}" alt="스터디그룹사진" />
                    </figure>
                    <h3 class="all-groups__title">${studyGroup.title}</h3>
                    <span class="all-groups__date">${
                      7 - Math.round((Date.now() - new Date(studyGroup.createDate)) / (24 * 60 * 60 * 1000))
                    }일 뒤 시작</span>
                    <ul class="all-groups__day">${studyGroup.postingDays.map(day => `<li data-day="${day}">${WEEKS[day].content}</li>`).join('')}</ul>
                    <button class="join" type="button" ${studyGroup.userList.includes('hanana1253')? "disabled":""}>참여하기</button>
                </li>`
      )
      .join('');
  },
  myGroups(myGroups) {
    const content = myGroups
    .map(
      myGroup => `<li class="my-groups__item">
                  <figure class="my-groups__image">
                      <img src="${myGroup.img?.url}" alt="스터디그룹사진" />
                  </figure>
                  <h3 class="my-groups__title">${myGroup.title}</h3>
                  <p class="my-groups__day">${myGroup.postingDays.map(day => WEEKS[day].content).join(', ')}</p>
              </li>`
    )
    .join('');
    [... document.querySelectorAll('.my-groups__list')].forEach($list => {
      $list.innerHTML = content;
    })
    },
};
