function createImagesMarkup(image) {
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

export default { createImagesMarkup };
