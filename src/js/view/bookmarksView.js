import View from "./View"
import icons from '../../img/icons.svg';

class BookmarksView extends View {
    _parentElement = document.querySelector('.bookmarks__list')
    _errorMesssage = "No bookmarks yet. Find a nice recipe anh bookmark it"
    _message = ""

    addHandlerRender(handler) {
        window.addEventListener('load', handler)
    }

    _generateMarkup() {
        return this._data.map((result) => this._generateMarkupPreview(result)).join('')
    }

    _generateMarkupPreview(result) {
        return `
        <li class="preview">
            <a class="preview__link preview__link--active" href="#${result.id}">
              <figure class="preview__fig">
                <img src="${result.image}" alt="${result.title}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${result.title}</h4>
                <p class="preview__publisher">${result.publisher}</p>
              </div>
            </a>
          </li>
            `
    }
}

export default new BookmarksView()