import {LitElement, html, css} from 'lit-element';
import Service from "./service";

class GroupingButtons extends LitElement {

  static get properties() {
    return {
      hass: {}, groups: {}, mediaPlayers: {}, active: {}, service: Service
    };
  }

  render() {
    const joinedPlayers = this.mediaPlayers.filter(player => player !== this.active && this.groups[this.active].members[player]);
    const notJoinedPlayers = this.mediaPlayers.filter(player => player !== this.active && !this.groups[this.active].members[player]);

    return html`
      <div class="members">
        ${this.active && this.mediaPlayers
            .filter(entity => entity !== this.active)
            .map((entity) => {
              if (this.groups[this.active].members[entity]) {
                return html`
                      <div class="member" @click="${() => this.service.unjoin(entity)}">
                        <span>${this.groups[this.active].members[entity]} </span>
                        <ha-icon .icon=${'mdi:minus'}></ha-icon>
                      </div>
                    `;
              } else {
                return html`
                      <div class="member" @click="${() => this.service.join(this.active, entity)}">
                        <span>${this.hass.states[entity].attributes.friendly_name} </span>
                        <ha-icon .icon=${'mdi:plus'}></ha-icon>
                      </div>
                    `;
              }
            })}
        <div class="member" @click="${() => this.service.join(this.active, notJoinedPlayers.join(','))}">
          <ha-icon .icon=${'mdi:checkbox-multiple-marked-outline'}></ha-icon>
        </div>
        <div class="member"
             @click="${() => this.service.unjoin(joinedPlayers.join(','))}">
          <ha-icon .icon=${'mdi:minus-box-multiple-outline'}></ha-icon>
        </div>
      </div>
    `;
  }

  static get styles() {
    return css`
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
        background-color: var(--sonos-background-color);
        box-shadow: var(--sonos-box-shadow);
      }
      .member span {
        align-self:center;
        font-size:12px;
      }
      .member ha-icon {
        align-self:center;
        font-size:10px;
      }
      .member:hover ha-icon {
        color: var(--sonos-accent-color);
      }
    `;
  }
}

customElements.define('sonos-grouping-buttons', GroupingButtons);
