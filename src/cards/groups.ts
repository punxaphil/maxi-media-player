import { html, LitElement } from 'lit';
import { CardConfig, PlayerGroups } from '../types';
import { titleStyle } from '../sharedStyle';
import '../components/group';
import {
  buttonSectionStyle,
  createPlayerGroups,
  getMediaPlayers,
  isPlaying,
  noPlayerHtml,
  sharedStyle,
  stylable,
  validateConfig,
  wrapInHaCardUnlessAllSectionsShown,
} from '../utils';
import { property } from 'lit/decorators.js';
import { HomeAssistant } from 'custom-card-helpers';

export class Groups extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property() config!: CardConfig;
  private groups!: PlayerGroups;
  private entityId!: string;

  setConfig(config: CardConfig) {
    const parsed = JSON.parse(JSON.stringify(config));
    validateConfig(parsed);
    this.config = parsed;
  }

  render() {
    if (this.hass) {
      const mediaPlayers = getMediaPlayers(this.config, this.hass);
      this.groups = createPlayerGroups(mediaPlayers, this.hass, this.config);
      this.determineEntityId(this.groups);
      const cardHtml = html`
        <div style="${buttonSectionStyle(this.config)}">
          <div style="${stylable('title', this.config, titleStyle)}">
            ${this.config.groupsTitle ? this.config.groupsTitle : 'Groups'}
          </div>
          ${Object.values(this.groups).map(
            (group) =>
              html`
                <sonos-group
                  .config=${this.config}
                  .hass=${this.hass}
                  .group=${group}
                  .selected="${this.entityId === group.entity}"
                ></sonos-group>
              `,
          )}
        </div>
      `;
      return wrapInHaCardUnlessAllSectionsShown(cardHtml, this.config);
    }
    return noPlayerHtml;
  }

  determineEntityId(playerGroups: PlayerGroups) {
    if (!this.entityId) {
      const entityId =
        this.config.entityId || (window.location.href.indexOf('#') > 0 ? window.location.href.replace(/.*#/g, '') : '');
      for (const player in playerGroups) {
        if (player === entityId) {
          this.entityId = player;
        } else {
          for (const member in playerGroups[player].members) {
            if (member === entityId) {
              this.entityId = player;
            }
          }
        }
      }
      if (!this.entityId) {
        for (const player in playerGroups) {
          if (isPlaying(playerGroups[player].state)) {
            this.entityId = player;
          }
        }
      }
      if (!this.entityId) {
        this.entityId = Object.keys(playerGroups)[0];
      }
    }
  }

  static get styles() {
    return sharedStyle;
  }
}
