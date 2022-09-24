import PicturesAPI from './fetch-pics.js';
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

refs.formEl.addEventListener('submit', onFormSubmit);
refs.galleryContainer.addEventListener('click', onGalleryContainerClick);

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
  console.log(picturesSerchAPI.query);

  observer.observe(refs.observerEl);

  picturesSerchAPI.resetPage();
  clearMurkup();

  if (picturesSerchAPI.query) {
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
    createImagesMarkup(data.hits)
  );
  lightbox.refresh();
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
