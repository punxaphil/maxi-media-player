import {LitElement, html, css} from 'lit-element';

import Service from "./service";

class Player extends LitElement {

  constructor() {
    super();
    this.timerToggleShowAllVolumes = '';
  }

  static get properties() {
    return {
      hass: {}, config: {}, entityId: String, members: {}, main: {}, service: Service
    };
  }

  render() {
    const activeStateObj = this.hass.states[this.entityId];
    const isGroup = activeStateObj.attributes.sonos_group.length > 1;
    let allVolumes = [];
    if (isGroup) {
      allVolumes = activeStateObj.attributes.sonos_group.map(member => this.getVolumeTemplate(member, this.hass.states[member].attributes.friendly_name));
    }
    return html`
      <div class="container" style="background-position-x:center;background-repeat: no-repeat;background-size: cover;
              ${activeStateObj.attributes.entity_picture ? `background-image: url(${activeStateObj.attributes.entity_picture});` : ''}
              ">
        <div class="body">
          ${activeStateObj.attributes.media_title ? html`
            <div class="info">
              <div class="album">${activeStateObj.attributes.media_album_name}</div>
              <div class="song">${activeStateObj.attributes.media_title}</div>
              <div class="artist">${activeStateObj.attributes.media_artist}</div>
            </div>
            <div
                class="${this.main.showVolumes ? 'hidden' : `buttons ${activeStateObj.attributes.entity_picture ? 'padded-buttons' : ''}`}">
              <a class="link">
                <ha-icon @click="${() => this.service.prev(this.entityId)}" .icon=${'mdi:skip-backward'}></ha-icon>
              </a>
              <a class="link">
                ${activeStateObj.state !== 'playing' ? html`
                  <ha-icon @click="${() => this.service.play(this.entityId)}"
                           .icon=${'mdi:play'}></ha-icon>` : html`
                  <ha-icon @click="${() => this.service.pause(this.entityId)}" .icon=${'mdi:stop'}></ha-icon>
                `}
              </a>
              <a class="link">
                <ha-icon @click="${() => this.service.next(this.entityId)}" .icon=${'mdi:skip-forward'}></ha-icon>
              </a>
            </div>
          ` : html`
            <div style="width: 100%; text-align: center; padding: 3rem 0">
              ${this.config.noMediaText ? this.config.noMediaText : '🎺 What do you want to play? 🥁'}
            </div>`}
        </div>
        <div class="footer">
          ${this.getVolumeTemplate(this.entityId, this.main.showVolumes ? (this.config.allVolumesText ? this.config.allVolumesText : 'All') : '', this.members)}
          <div style="display: ${this.main.showVolumes ? 'block' : 'none'}">
            ${allVolumes}
          </div>
          <div class="footer-icons">
            <ha-icon @click="${() => this.service.volumeDown(this.entityId, this.members)}"
                     .icon=${'mdi:volume-minus'}></ha-icon>
            <ha-icon @click="${() => this.service.shuffle(this.entityId, !activeStateObj.attributes.shuffle)}"
                     .icon=${activeStateObj.attributes.shuffle ? 'mdi:shuffle-variant' : 'mdi:shuffle-disabled'}></ha-icon>
            <ha-icon style="display: ${isGroup ? 'block' : 'none'}"
                     @click="${() => this.toggleShowAllVolumes()}"
                     .icon=${this.main.showVolumes ? 'mdi:arrow-collapse-vertical' : 'mdi:arrow-expand-vertical'}></ha-icon>
            <ha-icon @click="${() => this.service.repeat(this.entityId, activeStateObj.attributes.repeat)}"
                     .icon=${activeStateObj.attributes.repeat === 'all' ? 'mdi:repeat' : activeStateObj.attributes.repeat === 'one' ? 'mdi:repeat-once' : 'mdi:repeat-off'}></ha-icon>
            <ha-icon @click="${() => this.service.volumeUp(this.entityId, this.members)}"
                     .icon=${'mdi:volume-plus'}></ha-icon>
          </div>
        </div>
      </div>
    `;
  }

  getVolumeTemplate(entity, name, members = {}) {
    const volume = 100 * this.hass.states[entity].attributes.volume_level;
    let max = 100;
    let inputColor = 'rgb(211, 3, 32)';
    if (volume < 20) {
      max = 30;
      inputColor = 'rgb(72,187,14)';
    }
    return html`
      ${name ? html`
        <div style="margin-top: 1rem; margin-left: 0.4rem;">${name}</div>` : ''}
      <div style="font-size: x-small; margin: 0 0.4rem; display: flex;">
        <div style="flex: ${volume}">0%</div>
        ${volume > 0 ? html`
          <div style="flex: 2">${Math.round(volume)}%</div>` : ''}
        <div style="flex: ${max - volume};text-align: right">${max}%</div>
      </div>
      <input type="range" .value="${volume}"
             @change=${e => this.service.volumeSet(entity, members, e.target.value)}
             min="0" max="${max}" id="volumeRange" class="volumeRange"
             style="background: linear-gradient(to right, ${inputColor} 0%, ${inputColor} ${volume * 100 / max}%, rgb(211, 211, 211) ${volume * 100 / max}%, rgb(211, 211, 211) 100%);">
    `;
  }

  toggleShowAllVolumes() {
    this.main.showVolumes = !this.main.showVolumes;
    clearTimeout(this.timerToggleShowAllVolumes);
    if (this.main.showVolumes) {
      this.timerToggleShowAllVolumes = setTimeout(() => {
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
        margin:0;
        background: var(
          --ha-card-background,
          var(--paper-card-background-color, white)
        );
        border-radius: 0.25rem;
        border: 8px solid var(
          --ha-card-background,
          var(--paper-card-background-color, white)
        ); 
        box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.19), 0 6px 6px -10px rgba(0, 0, 0, 0.23);
      }
      
      .body {
        background-repeat: no-repeat;
        background-size: 10%;
        background-position-y: center;
      }
     
      .footer {
        background: #ffffffe6;
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
        color: #888;
        padding: 10px;
      }
      
      .volumeRange {
        -webkit-appearance: none;
        height: 5px;
        border-radius: 5px;
        background: #d3d3d3;
        outline: none;
        opacity: 0.7;
        -webkit-transition: .2s;
        transition: opacity .2s;
        margin: 6px 5px 0 5px;
      }

      .info {
        margin: 1rem;
        text-align: center;
        background: #ffffffe6;
        border-radius: 0.25rem;
      }

      .album,
      .song {
        margin-bottom: .5rem;
        white-space: wrap;
      }

      .artist,
      .album {
        font-size: .75rem;
        font-weight: 300;
        color: #666;
      }
      
      .artist {
        white-space: wrap;
      }

      .song {
        font-size: 1.15rem;
        font-weight: 400;
        color: #d30320;
      }

      .padded-buttons {
        padding: 8rem;
      }

      .buttons {
        display: flex;
        justify-content: center;
      }

      .buttons a {
        padding: 0.8rem;
        box-shadow: 0 3px 6px rgba(33, 33, 33, 0.1), 0 3px 12px rgba(33, 33, 33, 0.15);
      }
      
      .buttons a:focus, .buttons a:hover {
        color: rgba(171, 2, 26, 0.95);
        opacity: 1;
        box-shadow: 0 6px 9px rgba(33, 33, 33, 0.1), 0 6px 16px rgba(33, 33, 33, 0.15);
      }

      .buttons li:first-of-type a,
      .buttons li:last-of-type a {
        font-size: .95rem;
        color: #212121;
        opacity: .5;
      }
      
      .buttons li:first-of-type a:focus, .buttons li:first-of-type a:hover,
      .buttons li:last-of-type a:focus,
      .buttons li:last-of-type a:hover {
        color: #d30320;
        opacity: .75;
      }

      .link {
        -webkit-transition: all 0.25s cubic-bezier(0.4, 0, 1, 1);
        transition: all 0.25s cubic-bezier(0.4, 0, 1, 1);
        margin: 1rem;
        border-radius: 50%;
        background: #ffffffe6;
      }
      
      .link:focus, .link:hover {
        color: #d30320;
      }

      .hidden {
        display: none;
      }
    `;
  }
}

customElements.define('sonos-player', Player);
