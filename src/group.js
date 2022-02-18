import {LitElement, html, css} from 'lit-element';

class Group extends LitElement {

  static get properties() {
    return {
      hass: {}, group: {}, active: {}
    };
  }

  render() {
    const stateObj = this.hass.states[this.group];
    return html`
      <div class="group">
        <div class="wrap ${this.active ? 'active' : ''}">
          <ul class="speakers">
            ${stateObj.attributes.sonos_group.map(speaker => html`
              <li>${this.hass.states[speaker].attributes.friendly_name}</li>`)}
          </ul>
          <div class="play">
            <div class="content">
              <span class="currentTrack">${stateObj.attributes.media_artist} - ${stateObj.attributes.media_title}</span>
            </div>
            <div class="player ${stateObj.state === 'playing' ? 'active' : ''}">
              <div class="bar"></div>
              <div class="bar"></div>
              <div class="bar"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  static get styles() {
    return css`
      .group {
        padding:0;
        margin:0;
      }
      .group .wrap {
        border-radius:4px;
        margin:2px;
        padding:9px;
        background-color: var(--sonos-background-color);
        box-shadow: var(--sonos-box-shadow);
      }
      .group .wrap.active {
        margin:5px 0;
        border-color: var(--sonos-accent-color);
        border-width: thin;
        border-style: solid;
        font-weight: bold;
      }
      .group:first-child .wrap {
        margin-top:0;
      }
      .speakers {
        list-style:none;
        margin:0;
        padding:0;
      }
      .speakers li {
        display:block;
        font-size:12px;
        margin:5px 0 0 0;
        color:var(--sonos-color);
      }
      .speakers li:first-child {
        margin:0;
      }
      .group .play {
        display:flex;
        flex-direction:row;
        margin-top:10px;
      }
      .group .play .content {
        flex:1;
      }
      .group .play .content .currentTrack {
        display:block;
        font-size:10px;
      }
      .group .play .player {
        width:12px;
        position:relative;
      }
      .group .play .player .bar {
        background: var(--sonos-color);
        bottom: 1px;
        height: 3px;
        position: absolute;
        width: 3px;
        animation: sound 0ms -800ms linear infinite alternate;
        display:none;
      }
      .group .play .player.active .bar{
        display:block;
      }
      .group .play .player .bar:nth-child(1) {
        left: 1px;
        animation-duration: 474ms;
      }
      .group .play .player .bar:nth-child(2) {
        left: 5px;
        animation-duration: 433ms;
      }
      .group .play .player .bar:nth-child(3) {
        left: 9px;
        animation-duration: 407ms;
      }
      @keyframes sound {
        0% {
          opacity: .35;
          height: 3px;
        }
        100% {
          opacity: 1;
          height: 20px;
        }
      }      
    `;
  }
}

customElements.define('sonos-group', Group);
