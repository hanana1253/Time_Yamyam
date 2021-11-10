// DOM Nodes
const $fileUploader = document.querySelector('.chosen-image');

// Functions
const uploadFile = e => {
  const reader = new FileReader();
  const button = document.querySelector('.upload-btn');

  // onload는 파일이 성공적으로 load 되었을 경우 실행하는 이벤트 핸들러.
  reader.onload = event => {
    const img = document.querySelector('.upload-img');
    img.setAttribute('src', event.target.result);
    img.setAttribute('width', 400);
    img.setAttribute('height', 650);
    console.log(event.target.result);
  };
  reader.readAsDataURL(e.target.files[0]);
  console.log(e.target.files[0].log);
  button.setAttribute('data-label', e.target.files[0].name);
};

// Event bindings
$fileUploader.addEventListener('input', uploadFile);
