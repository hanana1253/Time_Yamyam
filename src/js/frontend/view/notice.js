import { removeActive } from '../utils/helper';

const $tableBody = document.querySelector('.noti__contents .table__body');
const $loading = document.querySelector('.loading');

const render = ({ notiHistory }) => {
  console.log(notiHistory);

  setTimeout(() => {
    removeActive([$loading, document.body]);
  }, 300);

  const $fragment = document.createDocumentFragment();

  notiHistory.forEach(({ date, msg }) => {
    const $tr = document.createElement('tr');

    $tr.classList.add('table__body__row');

    $tr.innerHTML = `
      <td><span>${msg}</span></td>
      <td class="right"><span>${date.slice(0, 10)}</span></td>
    `;

    $fragment.appendChild($tr);
  });

  $tableBody.appendChild($fragment);
};

export default {
  render,
};
