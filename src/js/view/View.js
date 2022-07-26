import icons from '../../img/icons.svg';

export default class View {
  _data

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError()
    this._data = data
    const markup = this._generateMarkup()
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  update(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError()

    this._data = data;
    const newMarkup = this._generateMarkup()

    const newDOM = document.createRange().createContextualFragment(newMarkup)
    const newElements = newDOM.querySelectorAll('*')
    console.log(newElements)
    const curElements = this._parentElement.querySelectorAll('*')
    //Create dom ảo rồi ss với dom thật xem thằng nào thay đổi thì update
    newElements.forEach((newElement, index) => {
      const curElement = curElements[index];

      // update text
      if (!newElement.isEqualNode(curElement) && newElement.firstChild?.nodeValue.trim() !== '') {
        curElement.textContent = newElement.textContent;
      }

      // Update attribute
      if (!newElement.isEqualNode(curElement)) {
        Array.from(newElement.attributes).forEach(att => {
          curElement.setAttribute(att.name, att.value)
        })
      }
    })
  }

  renderError() {
    const markup = `
          <div class="error">
              <div>
                <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${this._errorMesssage}</p>
          </div>`
    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  renderMessage() {
    const markup = `
          <div class="error">
              <div>
                <svg>
                  <use href="${icons}#icon-smile"></use>
                </svg>
              </div>
              <p>${this._message}</p>
          </div>`
    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  _clear() {
    this._parentElement.innerHTML = ''
  }

  renderSpinner = () => {
    const markup = `
            <div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
            </div> 
          `
    this._clear()
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }
}