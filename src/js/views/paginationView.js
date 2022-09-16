import View from './View';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--inline'); // Search for parent
      if (!btn) return;
      const gotoPage = +btn.dataset.goto;
      handler(gotoPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1 and there are other pages
    if (curPage === 1 && numPages > 1) {
      return this._generateButtonMarkup('next');
    }

    // Last page
    if (curPage === numPages && numPages > 1) {
      return this._generateButtonMarkup('prev');
    }

    // Other page
    if (curPage < numPages) {
      return `
        ${this._generateButtonMarkup('prev')}${this._generateButtonMarkup(
        'next'
      )}
      `;
    }

    // Page 1 and there are NO other pages
    return '';
  }

  _generateButtonMarkup(dir) {
    const curPage = this._data.page;
    return `
      <button data-goto="${
        dir === 'next' ? `${curPage + 1}` : `${curPage - 1}`
      }" class="btn--inline pagination__btn--${dir}">
      ${dir === 'next' ? `<span>Page ${curPage + 1}</span>` : ''} 
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-${dir === 'prev' ? 'left' : 'right'}">
          </use>
        </svg>
      ${dir === 'prev' ? `<span>Page ${curPage - 1}</span>` : ''} 
      </button>
    `;
  }
}

export default new PaginationView();
