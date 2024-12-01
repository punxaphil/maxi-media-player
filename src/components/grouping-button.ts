import { css, html, LitElement, nothing } from 'lit';
import { property } from 'lit/decorators.js';

export class GroupingButton extends LitElement {
  @property() icon!: string;
  @property() name!: string;
  @property() selected!: boolean;

  render() {
    const iconAndName = (!!this.icon && !!this.name) || nothing;
    return html`
      <ha-control-button selected=${this.selected || nothing}>
        <div>
          ${this.icon ? html` <ha-icon icon-and-name=${iconAndName} .icon=${this.icon}></ha-icon>` : ''}
          ${this.name ? html`<span>${this.name}</span>` : ''}
        </div>
      </ha-control-button>
    `;
  }

  static get styles() {
    return css`
      ha-control-button {
        width: fit-content;
        --control-button-background-color: var(--secondary-text-color);
        --control-button-icon-color: var(--secondary-text-color);
      }
      ha-control-button[selected] {
        --control-button-icon-color: var(--accent-color);
      }

      span {
        font-weight: bold;
      }
    `;
  }
}

customElements.define('mxmp-grouping-button', GroupingButton);
