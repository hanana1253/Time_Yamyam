import { removeActive } from '../utils/helper';

const $pointTotal = document.querySelector('.point__total');
const $tableBody = document.querySelector('.point__history .table__body');
const $loading = document.querySelector('.loading');

const render = ({ total, pointHistory }) => {
  // console.log(total, pointHistory);

  setTimeout(() => {
    removeActive([$loading, document.body]);
  }, 300);

  $pointTotal.textContent = `${total}P`;

  const $fragment = document.createDocumentFragment();

  [...pointHistory].forEach(({ category, date, point }) => {
    const $tr = document.createElement('tr');

    $tr.classList.add('table__body__row');

    $tr.innerHTML = `
      <td><span>${category}</span></td>
      <td><span>${date.slice(0, 10)}</span></td>
      <td class="amount"><span>${point}P</span></td>
    `;
    $fragment.appendChild($tr);
    // console.log(category, date, point);
  });

  $tableBody.appendChild($fragment);
};

export default {
  render,
};
