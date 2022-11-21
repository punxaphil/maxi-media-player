import { html, LitElement } from 'lit';
import { CardConfig, PlayerGroups } from '../types';
import { titleStyle } from '../sharedStyle';
import '../components/group';
import {
  buttonSectionStyle,
  createPlayerGroups,
  getMediaPlayers,
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
  private activePlayer!: string;

  setConfig(config: CardConfig) {
    const parsed = JSON.parse(JSON.stringify(config));
    validateConfig(parsed);
    this.config = parsed;
  }

  render() {
    if (this.hass) {
      const mediaPlayers = getMediaPlayers(this.config, this.hass);
      this.groups = createPlayerGroups(mediaPlayers, this.hass, this.config);
      this.determineActivePlayer(this.groups);
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
                  .activePlayer="${this.activePlayer}"
                ></sonos-group>
              `,
          )}
        </div>
      `;
      return wrapInHaCardUnlessAllSectionsShown(cardHtml, this.config);
    }
    return noPlayerHtml;
  }

  determineActivePlayer(playerGroups: PlayerGroups) {
    if (!this.activePlayer) {
      const selected_player =
        this.config.selectedPlayer ||
        (window.location.href.indexOf('#') > 0 ? window.location.href.replace(/.*#/g, '') : '');
      for (const player in playerGroups) {
        if (player === selected_player) {
          this.activePlayer = player;
        } else {
          for (const member in playerGroups[player].members) {
            if (member === selected_player) {
              this.activePlayer = player;
            }
          }
        }
      }
      if (!this.activePlayer) {
        for (const player in playerGroups) {
          if (playerGroups[player].state === 'playing') {
            this.activePlayer = player;
          }
        }
      }
      if (!this.activePlayer) {
        this.activePlayer = Object.keys(playerGroups)[0];
      }
    }
  }

  static get styles() {
    return sharedStyle;
  }
}
