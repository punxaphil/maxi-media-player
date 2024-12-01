import { css, html, LitElement, PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';
import Store from '../model/store';
import { MediaPlayerItem } from '../types';
import { mediaItemTitleStyle } from '../constants';
import { renderMediaBrowserItem } from '../utils/media-browser-utils';

class MediaRow extends LitElement {
  @property({ attribute: false }) store!: Store;
  @property({ attribute: false }) item!: MediaPlayerItem;
  @property({ type: Boolean }) selected = false;

  render() {
    return html`
      <mwc-list-item hasMeta ?selected=${this.selected} ?activated=${this.selected} class="button">
        <div class="row">${renderMediaBrowserItem(this.item)}</div>
        <slot slot="meta"></slot>
      </mwc-list-item>
    `;
  }

  protected async firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);
    await this.scrollToSelected(_changedProperties);
  }

  protected async updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties);
    await this.scrollToSelected(_changedProperties);
  }

  private async scrollToSelected(_changedProperties: PropertyValues) {
    await new Promise((r) => setTimeout(r, 0));
    if (this.selected && _changedProperties.has('selected')) {
      this.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  static get styles() {
    return [
      css`
        .mdc-deprecated-list-item__text {
          width: 100%;
        }
        .button {
          margin: 0.3rem;
          border-radius: 0.3rem;
          background: var(--secondary-background-color);
          --icon-width: 35px;
          height: 40px;
        }

        .row {
          display: flex;
        }

        .thumbnail {
          width: var(--icon-width);
          height: var(--icon-width);
          background-size: contain;
          background-repeat: no-repeat;
          background-position: left;
        }

        .title {
          font-size: 1.1rem;
          align-self: center;
          flex: 1;
        }
      `,
      mediaItemTitleStyle,
    ];
  }
}

customElements.define('mxmp-media-row', MediaRow);
