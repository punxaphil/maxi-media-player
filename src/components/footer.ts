import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { CardConfig, Section } from '../types';
import './section-button';

const { GROUPING, GROUPS, MEDIA_BROWSER, PLAYER, VOLUMES } = Section;

class Footer extends LitElement {
  @property({ attribute: false }) config!: CardConfig;
  @property() section!: Section;

  render() {
    const icons = this.config.sectionIcons;
    let sections = [
      [PLAYER, icons?.player ?? 'mdi:home'],
      [MEDIA_BROWSER, icons?.mediaBrowser ?? 'mdi:star-outline'],
      [GROUPS, icons?.groups ?? 'mdi:speaker-multiple'],
      [GROUPING, icons?.grouping ?? 'mdi:checkbox-multiple-marked-circle-outline'],
      [VOLUMES, icons?.volumes ?? 'mdi:tune'],
    ];
    sections = sections.filter(([section]) => !this.config.sections || this.config.sections?.includes(section));
    return html`
      ${sections.map(
        ([section, icon]) => html`
          <mxmp-section-button
            .config=${this.config}
            .icon=${icon}
            .selectedSection=${this.section}
            .section=${section}
          ></mxmp-section-button>
        `,
      )}
    `;
  }

  static get styles() {
    return css`
      :host {
        display: flex;
        justify-content: space-between;
      }
      :host > * {
        padding: 1rem;
      }
    `;
  }
}

customElements.define('mxmp-footer', Footer);
