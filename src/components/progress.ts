import { css, html, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import Store from '../model/store';
import { MediaPlayer } from '../model/media-player';
import { styleMap } from 'lit-html/directives/style-map.js';

class Progress extends LitElement {
  @property() store!: Store;
  private activePlayer!: MediaPlayer;

  @state() private playingProgress!: number;
  private tracker?: NodeJS.Timeout;

  disconnectedCallback() {
    if (this.tracker) {
      clearInterval(this.tracker);
      this.tracker = undefined;
    }
    super.disconnectedCallback();
  }

  render() {
    this.activePlayer = this.store.activePlayer;
    const mediaDuration = this.activePlayer?.attributes.media_duration || 0;
    const showProgress = mediaDuration > 0;
    if (showProgress) {
      this.trackProgress();
      return html`
        <div class="progress">
          <span>${convertProgress(this.playingProgress)}</span>
          <div class="bar">
            <div class="progress-bar" style=${this.progressBarStyle(mediaDuration)}></div>
          </div>
          <span> -${convertProgress(mediaDuration - this.playingProgress)}</span>
        </div>
      `;
    }
    return html``;
  }

  private progressBarStyle(mediaDuration: number) {
    return styleMap({ width: `${(this.playingProgress / mediaDuration) * 100}%` });
  }

  trackProgress() {
    const position = this.activePlayer?.attributes.media_position || 0;
    const playing = this.activePlayer?.isPlaying();
    const updatedAt = this.activePlayer?.attributes.media_position_updated_at || 0;
    if (playing) {
      this.playingProgress = position + (Date.now() - new Date(updatedAt).getTime()) / 1000.0;
    } else {
      this.playingProgress = position;
    }
    if (!this.tracker) {
      this.tracker = setInterval(() => this.trackProgress(), 1000);
    }
    if (!playing) {
      clearInterval(this.tracker);
      this.tracker = undefined;
    }
  }
  static get styles() {
    return css`
      .progress {
        width: 100%;
        font-size: x-small;
        display: flex;
        --paper-progress-active-color: lightgray;
      }

      .bar {
        display: flex;
        flex-grow: 1;
        align-items: center;
        padding: 5px;
      }

      .progress-bar {
        background-color: var(--accent-color);
        height: 50%;
      }
    `;
  }
}

const convertProgress = (duration: number) => {
  const date = new Date(duration * 1000).toISOString().substring(11, 19);
  return date.startsWith('00:') ? date.substring(3) : date;
};

customElements.define('sonos-progress', Progress);
