import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

export class ForkYeahNavbar extends LitElement {
  static get tag() {
    return 'forkyeah-navbar';
  }

  static get properties() {
    return {
      _openDropdown: { type: String, state: true },
    };
  }

  constructor() {
    super();
    this._openDropdown = null;

    // Close dropdown when clicking outside the component
    this._onOutsideClick = (e) => {
      if (!this.renderRoot.contains(e.target)) {
        this._openDropdown = null;
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

  _toggleDropdown(name) {
    this._openDropdown = this._openDropdown === name ? null : name;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        width: 100%;
        font-family: 'Barlow Condensed', sans-serif;
      }

      /* ── Nav bar ── */
      nav {
        display: flex;
        align-items: stretch;
        border-bottom: 3px solid #E8192C;
        background: #fff;
      }

      .brand {
        font-weight: 900;
        font-size: 20px;
        letter-spacing: 0.06em;
        line-height: 1.1;
        text-transform: uppercase;
        padding: 12px 18px;
        flex-shrink: 0;
        color: #000;
        cursor: pointer;
        user-select: none;
      }

      .vsep {
        width: 2px;
        background: #E8192C;
        flex-shrink: 0;
      }

      /* ── Filter buttons ── */
      .filters {
        display: flex;
        flex: 1;
        align-items: stretch;
      }

      .filter-wrap {
        position: relative;
        display: flex;
        flex: 1;
        border-right: 1px solid #eaeaea;
      }

      .filter-wrap:last-child {
        border-right: none;
      }

      .filter-btn {
        flex: 1;
        background: none;
        border: none;
        font-family: 'Barlow Condensed', sans-serif;
        font-weight: 700;
        font-size: 12.5px;
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: #111;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 3px;
        padding: 10px 8px;
        transition: background 0.15s;
      }

      .filter-btn:hover {
        background: #fafafa;
      }

      .filter-btn .chev {
        font-size: 8px;
        color: #E8192C;
        line-height: 1;
      }

      /* ── Dropdown panel ── */
      .dropdown {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        min-width: 160px;
        background: #fff;
        border: 2px solid #E8192C;
        border-top: none;
        z-index: 100;
        flex-direction: column;
      }

      .dropdown.open {
        display: flex;
      }

      .dropdown-item {
        font-family: 'Barlow Condensed', sans-serif;
        font-weight: 700;
        font-size: 12px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        padding: 9px 14px;
        cursor: pointer;
        color: #111;
        transition: background 0.12s, color 0.12s;
        border-bottom: 1px solid #f0f0f0;
      }

      .dropdown-item:last-child {
        border-bottom: none;
      }

      .dropdown-item:hover {
        background: #E8192C;
        color: #fff;
      }
    `;
  }

  // Dropdown options per filter
  _options() {
    return {
      COUNTRY: ['All Countries', 'American', 'Chinese', 'Italian', 'Japanese', 'Mexican', 'Indian', 'Thai'],
      BOROUGH: ['All Boroughs', 'Manhattan', 'Brooklyn', 'Queens', 'The Bronx', 'Staten Island'],
      PRICE:   ['Any Price', '$ Inexpensive', '$$ Moderate', '$$$ Expensive', '$$$$ Very Expensive'],
    };
  }

  render() {
    const opts = this._options();

    return html`
      <nav>
        <!-- Left brand -->
        <div class="brand">FORK<br>YEAH!</div>
        <div class="vsep"></div>

        <!-- Filter dropdowns -->
        <div class="filters">
          ${['COUNTRY', 'BOROUGH', 'PRICE'].map(name => html`
            <div class="filter-wrap">
              <button
                class="filter-btn"
                @click="${() => this._toggleDropdown(name)}"
              >
                ${name}
                <span class="chev">▼</span>
              </button>
              <div class="dropdown ${this._openDropdown === name ? 'open' : ''}">
                ${opts[name].map(opt => html`
                  <div class="dropdown-item" @click="${() => { this._openDropdown = null; }}">${opt}</div>
                `)}
              </div>
            </div>
          `)}
        </div>

        <div class="vsep"></div>

        <!-- Right brand -->
        <div class="brand" style="text-align:right">FORK<br>YEAH!</div>
      </nav>
    `;
  }
}

customElements.define(ForkYeahNavbar.tag, ForkYeahNavbar);