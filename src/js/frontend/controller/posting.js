// DOM Nodes
const $fileUploader = document.querySelector('.chosen-image');
const $uploadButton = document.querySelector('.upload-btn');
const $imageTitle = document.querySelector('.image-title');
const $uploadImg = document.querySelector('.upload-img');
const $hashTag = document.querySelectorAll('.hash-tag');
// const splitArray = $hashTag.split(' ');
const linkedTag = '';
// Functions
const uploadFile = e => {
  const reader = new FileReader();
  // onload는 파일이 성공적으로 load 되었을 경우 실행하는 이벤트 핸들러.
  reader.onload = event => {
    $uploadImg.setAttribute('src', event.target.result);
  };
  reader.readAsDataURL(e.target.files[0]);
  // $uploadButton.setAttribute('data-label', e.target.files[0].name);
  // $imageTitle.textContent = e.target.files[0].name;
};

/*
 * drag and drop
 *@param {HTMLElement} dropZoneElement
 *@param {File} file
 */

function updateThumbnail(dropZoneElement, file) {
  const $thumbnailElement = dropZoneElement.querySelector('.drop-zone__thumb');

  // First time - remove the prompt
  if (dropZoneElement.querySelector('.drop-zone__prompt')) {
    dropZoneElement.querySelector('.drop-zone__prompt').remove();
  }

  // First time - create thumbnail element
  // if (!$thumbnailElement) {
  //   $thumbnailElement = document.createElement('div');
  //   $thumbnailElement.classList.add('drop-zone__thumb');
  //   dropZoneElement.appendChild($thumbnailElement);
  // }

  // file is proper file object
  // $thumbnailElement.dataset.label = file.name;

  // show thumbnail for image files
  if (file.type.startsWith('image/')) {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = event => {
      // $thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
      $uploadImg.setAttribute('src', event.target.result);
    };
  } else {
    // $thumbnailElement.style.backgroundImage = null;
  }
}
// Event bindings
$fileUploader.addEventListener('input', uploadFile);

// drag and drop
document.querySelectorAll('.drop-zone__input').forEach(inputElement => {
  const dropZoneElement = inputElement.closest('.drop-zone');

  dropZoneElement.addEventListener('click', () => {
    inputElement.click();
  });

  inputElement.addEventListener('change', () => {
    if (inputElement.file.length) {
      updateThumbnail(dropZoneElement, inputElement.files[0]);
    }
  });
  // drag over했을때 border change됨
  dropZoneElement.addEventListener('dragover', e => {
    e.preventDefault();
    dropZoneElement.classList.add('drap-zone--over');
  });

  // dragleave or dragend remove the class which changes the border style
  ['dragleave', 'dragend'].forEach(type => {
    dropZoneElement.addEventListener(type, () => {
      dropZoneElement.classList.remove('drop-zone--over');
    });
  });

  dropZoneElement.addEventListener('drop', e => {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
      // actual file lists(e~) signing in inputElement
      inputElement.files = e.dataTransfer.files;
      updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
    }
    // console.log(e.dataTransfer.files);

    dropZoneElement.classList.remove('drop-zone--over');
  });
});

// hash-tag
