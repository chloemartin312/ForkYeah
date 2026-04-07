import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

export class ForkYeahNavbar extends LitElement {
  static get tag() {
    return "forkyeah-navbar";
  }

  static get properties() {
    return {
      menu: { type: Array },
      activePage: { type: String },
    };
  }

  constructor() {
    super();
    this.activePage = this.getActivePageFromURL();
    this.menu = [
      { label: "Home", page: "home" },
      { label: "Explore", page: "explore" },
      { label: "Reviews", page: "reviews" }
    ];

    window.addEventListener("popstate", () => {
      this.activePage = this.getActivePageFromURL();
    });
  }

  getActivePageFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("page") || "home";
  }

  navigate(page) {
    window.history.pushState({}, "", `?page=${page}`);
    this.activePage = page;
  }

  static get styles() {
    return css`
      :host {
        display: block;
        width: 100%;
        background: #ff6b6b;
        color: white;
        font-family: 'Inter', sans-serif;
      }

      nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 32px;
      }

      .logo {
        font-size: 1.5rem;
        font-weight: 600;
        cursor: pointer;
      }

      ul {
        list-style: none;
        display: flex;
        gap: 24px;
        margin: 0;
        padding: 0;
      }

      li {
        cursor: pointer;
        transition: opacity 0.2s ease;
      }

      li:hover {
        opacity: 0.7;
      }

      .active {
        border-bottom: 2px solid white;
        padding-bottom: 2px;
        font-weight: 600;
      }
    `;
  }

  render() {
    return html`
      <nav>
        <div class="logo" @click="${() => this.navigate('home')}">
          🍴 ForkYeah
        </div>

        <ul>
          ${this.menu.map(item => html`
            <li class="${this.activePage === item.page ? 'active' : ''}"
                @click="${() => this.navigate(item.page)}">
              ${item.label}
            </li>
          `)}
        </ul>
      </nav>
    `;
  }
}

customElements.define(ForkYeahNavbar.tag, ForkYeahNavbar);