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
      border-bottom: 10px solid #ff0019;
      background: #fff;
    }

    .brand {
      font-weight: 600;
      font-size: 36px;
      letter-spacing: 0.06em;
      line-height: 1;
      text-transform: uppercase;
      padding: 18px 18px;
      flex-shrink: 0;
      color: #ff0000;
      cursor: pointer;
      user-select: none;
    }

    .vsep {
      position: relative;
      width: 4px;
    }

    .vsep::before {
      content: "";
      position: absolute;
      top: 20%;
      bottom: 20%;
      left: 0;
      border-left: 1px solid #ff0000;
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


    /* ── Button base ── */
    .filter-btn {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      padding: 12px 20px;
      cursor: pointer;

      background: none;
      border: none;

      font-family: 'Barlow Condensed', sans-serif;
      font-weight: 600;
      font-size: 22px;
      letter-spacing: 0.1em;
      text-transform: uppercase;

      color: #ff0000;

      position: relative;   /* added */
      overflow: hidden;     /* added */

      transition: color 0.2s ease;
    }

    /* ── LIMITED Hover layer ── */
    .filter-btn::before {
      content: "";
      position: absolute;
      top: 20%;     /* controls vertical size */
      bottom: 20%;
      left: 0;
      right: 0;

      background: repeating-linear-gradient(
        45deg,
        #ff0000,
        #ff0000 8px,
        #ff0000 8px,
        #ff0000 16px
      );

      opacity: 0;
      transition: opacity 0.2s ease;
      z-index: 0;
    }

    .filter-btn:hover::before {
      opacity: 1;
    }

    /* keep text above */
    .filter-btn * {
      position: relative;
      z-index: 1;
    }

    .filter-btn:hover {
      color: #ffffff;
    }

    .filter-btn:hover .chev {
      color: #ffffff;
    }

    .filter-btn .chev {
      font-size: 8px;
      color: #E8192C;
      line-height: 1;
      transition: color 0.2s ease;
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