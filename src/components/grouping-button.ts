import { css, html, LitElement, nothing } from 'lit';
import { property } from 'lit/decorators.js';

export class GroupingButton extends LitElement {
  @property() icon!: string;
  @property() name!: string;

  render() {
    const iconAndName = (!!this.icon && !!this.name) || nothing;
    return html`
      <ha-control-button>
        ${this.icon ? html` <ha-icon icon-and-name=${iconAndName} .icon=${this.icon}></ha-icon>` : ''}
        ${this.name ? html`<span>${this.name}</span>` : ''}
      </ha-control-button>
    `;
  }

  static get styles() {
    return css`
      ha-control-button {
        width: fit-content;
        --control-button-background-color: var(--accent-color);
        --control-button-icon-color: var(--secondary-text-color);
      }

      ha-icon {
        padding-left: 1rem;
        padding-right: 1rem;
      }
      ha-icon[icon-and-name] {
        padding-right: 0;
      }

      span {
        padding-right: 1rem;
        padding-left: 1rem;
        font-weight: bold;
      }
    `;
  }
}

customElements.define('sonos-grouping-button', GroupingButton);
