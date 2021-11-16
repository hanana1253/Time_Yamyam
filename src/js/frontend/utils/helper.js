const WEEKS = [
  { class: 'sun', content: '일' },
  { class: 'mon', content: '월' },
  { class: 'tue', content: '화' },
  { class: 'wed', content: '수' },
  { class: 'thur', content: '목' },
  { class: 'fri', content: '금' },
  { class: 'sat', content: '토' },
];

const throttle = (callback, delay) => {
  let timerId;
  return event => {
    if (timerId) return;
    timerId = setTimeout(
      () => {
        callback(event);
        timerId = null;
      },
      delay,
      event
    );
  };
};

const getLevel = point => {
  if (point <= 50) return '1';
  if (point <= 65) return '2';
  if (point <= 100) return '3';
  if (point <= 150) return '4';
  if (point <= 225) return '5';
  if (point <= 335) return '6';
  if (point <= 670) return '7';
  if (point <= 1340) return '8';
  if (point <= 2680) return '9';
  if (point >= 2681) return 'MAX';
};

export { throttle, WEEKS, getLevel };
