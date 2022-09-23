import API from './fetch-pics.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  formEl: document.querySelector('#search-form'),
  inputEl: document.querySelector('#search-form > input'),
  buttonEl: document.querySelector('#search-form > button'),
  galleryContainer: document.querySelector('.gallery'),
  observerEl: document.querySelector('.sentinel'),
};

console.dir(refs.formEl);
console.dir(refs.inputEl);
console.dir(refs.buttonEl);
console.dir(refs.galleryContainer);

refs.formEl.addEventListener('submit', onFormSubmit);
refs.galleryContainer.addEventListener('click', onGalleryContainerClick);

function onFormSubmit(event) {
  event.preventDefault();
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
        target="_self"
        rel="nofollow, noreferrer"
        title="Click to enlarge"
        loading="lazy"
        href="${largeImageURL}">
          <img class="gallery__image" src="${webformatURL}" alt="${tags}"/>
          <div class="gallery__descr">
            <p class="gallery__features">likes:<span class="gallery__values"> ${likes}</span></p>
            <p class="gallery__features">views:<span class="gallery__values"> ${views}</span></p>
            <p class="gallery__features">comments:<span class="gallery__values"> ${comments}</span></p>
            <p class="gallery__features">downloads:<span class="gallery__values"> ${downloads}</span></p>
          </div>
        </a>`;
      }
    )
    .join('');
}

function clearMurkup() {
  refs.galleryContainer.innerHTML = '';
}

// click event function
function onGalleryContainerClick(event) {
  console.log('click');
  event.preventDefault();
}

// simpleLightbox
var lightbox = new SimpleLightbox('.gallery a', {
  //   options
  captionDelay: 250,
  captionSelector: 'img',
  captionsData: 'alt',
});

lightbox.refresh();

const onEntry = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && searchQuery !== '') {
      API.fetchPictures().then(images => {
        appendImagesMarkup(images);
      });
    }
  });
};

const observer = new IntersectionObserver(onEntry, {
  rootMargin: '150px',
});

observer.observe(refs.observerEl);
