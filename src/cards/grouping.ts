import { css, html, LitElement } from 'lit';
import { titleStyle } from '../sharedStyle';
import {
  buttonSectionStyle,
  createPlayerGroups,
  getEntityName,
  getMediaPlayers,
  listenForActivePlayer,
  noPlayerHtml,
  sharedStyle,
  stopListeningForActivePlayer,
  stylable,
  validateConfig,
  wrapInHaCardUnlessAllSectionsShown,
} from '../utils';
import { property } from 'lit/decorators.js';
import { CardConfig, PlayerGroups } from '../types';
import { when } from 'lit/directives/when.js';
import { styleMap } from 'lit-html/directives/style-map.js';
import { HomeAssistant } from 'custom-card-helpers';
import MediaControlService from '../services/media-control-service';
import HassService from '../services/hass-service';

export class Grouping extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property() config!: CardConfig;
  @property() private activePlayer!: string;
  mediaControlService!: MediaControlService;
  hassService!: HassService;

  private groups!: PlayerGroups;
  private mediaPlayers!: string[];

  activePlayerListener = (event: Event) => {
    this.activePlayer = (event as CustomEvent).detail.player;
  };

  connectedCallback() {
    super.connectedCallback();
    listenForActivePlayer(this.activePlayerListener);
  }

  disconnectedCallback() {
    stopListeningForActivePlayer(this.activePlayerListener);
    super.disconnectedCallback();
  }

  setConfig(config: CardConfig) {
    const parsed = JSON.parse(JSON.stringify(config));
    validateConfig(parsed);
    this.config = parsed;
  }

  render() {
    if (this.activePlayer && this.hass) {
      this.hassService = new HassService(this.hass);
      this.mediaControlService = new MediaControlService(this.hass, this.hassService);
      this.mediaPlayers = getMediaPlayers(this.config, this.hass);
      this.groups = createPlayerGroups(this.mediaPlayers, this.hass, this.config);
      const joinedPlayers = this.mediaPlayers.filter(
        (player) => player !== this.activePlayer && this.groups[this.activePlayer].members[player],
      );
      const notJoinedPlayers = this.mediaPlayers.filter(
        (player) => player !== this.activePlayer && !this.groups[this.activePlayer].members[player],
      );
      const cardHtml = html`
        <div style="${buttonSectionStyle(this.config)}">
          <div style="${stylable('title', this.config, titleStyle)}">
            ${this.config.groupingTitle ? this.config.groupingTitle : 'Grouping'}
          </div>
          <div style="${this.membersStyle()}">
            ${this.activePlayer &&
            this.mediaPlayers.map((entity) => this.renderMediaPlayerGroupButton(entity, joinedPlayers))}
            ${when(notJoinedPlayers.length, () => {
              return this.getButton(
                async () => await this.mediaControlService.join(this.activePlayer, notJoinedPlayers),
                'mdi:checkbox-multiple-marked-outline',
              );
            })}
            ${when(joinedPlayers.length, () =>
              this.getButton(
                async () => await this.mediaControlService.unjoin(joinedPlayers),
                'mdi:minus-box-multiple-outline',
              ),
            )}
          </div>
          ${when(this.config.predefinedGroups, () => this.renderPredefinedGroup())}
        </div>
      `;
      return wrapInHaCardUnlessAllSectionsShown(cardHtml, this.config);
    } else {
      return noPlayerHtml;
    }
  }

  private renderMediaPlayerGroupButton(entity: string, joinedPlayers: string[]) {
    const name = getEntityName(this.hass, this.config, entity);
    if (this.groups[this.activePlayer].members[entity] || (entity === this.activePlayer && joinedPlayers.length > 0)) {
      return this.getButton(async () => await this.mediaControlService.unjoin([entity]), 'mdi:minus', name);
    } else if (entity !== this.activePlayer) {
      return this.getButton(
        async () => await this.mediaControlService.join(this.activePlayer, [entity]),
        'mdi:plus',
        name,
      );
    } else {
      return html``;
    }
  }

  private renderPredefinedGroup() {
    return html`
      <div style="${stylable('title', this.config, titleStyle)}">
        ${this.config.predefinedGroupsTitle ? this.config.predefinedGroupsTitle : 'Predefined groups'}
      </div>
      <div style="${this.membersStyle()}">
        ${this.config.predefinedGroups
          ?.filter((group) => group.entities.length > 1)
          .map((group) => {
            return this.getButton(
              async () => {
                await this.mediaControlService.unjoin(group.entities);
                await this.mediaControlService.join(group.entities[0], group.entities);
              },
              '',
              group.name,
            );
          })}
      </div>
    `;
  }

  private getButton(click: () => void, icon: string, name?: string) {
    return html`
      <div @click="${click}" style="${this.memberStyle()}" class="hoverable">
        ${name ? html`<span style="${Grouping.nameStyle()}">${name}</span>` : ''}
        <ha-icon .icon=${icon} style="${Grouping.iconStyle()}"></ha-icon>
      </div>
    `;
  }

  private membersStyle() {
    return stylable('members', this.config, {
      padding: '0',
      margin: '0',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    });
  }

  private memberStyle() {
    return stylable('member', this.config, {
      flexGrow: '1',
      borderRadius: 'var(--sonos-int-border-radius)',
      margin: '0 0.25rem 0.5rem',
      padding: '0.45rem',
      display: 'flex',
      justifyContent: 'center',
      border: 'var(--sonos-int-border-width) solid var(--sonos-int-color)',
      backgroundColor: 'var(--sonos-int-background-color)',
      maxWidth: 'calc(100% - 1.4rem)',
    });
  }

  private static nameStyle() {
    return styleMap({
      alignSelf: 'center',
      fontSize: '1rem',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    });
  }

  private static iconStyle() {
    return styleMap({
      alignSelf: 'center',
      fontSize: '0.5rem',
    });
  }

  static get styles() {
    return [
      css`
        .hoverable:hover,
        .hoverable:focus {
          color: var(--sonos-int-accent-color);
          border: var(--sonos-int-border-width) solid var(--sonos-int-accent-color);
        }
      `,
      sharedStyle,
    ];
  }
}
