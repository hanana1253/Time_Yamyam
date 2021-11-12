const sheet = document.createElement('style');
const $rangeInput = document.querySelector('.range-bar__input');
const $slider = document.querySelector('.range-bar__input');
const $newValue = document.querySelector('.new-value');
const $rangeBar = document.querySelector('.range-bar');
const $levelOutput = document.querySelector('.level-output');
const $valueSpan = document.querySelector('.value-span');

$rangeBar.oninput = () => {
  $levelOutput.value = $rangeInput.value;
  $valueSpan.innerHTML = $levelOutput;
  console.log($levelOutput.value);
};
// $newValue.textContent = $slider.value;
// $slider.oninput = () => {
//   $newValue.textContent = this.value;
// };
$slider.addEventLister('mousemove', () => {
  const inputValue = $slider.value;
  const inputColor = `background-image: linear-gradient(90deg, rgb(117, 252, 117) ${inputValue}%, rgb(214, 214, 214) ${inputValue}%);`;
  $slider.style.background = inputColor;
});
