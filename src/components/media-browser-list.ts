import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import Store from '../model/store';
import { CardConfig, MediaPlayerItem } from '../types';
import { customEvent } from '../utils/utils';
import { listStyle, MEDIA_ITEM_SELECTED } from '../constants';
import { itemsWithFallbacks } from '../utils/media-browser-utils';

export class MediaBrowserList extends LitElement {
  @property({ attribute: false }) store!: Store;
  @property({ type: Array }) items!: MediaPlayerItem[];
  private config!: CardConfig;

  render() {
    this.config = this.store.config;

    return html`
      <mwc-list multi class="list">
        ${itemsWithFallbacks(this.items, this.config).map((item) => {
          return html`
            <mxmp-media-row
              @click=${() => this.dispatchEvent(customEvent(MEDIA_ITEM_SELECTED, item))}
              .item=${item}
            ></mxmp-media-row>
          `;
        })}
      </mwc-list>
    `;
  }

  static get styles() {
    return listStyle;
  }
}

customElements.define('mxmp-media-browser-list', MediaBrowserList);
