import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { PlayerGroups, Section } from '../types';
import { CustomSonosCard } from '../main';
import { titleStyle } from '../sharedStyle';
import './grouping-buttons';

class Grouping extends LitElement {
  @property() main!: CustomSonosCard;
  @property() groups!: PlayerGroups;
  @property() mediaPlayers!: string[];

  render() {
    const config = this.main.config;
    if (!config.singleSectionMode || config.singleSectionMode === Section.GROUPING) {
      return html`
        <div style="${this.main.buttonSectionStyle()}">
          <div style="${this.main.stylable('title', titleStyle)}">
            ${config.groupingTitle ? config.groupingTitle : 'Grouping'}
          </div>
          <sonos-grouping-buttons
            .main=${this.main}
            .groups=${this.groups}
            .mediaPlayers=${this.mediaPlayers}
          ></sonos-grouping-buttons>
        </div>
      `;
    }
    return html``;
  }
}

customElements.define('sonos-grouping', Grouping);
