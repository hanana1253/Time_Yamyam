const sheet = document.createElement('style');
const $rangeInput = document.querySelector('.range-bar__input');
const prefs = ['webkit-slider-runnable-track', 'moz-range-track', 'ms-track'];

// const $slider = document.querySelector('.range-bar__input');
const $newValue = document.querySelector('.new-value');
const $rangeBar = document.querySelector('.range-bar');
const $levelOutput = document.querySelector('.level-output');
$rangeBar.oninput = () => {
  $levelOutput.value = $rangeInput.value;
};
// $newValue.textContent = $slider.value;
// $slider.oninput = () => {
//   $newValue.textContent = this.value;
// };
// $slider.addEventLister('mousemove', () => {
//   const inputValue = $slider.value;
//   const inputColor = `background-image: linear-gradient(90deg, rgb(117, 252, 117) ${inputValue}%, rgb(214, 214, 214) ${inputValue}%);`;
//   $slider.style.background = inputColor;
// });
