import { css, html, LitElement, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import MediaControlService from '../services/media-control-service';
import Store from '../model/store';
import { CardConfig } from '../types';
import { mdiVolumeHigh, mdiVolumeMute } from '@mdi/js';
import { MediaPlayer } from '../model/media-player';

class Volume extends LitElement {
  @property({ attribute: false }) store!: Store;
  private config!: CardConfig;
  private mediaControlService!: MediaControlService;
  @property({ attribute: false }) player!: MediaPlayer;
  @property({ type: Boolean }) updateMembers = true;
  @property() volumeClicked?: () => void;
  @property() slim: boolean = false;

  render() {
    this.config = this.store.config;
    this.mediaControlService = this.store.mediaControlService;

    const volume = this.player.getVolume();
    const max = this.getMax(volume);

    const muteIcon = this.player.isMuted(this.updateMembers) ? mdiVolumeMute : mdiVolumeHigh;
    const disabled = this.player.ignoreVolume;

    return html`
      <div class="volume" slim=${this.slim || nothing}>
        <ha-icon-button .disabled=${disabled} @click=${this.mute} .path=${muteIcon}> </ha-icon-button>
        <div class="volume-slider">
          <ha-control-slider
            .value=${volume}
            max=${max}
            @value-changed=${this.volumeChanged}
            .disabled=${disabled}
          ></ha-control-slider>
          <div class="volume-level">
            <div style="flex: ${volume}">0%</div>
            <div class="percentage">${Math.round(volume)}%</div>
            <div style="flex: ${max - volume};text-align: right">${max}%</div>
          </div>
        </div>
        <mxmp-ha-player .store=${this.store} .features=${this.store.showPower()}></mxmp-ha-player>
      </div>
    `;
  }

  private getMax(volume: number) {
    const dynamicThreshold = Math.max(0, Math.min(this.config.dynamicVolumeSliderThreshold ?? 20, 100));
    const dynamicMax = Math.max(0, Math.min(this.config.dynamicVolumeSliderMax ?? 30, 100));
    return volume < dynamicThreshold && this.config.dynamicVolumeSlider ? dynamicMax : 100;
  }

  private async volumeChanged(e: Event) {
    const newVolume = numberFromEvent(e);
    return await this.mediaControlService.volumeSet(this.player, newVolume, this.updateMembers);
  }

  private async mute() {
    return await this.mediaControlService.toggleMute(this.player, this.updateMembers);
  }

  static get styles() {
    return css`
      ha-control-slider {
        --control-slider-color: var(--accent-color);
      }
      ha-control-slider[disabled] {
        --control-slider-color: var(--disabled-text-color);
      }

      *[slim] * {
        --control-slider-thickness: 10px;
        --mdc-icon-button-size: 30px;
        --mdc-icon-size: 20px;
      }

      *[slim] .volume-level {
        display: none;
      }

      .volume {
        display: flex;
        flex: 1;
      }

      .volume-slider {
        flex: 1;
        padding-right: 0.6rem;
      }

      *[slim] .volume-slider {
        display: flex;
        align-items: center;
      }

      .volume-level {
        font-size: x-small;
        display: flex;
      }
      .percentage {
        flex: 2;
        font-weight: bold;
        font-size: 12px;
      }
      *[hide] {
        display: none;
      }
    `;
  }
}
function numberFromEvent(e: Event) {
  return Number.parseInt((e?.target as HTMLInputElement)?.value);
}

customElements.define('mxmp-volume', Volume);
