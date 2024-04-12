import { css, html, LitElement, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import MediaControlService from '../services/media-control-service';
import Store from '../model/store';
import { CardConfig, MediaPlayerEntityFeature } from '../types';
import { mdiVolumeMinus, mdiVolumePlus } from '@mdi/js';
import { MediaPlayer } from '../model/media-player';
import { when } from 'lit/directives/when.js';
import { until } from 'lit-html/directives/until.js';

const { SHUFFLE_SET, REPEAT_SET, PLAY, PAUSE, NEXT_TRACK, PREVIOUS_TRACK, TURN_OFF, TURN_ON } = MediaPlayerEntityFeature;

class PlayerControls extends LitElement {
  @property({ attribute: false }) store!: Store;
  private config!: CardConfig;
  private activePlayer!: MediaPlayer;
  private mediaControlService!: MediaControlService;

  render() {
    this.config = this.store.config;
    this.activePlayer = this.store.activePlayer;
    this.mediaControlService = this.store.mediaControlService;

    const supportsTurnOn = (((this.activePlayer.attributes.supported_features || 0) & TURN_ON) == TURN_ON);

    const noUpDown = !!this.config.showVolumeUpAndDownButtons && nothing;
    const hideNextTrack = this.config.hidePlayerControlNextTrackButton || nothing;
    const hidePrevTrack = this.config.hidePlayerControlPrevTrackButton || nothing;
    const hideRepeat = this.config.hidePlayerControlRepeatButton || nothing;
    const hideShuffle = this.config.hidePlayerControlShuffleButton || nothing;
    const hidePower = this.config.hidePlayerControlPowerButton || nothing;

    return html`
      <div class="main" id="mediaControls">
        ${when(
          ['paused', 'playing'].includes(this.activePlayer.state),
          () => html`
            <div class="icons">
              <div class="flex-1"></div>
              <ha-icon-button hide=${noUpDown} @click=${this.volDown} .path=${mdiVolumeMinus}></ha-icon-button>
              <mxmp-ha-player hide=${hideShuffle} .store=${this.store} .features=${[SHUFFLE_SET]}></mxmp-ha-player>
              <mxmp-ha-player hide=${hidePrevTrack} .store=${this.store} .features=${[PREVIOUS_TRACK]}></mxmp-ha-player>
              <mxmp-ha-player .store=${this.store} .features=${[PLAY, PAUSE]} class="big-icon"></mxmp-ha-player>
              <mxmp-ha-player hide=${hideNextTrack} .store=${this.store} .features=${[NEXT_TRACK]}></mxmp-ha-player>
              <mxmp-ha-player hide=${hideRepeat} .store=${this.store} .features=${[REPEAT_SET]}></mxmp-ha-player>
              <ha-icon-button hide=${noUpDown} @click=${this.volUp} .path=${mdiVolumePlus}></ha-icon-button>
              <div class="audio-input-format">
                ${this.config.showAudioInputFormat && until(this.getAudioInputFormat())}
              </div>
            </div>
            <mxmp-volume
              .store=${this.store}
              .player=${this.activePlayer}
              .updateMembers=${!this.config.playerVolumeOnlyAffectsMainPlayer}
            ></mxmp-volume>
          `,
        )}
        ${when(
          ['off'].includes(this.activePlayer.state) && supportsTurnOn,
          () => html`
            <div class="icons">
              <mxmp-ha-player hide=${hidePower} .store=${this.store} .features=${[TURN_ON, TURN_OFF]} ></mxmp-ha-player>
            </div">
            `,
          )
        }
      </div>
    `;
  }
  private volDown = async () =>
    await this.mediaControlService.volumeDown(this.activePlayer, !this.config.playerVolumeOnlyAffectsMainPlayer);
  private volUp = async () =>
    await this.mediaControlService.volumeUp(this.activePlayer, !this.config.playerVolumeOnlyAffectsMainPlayer);

  private async getAudioInputFormat() {
    const sensors = await this.store.hassService.getRelatedEntities(this.activePlayer, 'sensor');
    const audioInputFormat = sensors.find((sensor) => sensor.entity_id.includes('audio_input_format'));
    return audioInputFormat && audioInputFormat.state && audioInputFormat.state !== 'No audio'
      ? html`<div>${audioInputFormat.state}</div>`
      : '';
  }
  static get styles() {
    return css`
      .main {
        overflow: hidden auto;
      }
      .icons {
        justify-content: center;
        display: flex;
        align-items: center;
      }
      .icons > *[hide] {
        display: none;
      }
      .big-icon {
        --mdc-icon-button-size: 5rem;
        --mdc-icon-size: 5rem;
      }
      .audio-input-format {
        flex: 1 0 0;
        margin-bottom: 10px;
        text-align: center;
        align-self: stretch;
        position: relative;
      }
      .audio-input-format > div {
        color: var(--card-background-color);
        background: var(--disabled-text-color);
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        position: absolute;
        bottom: 0;
        right: 0;
        max-width: 100%;
        font-size: smaller;
        line-height: normal;
        padding: 3px;
      }
      .flex-1 {
        flex: 1;
      }
    `;
  }
}

customElements.define('mxmp-player-controls', PlayerControls);
