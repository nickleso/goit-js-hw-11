import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const KEY = '30122365-dbc077ba4413dccabf9c250c7';
const BASE_URL = 'https://pixabay.com/api/';

export default class PicturesAPI {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchPictures() {
    const url = `${BASE_URL}?key=${KEY}&q=${this.searchQuery}&page=${this.page}&per_page=40&image_type=photo&orientation=horizontal&safesearch=true`;
    console.log(url);
    const { data } = await axios.get(url);
    console.log('axios', data);
    return data;
  }

  // fetchPictures() {
  //   const url = `${BASE_URL}?key=${KEY}&q=${this.searchQuery}&page=${this.page}&per_page=40&image_type=photo&orientation=horizontal&safesearch=true`;
  //   console.log(url);

  //   return fetch(url)
  //     .then(response => {
  //       if (!response.ok) {
  //         Notify.failure(
  //           'Sorry, there are no images matching your search query. Please try again.',
  //           {
  //             position: 'right-top',
  //             fontSize: '12px',
  //           }
  //         );
  //       }

  //       return response.json();
  //     })
  //     .then(data => {
  //       if (!data.hits.length) {
  //         Notify.failure(
  //           'Sorry, there are no images matching your search query. Please try again.',
  //           {
  //             position: 'right-top',
  //             fontSize: '12px',
  //           }
  //         );
  //       } else {
  //         const totalResults = data.totalHits;
  //         Notify.success(`Hooray! We found ${totalResults} images.`, {
  //           position: 'right-top',
  //           fontSize: '14px',
  //         });

  //         return data.hits;
  //       }
  //     });
  // }

  icrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
