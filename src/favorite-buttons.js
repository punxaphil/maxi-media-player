import {LitElement, html, css} from 'lit-element';
import Service from "./service";

class FavoriteButtons extends LitElement {

  constructor() {
    super();
    this.favorites = [];
  }

  static get properties() {
    return {
      hass: {}, config: {}, mediaPlayers: {}, active: {}, service: Service
    };
  }

  render() {
    if (!this.favorites.length) {
      this.favorites = this.mediaPlayers
        .map(entity => this.hass.states[entity])
        .flatMap(state => state.attributes.source_list);
      this.favorites = [...new Set(this.favorites)];
      if (this.config.shuffleFavorites) {
        this.shuffleArray(this.favorites);
      }
    }
    return html`
      <div class="favorites">
        ${this.active !== '' && this.favorites.map(favorite => html`
          <div class="favorite" @click="${() => this.service.setSource(this.active, favorite)}">
            <span>${favorite}</span>
            <ha-icon .icon=${'mdi:play'}></ha-icon>
          </div>
        `)}
      </div>
    `;
  }

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  static get styles() {
    return css`
      .favorites {
        padding:0;
        margin:0 0 30px 0;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
      }
      .favorite {
        flex-grow: 1;
        border-radius:4px;
        margin:2px;
        padding:9px;
        display: flex;
        justify-content: center;
        background-color: var(--sonos-background-color);
        box-shadow: var(--sonos-box-shadow);
      }
      .favorite span {
        font-size:12px;
      }
      .favorite ha-icon {
        font-size:10px;
      }
      .favorite:hover ha-icon {
        color: var(--sonos-accent-color);
      }
    `;
  }
}

customElements.define('sonos-favorite-buttons', FavoriteButtons);
