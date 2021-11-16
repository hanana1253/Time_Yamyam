import { postingSchema } from '../utils/schema.js';
// drag and drop
function updateThumbnails(dropZoneElement, file) {
  // let thumbnailElement = dropZoneElement.querySelector('.drop-zone__thumb');

  // first time remove the prompt
  if (dropZoneElement.querySelector('.drop-zone__prompt')) {
    dropZoneElement.querySelector('.drop-zone__prompt').remove();
  }

  const thumbnailElement = document.createElement('div');
  thumbnailElement.classList.add('drop-zone__thumb');
  dropZoneElement.appendChild(thumbnailElement);

  // bring or set file name
  thumbnailElement.dataset.label = file.name;

  // show thumbnails for image files
  if (file.type.startsWith('image/')) {
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = () => {
      thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
    };
  } else {
    thumbnailElement.style.backgroundImage = null;
  }
}

// Event bindings

/*
 * drag and drop
 *@param {HTMLElement} dropZoneElement
 *@param {File} file
 */
document.querySelectorAll('.drop-zone__input').forEach(inputElement => {
  // go up till they find drop zone element
  const dropZoneElement = inputElement.closest('.drop-zone');

  dropZoneElement.addEventListener('click', () => {
    inputElement.click();
  });

  inputElement.addEventListener('change', () => {
    [...inputElement.files].forEach(file => updateThumbnails(dropZoneElement, file));
  });

  // whenever the user drag over the image
  dropZoneElement.addEventListener('dragover', e => {
    e.preventDefault();
    dropZoneElement.classList.add('drop-zone--over');
  });

  ['dragleave', 'dragend'].forEach(type => {
    dropZoneElement.addEventListener(type, () => {
      dropZoneElement.classList.remove('drop-zone--over');
    });
  });
  dropZoneElement.addEventListener('click', () => {});

  dropZoneElement.addEventListener('drop', e => {
    e.preventDefault();
    [...e.dataTransfer.files].forEach(file => updateThumbnails(dropZoneElement, file));
    dropZoneElement.classList.remove('drop-zone--over');
  });
});
