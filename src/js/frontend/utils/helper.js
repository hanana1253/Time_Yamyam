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

export { throttle, WEEKS };
