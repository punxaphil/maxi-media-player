import { css, html, LitElement, nothing } from 'lit';
import { property } from 'lit/decorators.js';
import { CardConfig, Section } from '../types';
import { customEvent } from '../utils/utils';
import { SHOW_SECTION } from '../constants';

export class SectionButton extends LitElement {
  @property({ attribute: false }) config!: CardConfig;
  @property() icon!: string;
  @property() section!: Section;
  @property() selectedSection!: Section;

  render() {
    return html`<ha-icon-button
      @click=${() => this.dispatchSection()}
      selected=${this.selectedSection === this.section || nothing}
    >
      <ha-icon .icon=${this.icon}></ha-icon>
    </ha-icon-button>`;
  }

  private dispatchSection() {
    this.dispatchEvent(customEvent(SHOW_SECTION, this.section));
  }

  static get styles() {
    return css`
      :host > *[selected] {
        color: var(--accent-color);
      }
    `;
  }
}

customElements.define('mxmp-section-button', SectionButton);
