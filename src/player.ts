import { LitElement, html, css, property, state } from 'lit-element';
import { getEntityName } from './utils';

import Service from './service';
import { CardConfig, Members } from './types';
import { HomeAssistant } from 'custom-card-helpers';

import { CustomSonosCard } from './main';

class Player extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property() config!: CardConfig;
  @property() entityId!: string;
  @property() service!: Service;
  @property() members!: Members;
  @property() main!: CustomSonosCard;
  @state() private timerToggleShowAllVolumes!: number;

  render() {
    const activeStateObj = this.hass.states[this.entityId];
    const isGroup = activeStateObj.attributes.sonos_group.length > 1;
    let allVolumes = [];
    if (isGroup) {
      allVolumes = activeStateObj.attributes.sonos_group.map((member: string) =>
        this.getVolumeTemplate(member, getEntityName(this.hass, this.config, member)),
      );
    }
    return html`
      <div
        class="container"
        style="background-position-x:center;background-repeat: no-repeat;background-size: cover;
              ${activeStateObj.attributes.entity_picture
          ? `background-image: url(${activeStateObj.attributes.entity_picture});`
          : ''}
              "
      >
        <div class="body">
          ${activeStateObj.attributes.media_title
            ? html`
                <div class="info">
                  <div class="album">${activeStateObj.attributes.media_album_name}</div>
                  <div class="song">${activeStateObj.attributes.media_title}</div>
                  <div class="artist">${activeStateObj.attributes.media_artist}</div>
                </div>
                <div
                  class="${this.main.showVolumes
                    ? 'hidden'
                    : `buttons ${activeStateObj.attributes.entity_picture ? 'padded-buttons' : ''}`}"
                >
                  <a class="link">
                    <ha-icon @click="${() => this.service.prev(this.entityId)}" .icon=${'mdi:skip-backward'}></ha-icon>
                  </a>
                  <a class="link">
                    ${activeStateObj.state !== 'playing'
                      ? html` <ha-icon
                          @click="${() => this.service.play(this.entityId)}"
                          .icon=${'mdi:play'}
                        ></ha-icon>`
                      : html`
                          <ha-icon @click="${() => this.service.pause(this.entityId)}" .icon=${'mdi:stop'}></ha-icon>
                        `}
                  </a>
                  <a class="link">
                    <ha-icon @click="${() => this.service.next(this.entityId)}" .icon=${'mdi:skip-forward'}></ha-icon>
                  </a>
                </div>
              `
            : html` <div style="width: 100%; text-align: center; padding: 3rem 0">
                ${this.config.noMediaText ? this.config.noMediaText : '🎺 What do you want to play? 🥁'}
              </div>`}
        </div>
        <div class="footer">
          ${this.getVolumeTemplate(
            this.entityId,
            this.main.showVolumes ? (this.config.allVolumesText ? this.config.allVolumesText : 'All') : '',
            this.members,
          )}
          <div style="display: ${this.main.showVolumes ? 'block' : 'none'}">${allVolumes}</div>
          <div class="footer-icons">
            <ha-icon
              @click="${() => this.service.volumeDown(this.entityId, this.members)}"
              .icon=${'mdi:volume-minus'}
            ></ha-icon>
            <ha-icon
              @click="${() => this.service.shuffle(this.entityId, !activeStateObj.attributes.shuffle)}"
              .icon=${activeStateObj.attributes.shuffle ? 'mdi:shuffle-variant' : 'mdi:shuffle-disabled'}
            ></ha-icon>
            <ha-icon
              style="display: ${isGroup ? 'block' : 'none'}"
              @click="${() => this.toggleShowAllVolumes()}"
              .icon=${this.main.showVolumes ? 'mdi:arrow-collapse-vertical' : 'mdi:arrow-expand-vertical'}
            ></ha-icon>
            <ha-icon
              @click="${() => this.service.repeat(this.entityId, activeStateObj.attributes.repeat)}"
              .icon=${activeStateObj.attributes.repeat === 'all'
                ? 'mdi:repeat'
                : activeStateObj.attributes.repeat === 'one'
                ? 'mdi:repeat-once'
                : 'mdi:repeat-off'}
            ></ha-icon>
            <ha-icon
              @click="${() => this.service.volumeUp(this.entityId, this.members)}"
              .icon=${'mdi:volume-plus'}
            ></ha-icon>
          </div>
        </div>
      </div>
    `;
  }

  getVolumeTemplate(entity: string, name: string, members = {}) {
    const volume = 100 * this.hass.states[entity].attributes.volume_level;
    let max = 100;
    let inputColor = 'rgb(211, 3, 32)';
    if (volume < 20) {
      max = 30;
      inputColor = 'rgb(72,187,14)';
    }
    return html`
      ${name ? html` <div style="margin-top: 1rem; margin-left: 0.4rem;">${name}</div>` : ''}
      <div style="font-size: x-small; margin: 0 0.4rem; display: flex;">
        <div style="flex: ${volume}">0%</div>
        ${volume > 0 ? html` <div style="flex: 2">${Math.round(volume)}%</div>` : ''}
        <div style="flex: ${max - volume};text-align: right">${max}%</div>
      </div>
      <input
        type="range"
        .value="${volume}"
        @change=${(e: Event) => this.service.volumeSet(entity, members, (e?.target as HTMLInputElement)?.value)}
        min="0"
        max="${max}"
        id="volumeRange"
        class="volumeRange"
        style="background: linear-gradient(to right, ${inputColor} 0%, ${inputColor} ${(volume * 100) /
        max}%, rgb(211, 211, 211) ${(volume * 100) / max}%, rgb(211, 211, 211) 100%);"
      />
    `;
  }

  toggleShowAllVolumes() {
    this.main.showVolumes = !this.main.showVolumes;
    clearTimeout(this.timerToggleShowAllVolumes);
    if (this.main.showVolumes) {
      this.timerToggleShowAllVolumes = window.setTimeout(() => {
        this.main.showVolumes = false;
        window.scrollTo(0, 0);
      }, 30000);
    }
  }

  static get styles() {
    return css`
      .container {
        position: relative;
        overflow: hidden;
        z-index: 0;
        margin: 0;
        background: var(--sonos-int-background-color);
        border-radius: 0.25rem;
        border: 8px solid var(--sonos-int-background-color);
        box-shadow: var(--sonos-int-box-shadow);
      }

      .body {
        background-repeat: no-repeat;
        background-size: 10%;
        background-position-y: center;
      }

      .footer {
        background: var(--sonos-int-player-section-background);
        margin: 1rem;
        border-radius: 0.25rem;
      }

      .footer input {
        width: 97%;
      }

      .footer-icons {
        justify-content: space-between;
        display: flex;
      }

      .footer div ha-icon {
        padding: 10px;
      }

      .volumeRange {
        -webkit-appearance: none;
        height: 5px;
        border-radius: 5px;
        outline: none;
        opacity: 0.7;
        -webkit-transition: 0.2s;
        transition: opacity 0.2s;
        margin: 6px 5px 0 5px;
      }

      .info {
        margin: 1rem;
        text-align: center;
        background: var(--sonos-int-player-section-background);
        border-radius: 0.25rem;
      }

      .album,
      .song {
        margin-bottom: 0.5rem;
        white-space: wrap;
      }

      .artist,
      .album {
        font-size: 0.75rem;
        font-weight: 300;
        color: var(--sonos-int-artist-album-text-color);
      }

      .artist {
        white-space: wrap;
      }

      .song {
        font-size: 1.15rem;
        font-weight: 400;
        color: var(--sonos-int-accent-color);
      }

      .padded-buttons {
        padding: 5rem;
      }

      .buttons {
        display: flex;
        justify-content: center;
      }

      .buttons a {
        padding: 0.8rem;
        box-shadow: 0 3px 6px rgba(33, 33, 33, 0.1), 0 3px 12px rgba(33, 33, 33, 0.15);
      }

      .buttons a:focus,
      .buttons a:hover {
        color: var(--sonos-int-accent-color);
        opacity: 1;
        box-shadow: 0 6px 9px rgba(33, 33, 33, 0.1), 0 6px 16px rgba(33, 33, 33, 0.15);
      }

      .link {
        -webkit-transition: all 0.25s cubic-bezier(0.4, 0, 1, 1);
        transition: all 0.25s cubic-bezier(0.4, 0, 1, 1);
        margin: 1rem;
        border-radius: 50%;
        background: var(--sonos-int-player-section-background);
      }

      .link:focus,
      .link:hover {
        color: var(--sonos-int-accent-color);
      }

      .hidden {
        display: none;
      }
    `;
  }
}

customElements.define('sonos-player', Player);
