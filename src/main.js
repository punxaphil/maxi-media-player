import {css, LitElement, html} from 'lit-element';
import Service from "./service";
import './player';
import './group';
import './grouping-buttons';
import './favorite-buttons';

class CustomSonosCard extends LitElement {
  static get properties() {
    return {
      hass: {},
      config: {},
      active: {},
      showVolumes: {}
    };
  }

  render() {
    this.service = new Service(this.hass);
    this.selected_player = window.location.href.indexOf('#') > 0 ? window.location.href.replaceAll(/.*#/g, '') : '';
    if (this.active) {
      this.setActivePlayer(this.active);
    }
    const groups = [];
    const mediaPlayers = [...new Set(this.config.entities)].sort();
    for (const entity of mediaPlayers) {
      const stateObj = this.hass.states[entity];
      if (!stateObj) {
        console.error(entity, 'not found. Check your config. Ignoring and moving on to next entity (if any).');
        continue;
      }

      if (!(entity in groups)) {
        groups[entity] = {
          members: {}, state: {}, roomName: '',
        };
      }
      groups[entity].state = stateObj.state;
      groups[entity].roomName = stateObj.attributes.friendly_name;


      if (stateObj.attributes.sonos_group.length > 1 && stateObj.attributes.sonos_group[0] === entity) {
        if (entity === this.selected_player) {
          this.setActivePlayer(entity);
        }
        for (const member of stateObj.attributes.sonos_group) {
          if (member !== entity) {
            const state = this.hass.states[member];
            groups[entity].members[member] = state.attributes.friendly_name;
            if (member === this.selected_player) {
              this.setActivePlayer(entity);
            }
          }
        }

        if (stateObj.state === 'playing' && !this.active) {
          this.setActivePlayer(entity);
        }
      } else if (stateObj.attributes.sonos_group.length > 1) {
        delete groups[entity];
      } else if (stateObj.state === 'playing' && !this.active) {
        this.setActivePlayer(entity);
      }
    }
    this.selected_player = null;
    if (!this.active) {
      this.setActivePlayer(Object.keys(groups)[0]);
    }
    return html`
      ${this.config.name ? html`
        <div class="header">
          <div class="name">${this.config.name}</div>
        </div>
      ` : ''}
      <div class="content">
        <div class="groups">
          <div class="title">${this.config.groupsTitle ? this.config.groupsTitle : 'Groups'}</div>
          ${Object.keys(groups).map(group => html`
            <sonos-group
                .hass=${this.hass}
                .group=${group}
                .active=${this.active === group}
                @click="${() => {
                  this.setActivePlayer(group);
                  this.showVolumes = false;
                }}">
            </sonos-group>
          `)}
        </div>

        <div class="players">
          <sonos-player
              .hass=${this.hass}
              .config=${this.config}
              .entityId=${this.active}
              .main=${this}
              .members=${groups[this.active].members}
              .service=${this.service}>
          </sonos-player>
          <div class="title">${this.config.groupingTitle ? this.config.groupingTitle : 'Grouping'}</div>
          <sonos-grouping-buttons
              .hass=${this.hass}
              .groups=${groups}
              .mediaPlayers=${mediaPlayers}
              .active=${this.active}
              .service=${this.service}>
          </sonos-grouping-buttons>
        </div>

        <div class="sidebar">
          <div class="title">${this.config.favoritesTitle ? this.config.favoritesTitle : 'Favorites'}</div>
          <sonos-favorite-buttons
              .hass=${this.hass}
              .config=${this.config}
              .mediaPlayers=${mediaPlayers}
              .active=${this.active}
              .service=${this.service}>
          </sonos-favorite-buttons>
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
        flex: 0 0 40%;
      }

      .list--header .list__link,
      .list__link {
        color: #888;
      }

      .content {
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
          .content {
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

customElements.define('custom-sonos-card', CustomSonosCard);
