import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

export class ForkYeahSearchbar extends LitElement {
  static get tag() {
    return "forkyeah-searchbar";
  }

  static get properties() {
    return {
      query: { type: String },
    };
  }

  constructor() {
    super();
    this.query = '';
  }

  handleInput(e) {
    this.query = e.target.value;
    this.dispatchEvent(
      new CustomEvent('search-changed', {
        detail: { query: this.query },
        bubbles: true,
        composed: true,
      })
    );
  }

  handleSubmit(e) {
    e.preventDefault();
    this.dispatchEvent(
      new CustomEvent('search-submit', {
        detail: { query: this.query },
        bubbles: true,
        composed: true,
      })
    );
  }

  static get styles() {
    return css`
      form {
        display: flex;
        gap: 8px;
        width: 100%;
        max-width: 400px;
        margin: 0 auto;
      }

      input[type="text"] {
        flex: 1;
        padding: 8px 12px;
        border-radius: 4px;
        border: 1px solid #ccc;
        font-size: 1rem;
        outline: none;
      }

      input[type="text"]:focus {
        border-color: black;
        box-shadow: 0 0 5px rgba(255, 107, 107, 0.5);
      }

      button {
        padding: 8px 16px;
        background: black;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        transition: background 0.2s ease;
      }

      button:hover {
        background: black;
      }
    `;
  }

  render() {
    return html`
      <form @submit="${this.handleSubmit}">
        <input
          type="text"
          placeholder="Search restaurants or cuisines..."
          .value="${this.query}"
          @input="${this.handleInput}"
        />
        <button type="submit">Search</button>
      </form>
    `;
  }
}

customElements.define(ForkYeahSearchbar.tag, ForkYeahSearchbar);