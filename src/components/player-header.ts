import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import Store from '../model/store';
import { CardConfig } from '../types';
import { getSpeakerList } from '../utils/utils';
import { MediaPlayer } from '../model/media-player';

class PlayerHeader extends LitElement {
  @property({ attribute: false }) store!: Store;
  private config!: CardConfig;
  private activePlayer!: MediaPlayer;

  render() {
    this.config = this.store.config;
    this.activePlayer = this.store.activePlayer;

    const speakerList = getSpeakerList(this.activePlayer, this.store.predefinedGroups);
    let song = this.activePlayer.getCurrentTrack();
    song = song || this.config.labelWhenNoMediaIsSelected || 'No media selected';
    if (this.config.showSourceInPlayer && this.activePlayer.attributes.source) {
      song = `${song} (${this.activePlayer.attributes.source})`;
    }
    let album = this.activePlayer.attributes.media_album_name;
    if (this.config.showChannelInPlayer && this.activePlayer.attributes.media_channel) {
      album = this.activePlayer.attributes.media_channel;
    } else if (!this.config.hidePlaylistInPlayer && this.activePlayer.attributes.media_playlist) {
      album = `${this.activePlayer.attributes.media_playlist} - ${album}`;
    }
    return html` <div class="info">
      <div class="entity">${speakerList}</div>
      <div class="song">${song}</div>
      <div class="artist-album">${album}</div>
      <mxmp-progress .store=${this.store}></mxmp-progress>
    </div>`;
  }

  static get styles() {
    return css`
      .info {
        text-align: center;
      }

      .entity {
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 1rem;
        font-weight: 500;
        color: var(--secondary-text-color);
        white-space: nowrap;
      }

      .song {
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 1.15rem;
        font-weight: 400;
        color: var(--accent-color);
      }

      .artist-album {
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 1rem;
        font-weight: 300;
        color: var(--secondary-text-color);
      }
    `;
  }
}

customElements.define('mxmp-player-header', PlayerHeader);
