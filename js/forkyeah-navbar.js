import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';


export class ForkYeahNavbar extends LitElement {
 static get tag() {
   return 'forkyeah-navbar';
 }


 static get properties() {
   return {
     _openDropdown: { type: String, state: true },
     _selected: { type: Object, state: true },
     _countrySearch: { type: String, state: true },
   };
 }


 constructor() {
   super();
   this._openDropdown = null;
   this._countrySearch = '';
   this._selected = {
     COUNTRY: 'All Countries',
     BOROUGH: 'All Boroughs',
     PRICE: 'Any Price',
   };

   this._onOutsideClick = (e) => {
     if (!this.renderRoot.contains(e.target)) {
       this._openDropdown = null;
       this._countrySearch = '';
     }
   };
 }


 connectedCallback() {
   super.connectedCallback();
   document.addEventListener('click', this._onOutsideClick);
 }


 disconnectedCallback() {
   super.disconnectedCallback();
   document.removeEventListener('click', this._onOutsideClick);
 }


 _toggleDropdown(name, e) {
   e.stopPropagation();
   if (this._openDropdown === name) {
     this._openDropdown = null;
     this._countrySearch = '';
   } else {
     this._openDropdown = name;
     this._countrySearch = '';
     if (name === 'COUNTRY') {
       this.updateComplete.then(() => {
         const input = this.renderRoot.querySelector('.country-search');
         if (input) input.focus();
       });
     }
   }
 }


 _selectOption(filterName, option, e) {
   e.stopPropagation();
   this._selected = { ...this._selected, [filterName]: option };
   this._openDropdown = null;
   this._countrySearch = '';

   document.dispatchEvent(new CustomEvent('forkyeah-filter', {
     detail: { ...this._selected },
     bubbles: true,
     composed: true,
   }));
 }


 _isDefault(filterName) {
   const defaults = {
     COUNTRY: 'All Countries',
     BOROUGH: 'All Boroughs',
     PRICE: 'Any Price',
   };
   return this._selected[filterName] === defaults[filterName];
 }


 _options() {
   return {
     COUNTRY: [
       'All Countries',
       'Afghan', 'American', 'Argentinian', 'Bangladeshi', 'Brazilian',
       'Caribbean', 'Chinese', 'Colombian', 'Cuban', 'Egyptian',
       'Ethiopian', 'Filipino', 'French', 'German', 'Greek',
       'Haitian', 'Indian', 'Indonesian', 'Iranian / Persian', 'Italian',
       'Jamaican', 'Japanese', 'Korean', 'Lebanese', 'Malaysian',
       'Mediterranean', 'Mexican', 'Middle Eastern', 'Moroccan', 'Nigerian',
       'Pakistani', 'Peruvian', 'Polish', 'Portuguese', 'Puerto Rican',
       'Russian', 'Senegalese', 'Spanish', 'Thai', 'Turkish',
       'Ukrainian', 'Uzbek', 'Venezuelan', 'Vietnamese',
     ],
     BOROUGH: ['All Boroughs', 'Manhattan', 'Brooklyn', 'Queens', 'The Bronx', 'Staten Island'],
     PRICE: ['Any Price', '$', '$$', '$$$', '$$$$'],
   };
 }


 _filteredCountries() {
   const all = this._options().COUNTRY;
   const q = this._countrySearch.trim().toLowerCase();
   if (!q) return all;
   return all.filter(c => c.toLowerCase().includes(q));
 }


 static get styles() {
   return css`
     :host {
       display: block;
       width: 100%;
       font-family: 'Barlow Condensed', sans-serif;
     }

     nav {
       display: flex;
       align-items: stretch;
       border-bottom: 10px solid #ff0019;
       background: #fff;
       min-width: 0;
     }

     .brand {
       font-weight: 600;
       font-size: 36px;
       letter-spacing: 0.06em;
       line-height: 1;
       text-transform: uppercase;
       padding: 18px;
       flex-shrink: 0;
       color: #ff0000;
     }

     .brand-right {
       flex-shrink: 0;
     }

     @media (max-width: 500px) {
       .brand-right { display: none; }
       .brand { font-size: 24px; padding: 12px 10px; }
     }

     @media (max-width: 360px) {
       .brand { font-size: 18px; padding: 10px 7px; }
     }

     .vsep {
       position: relative;
       width: 4px;
       flex-shrink: 0;
     }

     .vsep::before {
       content: "";
       position: absolute;
       top: 20%;
       bottom: 20%;
       left: 0;
       border-left: 1px solid #ff0000;
     }

     .filters {
       display: flex;
       flex: 1;
       align-items: stretch;
       min-width: 0;
     }

     .filter-wrap {
       position: relative;
       display: flex;
       flex: 1;
       min-width: 0;
     }

     .filter-wrap::after {
       content: "";
       position: absolute;
       right: 0;
       top: 20%;
       bottom: 20%;
       border-right: 1px solid #ff0000;
     }

     .filter-wrap:last-child::after {
       display: none;
     }

     .filter-btn {
       flex: 1;
       display: flex;
       flex-direction: column;
       align-items: center;
       justify-content: center;
       padding: 10px 16px;
       cursor: pointer;
       background: none;
       border: none;
       font-family: 'Barlow Condensed', sans-serif;
       font-weight: 600;
       font-size: 22px;
       letter-spacing: 0.1em;
       text-transform: uppercase;
       color: #ff0000;
       min-width: 0;
       overflow: hidden;
     }

     @media (max-width: 500px) {
       .filter-btn { font-size: 15px; padding: 8px 4px; letter-spacing: 0.04em; }
     }

     .filter-val {
       font-size: 10px;
       font-weight: 700;
       letter-spacing: 0.08em;
       text-transform: uppercase;
       color: #E8192C;
       line-height: 1;
       margin-bottom: 2px;
       white-space: nowrap;
       overflow: hidden;
       text-overflow: ellipsis;
       max-width: 100%;
     }

     .chev {
       font-size: 8px;
       color: #E8192C;
     }

     /* ── Dropdown base ── */
     .dropdown {
       display: none;
       position: absolute;
       top: 100%;
       left: 0;
       right: 0;
       background: #fff;
       border: 2px solid #E8192C;
       border-top: none;
       z-index: 100;
       flex-direction: column;
       max-height: 280px;
       overflow-y: auto;
     }

     .dropdown.open {
       display: flex;
     }

     /* ── Country search ── */
     .country-search-wrap {
       position: sticky;
       top: 0;
       background: #fff;
       border-bottom: 1.5px solid #E8192C;
       z-index: 2;
       padding: 6px 7px;
       flex-shrink: 0;
     }

     .country-search {
       width: 100%;
       box-sizing: border-box;
       font-family: 'Barlow Condensed', sans-serif;
       font-size: 13px;
       font-weight: 600;
       letter-spacing: 0.07em;
       text-transform: uppercase;
       color: #E8192C;
       border: 1.5px solid #E8192C;
       background: #fff;
       padding: 5px 8px;
       outline: none;
     }

     .country-search::placeholder {
       color: #E8192C;
       opacity: 0.4;
       font-style: italic;
       text-transform: none;
     }

     .country-search:focus {
       background: #fff5f5;
     }

     .no-results {
       font-family: 'Barlow Condensed', sans-serif;
       font-size: 11px;
       font-weight: 700;
       letter-spacing: 0.1em;
       text-transform: uppercase;
       color: #E8192C;
       opacity: 0.5;
       padding: 12px 14px;
       text-align: center;
     }

     /* ── Dropdown items ── */
     .dropdown-item {
       font-family: 'Barlow Condensed', sans-serif;
       font-weight: 700;
       font-size: 12px;
       letter-spacing: 0.1em;
       text-transform: uppercase;
       padding: 10px 14px;
       cursor: pointer;
       color: #111;
       border-bottom: 1px solid #f0f0f0;
       flex-shrink: 0;
     }

     .dropdown-item:last-child {
       border-bottom: none;
     }

     .dropdown-item:hover,
     .dropdown-item.selected {
       background: #E8192C;
       color: #fff;
     }
   `;
 }


 render() {
   const opts = this._options();
   const filteredCountries = this._filteredCountries();

   return html`
     <nav>
       <div class="brand">FORK<br>YEAH!</div>
       <div class="vsep"></div>

       <div class="filters">
         ${['COUNTRY', 'BOROUGH', 'PRICE'].map(name => html`
           <div class="filter-wrap">
             <button
               class="filter-btn"
               @click=${(e) => this._toggleDropdown(name, e)}
             >
               ${!this._isDefault(name) ? html`
                 <span class="filter-val">${this._selected[name]}</span>
               ` : null}
               <span>${name}</span>
               <span class="chev">▼</span>
             </button>

             <div class="dropdown ${this._openDropdown === name ? 'open' : ''}">
               ${name === 'COUNTRY' ? html`
                 <div class="country-search-wrap" @click=${(e) => e.stopPropagation()}>
                   <input
                     class="country-search"
                     type="text"
                     placeholder="Search cuisines…"
                     .value=${this._countrySearch}
                     @input=${(e) => { this._countrySearch = e.target.value; }}
                     @keydown=${(e) => e.stopPropagation()}
                   />
                 </div>
                 ${filteredCountries.length === 0
                   ? html`<div class="no-results">No results</div>`
                   : filteredCountries.map(opt => html`
                     <div
                       class="dropdown-item ${this._selected[name] === opt ? 'selected' : ''}"
                       @click=${(e) => this._selectOption(name, opt, e)}
                     >${opt}</div>
                   `)
                 }
               ` : opts[name].map(opt => html`
                 <div
                   class="dropdown-item ${this._selected[name] === opt ? 'selected' : ''}"
                   @click=${(e) => this._selectOption(name, opt, e)}
                 >${opt}</div>
               `)}
             </div>
           </div>
         `)}
       </div>

       <div class="vsep"></div>
       <div class="brand brand-right">FORK<br>YEAH!</div>
     </nav>
   `;
 }
}


customElements.define(ForkYeahNavbar.tag, ForkYeahNavbar);