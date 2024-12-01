import { css, LitElement } from 'lit';
import { fireEvent, HomeAssistant } from 'custom-card-helpers';
import { property } from 'lit/decorators.js';
import { CardConfig } from '../types';

export abstract class BaseEditor extends LitElement {
  @property({ attribute: false }) config!: CardConfig;
  @property({ attribute: false }) hass!: HomeAssistant;

  setConfig(config: CardConfig) {
    this.config = JSON.parse(JSON.stringify(config));
  }
  static get styles() {
    return css`
      ha-svg-icon {
        margin: 5px;
      }
      ha-control-button {
        white-space: nowrap;
      }
      ha-control-button-group {
        margin: 5px;
      }
      div {
        margin-top: 20px;
      }
    `;
  }

  protected configChanged() {
    fireEvent(this, 'config-changed', { config: this.config });
    this.requestUpdate();
  }
  protected dispatchClose() {
    return this.dispatchEvent(new CustomEvent('closed'));
  }
}

export type Schema = { cardType: string; [name: string]: unknown };
