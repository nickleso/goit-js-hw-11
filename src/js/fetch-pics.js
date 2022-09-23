import { Notify } from 'notiflix/build/notiflix-notify-aio';

const KEY = '30122365-dbc077ba4413dccabf9c250c7';
const BASE_URL = 'https://pixabay.com/api/';

function fetchPictures(name) {
  const url = `${BASE_URL}?key=${KEY}&q=${name}&per_page=40&image_type=photo&orientation=horizontal&safesearch=true`;
  console.log(url);

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
          {
            position: 'right-top',
            fontSize: '12px',
          }
        );
      }

      return response.json();
    })
    .then(data => {
      if (data.hits.length === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.',
          {
            position: 'right-top',
            fontSize: '12px',
          }
        );
      } else {
        const totalResults = data.totalHits;
        Notify.success(`Hooray! We found ${totalResults} images.`, {
          position: 'right-top',
          fontSize: '14px',
        });

        return data.hits;
      }
    });
}

export default { fetchPictures };
