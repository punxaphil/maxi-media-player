import {css, LitElement, html} from 'lit-element';
import Service from "./service";
import './player';

class CustomSonosCard extends LitElement {
  static get properties() {
    return {
      hass: {},
      config: {},
      active: {},
      showVolumes: {}
    };
  }

  constructor() {
    super();
    this.favorites = [];
  }

  render() {
    this.service = new Service(this.hass);
    this.selected_player = window.location.href.indexOf('#') > 0 ? window.location.href.replaceAll(/.*#/g, '') : '';
    if (this.active) {
      this.setActivePlayer(this.active);
    }
    const speakerNames = [];
    const zones = [];
    this.mediaPlayers = [...new Set(this.config.entities)].sort();
    for (const entity of this.mediaPlayers) {
      const stateObj = this.hass.states[entity];
      if (!stateObj) {
        console.error(entity, 'not found. Check your config. Ignoring and moving on to next entity (if any).');
        continue;
      }
      // Get favorites list
      if (!this.favorites.length) {
        for (const favorite of stateObj.attributes.source_list) {
          this.favorites.push(favorite);
        }
        if (this.config.shuffleFavorites) shuffleArray(this.favorites);
      }

      if (!(entity in zones)) {
        zones[entity] = {
          members: {},
          state: {},
          roomName: '',
        };
        speakerNames[entity] = stateObj.attributes.friendly_name;
        if (entity === this.selected_player) {
          this.setActivePlayer(entity);
        }
      }
      zones[entity].state = stateObj.state;
      zones[entity].roomName = stateObj.attributes.friendly_name;


      if (stateObj.attributes.sonos_group.length > 1 && stateObj.attributes.sonos_group[0] === entity) {
        for (const member of stateObj.attributes.sonos_group) {
          if (member !== entity) {
            const state = this.hass.states[member];
            zones[entity].members[member] = state.attributes.friendly_name;
            if (member === this.selected_player) {
              this.setActivePlayer(entity);
            }
          }
        }

        if (stateObj.state === 'playing' && !this.active) {
          this.setActivePlayer(entity);
        }
      } else if (stateObj.attributes.sonos_group.length > 1) {
        delete zones[entity];
      } else if (stateObj.state === 'playing' && !this.active) {
        this.setActivePlayer(entity);
      }
    }
    this.selected_player = null;
    if (!this.active) {
      this.setActivePlayer(Object.keys(zones)[0]);
    }

    const groupTemplates = [];
    let playerTemplate = html``;
    const favoriteTemplates = [];
    const memberTemplates = [];
    const joinedZones = [];
    const notJoinedZones = [];
    for (const key in zones) {
      const stateObj = this.hass.states[key];
      groupTemplates.push(html`
        <div class="group" @click="${() => {
          this.setActivePlayer(key);
          this.showVolumes = false;
        }}">
          <div class="wrap ${this.active === key ? 'active' : ''}">
            <ul class="speakers">
              ${stateObj.attributes.sonos_group.map(speaker => html`
                <li>${speakerNames[speaker]}</li>`)}
            </ul>
            <div class="play">
              <div class="content">
                <span
                    class="currentTrack">${stateObj.attributes.media_artist} - ${stateObj.attributes.media_title}</span>
              </div>
              <div class="player ${stateObj.state === 'playing' ? 'active' : ''}">
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
              </div>
            </div>
          </div>
        </div>
      `);
    }

    if (this.active !== '') {
      for (const entity of this.mediaPlayers) {
        if (entity !== this.active) {
          if (zones[this.active].members[entity]) {
            joinedZones.push(entity);
            memberTemplates.push(html`
              <div class="member" @click="${() => this.service.unjoin(entity)}">
                <span>${zones[this.active].members[entity]} </span>
                <ha-icon .icon=${'mdi:minus'}></ha-icon>
              </div>
            `);
          } else {
            notJoinedZones.push(entity);
            memberTemplates.push(html`
              <div class="member" @click="${() => this.service.join(this.active, entity)}">
                <span>${this.hass.states[entity].attributes.friendly_name} </span>
                <ha-icon .icon=${'mdi:plus'}></ha-icon>
              </div>
            `);
          }
        }
      }

      for (const favorite of this.favorites) {
        favoriteTemplates.push(html`
          <div class="favorite" @click="${() => this.service.setSource(this.active, favorite)}"><span>${favorite}</span>
            <ha-icon .icon=${'mdi:play'}></ha-icon>
          </div>
        `);
      }
    }


    return html`
      ${this.config.name ? html`
        <div class="header">
          <div class="name">${this.config.name}</div>
        </div>
      ` : ''}
      <div class="center">
        <div class="groups">
          <div class="title">${this.config.groupsTitle ? this.config.groupsTitle : 'Groups'}</div>
          ${groupTemplates}
        </div>

        <div class="players">
          <sonos-player
              .hass=${this.hass} 
              .config=${this.config} 
              .entityId=${this.active} 
              .main=${this}
              .members=${zones[this.active].members} 
              .service=${this.service}>
          </sonos-player>
          <div class="title">${this.config.groupingTitle ? this.config.groupingTitle : 'Grouping'}</div>
          <div class="members">
            ${memberTemplates}
            <div class="member" @click="${() => this.service.join(this.active, notJoinedZones.join(','))}">
              <ha-icon .icon=${'mdi:checkbox-multiple-marked-outline'}></ha-icon>
            </div>
            <div class="member"
                 @click="${() => this.service.unjoin(joinedZones.join(','))}">
              <ha-icon .icon=${'mdi:minus-box-multiple-outline'}></ha-icon>
            </div>
          </div>
        </div>

        <div class="sidebar">
          <div class="title">${this.config.favoritesTitle ? this.config.favoritesTitle : 'Favorites'}</div>
          <div class="favorites">
            ${favoriteTemplates}
          </div>
        </div>
      </div>
    `;
  }

  setConfig(config) {
    if (!config.entities) {
      throw new Error('You need to define entities');
    }
    this.config = config;
  }

  getCardSize() {
    return this.config.entities.length + 1;
  }

  static get styles() {
    return css`
      ha-card {
        background: var(
          --ha-card-background,
          var(--paper-card-background-color, white)
        );
        border-radius: var(--ha-card-border-radius, 2px);
        box-shadow: var(
          --ha-card-box-shadow,
          0 2px 2px 0 rgba(0, 0, 0, 0.14),
          0 1px 5px 0 rgba(0, 0, 0, 0.12),
          0 3px 1px -2px rgba(0, 0, 0, 0.2)
        );
        color: var(--primary-text-color);
        display: block;
        transition: all 0.3s ease-out;
        padding: 16px;
      }
      .header {
        color: var(--ha-card-header-color, --primary-text-color);
        font-family: var(--ha-card-header-font-family, inherit);
        font-size: var(--ha-card-header-font-size, 24px);
        letter-spacing: -0.012em;
        line-height: 32px;
        padding: 4px 0 12px;
        display: block;
      }
      .header .name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .players {
        flex: 0 0 50%;
      }

      .list--header .list__link,
      .list__link {
        color: #888;
      }

      .center {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: center;
      }

      .groups {
        margin: 0 20px 0 20px;
        padding: 0;
        flex: 0 0 20%; 
      }
      .group {
        padding:0;
        margin:0;
      }
      .group .wrap {
        border-radius:4px;
        margin:2px;
        padding:9px;
        background-color: var(
          --ha-card-background,
          var(--paper-card-background-color, white)
        );
      }
      .group .wrap.active {
        margin:5px 0;
        box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.19), 0 6px 6px -10px rgba(0, 0, 0, 0.23);
        border-color: #d30320;
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
        margin:5px 0 0 0 ;
        color:#000;
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
      .group .play .content .source {
        display:block;
        color:#CCC;
        font-size:10px;
      }
      .group .play .content .currentTrack {
        display:block;
        font-size:12px;
      }
      .group .play .player {
        width:12px;
        position:relative;
      }
      .group .play .player .bar {
        background: #666;
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

      .sidebar {
        margin:0 20px 0 20px;
        padding:0;
        flex: 0 0 20%;
      }
      .title {
        margin-top: 10px;
        text-align: center;
        color: var(
          --ha-card-background,
          var(--paper-card-background-color, white)
        );
        font-weight: bold;
        font-size: larger;
      }
      .members {
        padding:0;
        margin:0;
        display: flex;
        flex-direction:row;
        flex-wrap: wrap;
        justify-content: space-between;
      }
      .member {
        flex-grow: 1;
        border-radius:4px;
        margin:2px;
        padding:9px;
        display: flex;
        justify-content: center;
        background-color: var(
          --ha-card-background,
          var(--paper-card-background-color, white)
        );
        box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.19), 0 6px 6px -10px rgba(0, 0, 0, 0.23);
      }
      .member span {
        align-self:center;
        font-size:12px;
        color:#000;
      }
      .member ha-icon {
        align-self:center;
        font-size:10px;
        color: #888;
      }
      .member:hover ha-icon {
        color: #d30320;
      }

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
        background-color: var(
          --ha-card-background,
          var(--paper-card-background-color, white)
        );
        box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.19), 0 6px 6px -10px rgba(0, 0, 0, 0.23);
      }
      .favorite span {
        font-size:12px;
        color:#000;
      }
      .favorite ha-icon {
        font-size:10px;
        color: #888;
      }
      .favorite:hover ha-icon {
        color: #d30320;
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
      
      @media (max-width: 650px) {
          .center {
            flex-wrap: wrap;
          }
          .players {
            order: 0;
          }   
          .groups {
            order: 1;
          }   
          .sidebar {
            order: 2;
          } 
      } 
    `;
  }

  setActivePlayer(entity) {
    this.active = entity;
    const newUrl = window.location.href.replaceAll(/#.*/g, '');
    window.location.href = `${newUrl}#${entity}`;
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

customElements.define('custom-sonos-card', CustomSonosCard);
