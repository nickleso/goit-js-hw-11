import PicturesAPI from './fetch-pics';
import Markup from './images-markup';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  formEl: document.querySelector('#search-form'),
  inputEl: document.querySelector('#search-form > input'),
  galleryContainer: document.querySelector('.gallery'),
  observerEl: document.querySelector('.sentinel'),
};

refs.formEl.addEventListener('submit', onFormSubmit);

function onFormSubmit(event) {
  event.preventDefault();
  searchPicturers();
}

const picturesSerchAPI = new PicturesAPI();

// search function
function searchPicturers() {
  if (!refs.inputEl.value.trim()) {
    return;
  }

  picturesSerchAPI.query = refs.inputEl.value.trim();
  observer.observe(refs.observerEl);
  picturesSerchAPI.resetPage();
  clearMurkup();

  picturesSerchAPI
    .fetchPictures(picturesSerchAPI.query)
    .then(data => {
      if (!data.hits.length) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
          {
            position: 'right-top',
            fontSize: '12px',
          }
        );
        return;
      }

      appendImagesMarkup(data);
      const totalResults = data.totalHits;
      Notify.success(`Hooray! We found ${totalResults} images.`, {
        position: 'right-top',
        fontSize: '14px',
      });
    })

    .catch(onFetchError);
}

function onFetchError() {
  error => {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
      {
        position: 'right-top',
        fontSize: '12px',
      }
    );
  };
}

// markup functions
function appendImagesMarkup(data) {
  refs.galleryContainer.insertAdjacentHTML(
    'beforeend',
    Markup.createImagesMarkup(data.hits)
  );
  lightbox.refresh();
}

function clearMurkup() {
  refs.galleryContainer.innerHTML = '';
}

// simpleLightbox
var lightbox = new SimpleLightbox('.gallery a', {
  //   options
  captionDelay: 250,
  captionSelector: 'img',
  captionsData: 'alt',
});

// intersection observer
const onEntry = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.boundingClientRect.bottom > 300) {
      picturesSerchAPI.icrementPage();

      picturesSerchAPI.fetchPictures().then(images => {
        appendImagesMarkup(images);
        lightbox.refresh();
      });
    }
  });
};

const observer = new IntersectionObserver(onEntry, {
  rootMargin: '150px',
});
