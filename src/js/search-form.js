import API from './fetch-pics.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  formEl: document.querySelector('#search-form'),
  inputEl: document.querySelector('#search-form > input'),
  buttonEl: document.querySelector('#search-form > button'),
  galleryContainer: document.querySelector('.gallery'),
};

console.dir(refs.formEl);
console.dir(refs.inputEl);
console.dir(refs.buttonEl);
console.dir(refs.galleryContainer);

// refs.inputEl.addEventListener('input', onInputValue);
refs.formEl.addEventListener('submit', onFormSubmit);

// function onInputValue() {
//   console.log(refs.inputEl.value);
// }

function onFormSubmit(event) {
  event.preventDefault();
  console.log('submit');
  searchPicturers();
}

// search function
function searchPicturers() {
  clearMurkup();

  const searchQuery = refs.inputEl.value.trim();
  console.log(searchQuery);

  if (searchQuery) {
    API.fetchPictures(searchQuery).then(appendImagesMarkup).catch(onFetchError);
  } else {
    Notify.info('Type something.', {
      position: 'right-top',
      fontSize: '14px',
    });
  }
}

function onFetchError() {
  error => {
    console.log(error);
    throw new Error(response.status);
  };
}

// function successSearchMessage() {
//   return Notify.success('Hooray! We found ${totalHits} images.');
// }

// markup functions
function appendImagesMarkup(image) {
  refs.galleryContainer.insertAdjacentHTML(
    'beforeend',
    createImagesMarkup(image)
  );
}

function createImagesMarkup(image) {
  // console.log(image);
  return image
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a
        class="gallery__item"
        rel="nofollow, noreferrer"
        title="Click to enlarge"
        loading="lazy"
        href="${largeImageURL}">
          <img class="gallery__image" src="${webformatURL}" alt="${tags}"/>
          <div class="gallery__descr">
            <p class="gallery__features">likes:<span class="gallery__values"> ${likes}</span></p>
            <p class="gallery__features">views:<span class="gallery__values> ${views}</span></p>
            <p class="gallery__features">comments:<span class="gallery__values> ${comments}</span></p>
            <p class="gallery__features">downloads:<span class="gallery__values> ${downloads}</span></p>
          </div>
        </a>`;
      }
    )
    .join('');
}

function clearMurkup() {
  refs.galleryContainer.innerHTML = '';
}

// lightbox
var lightbox = new SimpleLightbox('.gallery a', {
  //   options
  captionDelay: 250,
  captionSelector: 'img',
  captionsData: 'alt',
});
