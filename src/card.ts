import { HomeAssistant } from 'custom-card-helpers';
import { css, html, LitElement } from 'lit';
import { property, state } from 'lit/decorators.js';
import { choose } from 'lit/directives/choose.js';
import Store from './model/store';
import { CardConfig, Section } from './types';
import './components/footer';
import './editor/editor';
import { ACTIVE_PLAYER_EVENT, CALL_MEDIA_DONE, CALL_MEDIA_STARTED } from './constants';
import { when } from 'lit/directives/when.js';
import { styleMap } from 'lit-html/directives/style-map.js';
import { cardDoesNotContainAllSections, getHeight, getWidth } from './utils/utils';

const { GROUPING, GROUPS, MEDIA_BROWSER, PLAYER, VOLUMES } = Section;
const TITLE_HEIGHT = 2;
const FOOTER_HEIGHT = 5;

export class Card extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) config!: CardConfig;
  @state() section!: Section;
  @state() store!: Store;
  @state() showLoader!: boolean;
  @state() loaderTimestamp!: number;
  @state() cancelLoader!: boolean;
  @state() activePlayerId!: string;

  render() {
    this.createStore();
    let height = getHeight(this.config);
    const sections = this.config.sections;
    const showFooter = !sections || sections.length > 1;
    const contentHeight = showFooter ? height - FOOTER_HEIGHT : height;
    const title = this.config.title;
    height = title ? height + TITLE_HEIGHT : height;
    return html`
      <ha-card style=${this.haCardStyle(height)}>
        <div class="loader" ?hidden=${!this.showLoader}>
          <ha-circular-progress indeterminate></ha-circular-progress></div
        >
        </div>
        ${title ? html`<div class="title">${title}</div>` : html``}
        <div class="content" style=${this.contentStyle(contentHeight)}>
          ${
            this.activePlayerId
              ? choose(this.section, [
                  [PLAYER, () => html` <mxmp-player .store=${this.store}></mxmp-player>`],
                  [
                    GROUPS,
                    () =>
                      html` <mxmp-groups
                        .store=${this.store}
                        @active-player=${this.activePlayerListener}
                      ></mxmp-groups>`,
                  ],
                  [
                    GROUPING,
                    () =>
                      html`<mxmp-grouping
                        .store=${this.store}
                        @active-player=${this.activePlayerListener}
                      ></mxmp-grouping>`,
                  ],
                  [
                    MEDIA_BROWSER,
                    () => html`
                      <mxmp-media-browser
                        .store=${this.store}
                        @item-selected=${this.onMediaItemSelected}
                      ></mxmp-media-browser>
                    `,
                  ],
                  [VOLUMES, () => html` <mxmp-volumes .store=${this.store}></mxmp-volumes>`],
                ])
              : html`<div class="no-players">No supported players found</div>`
          }
        </div>
        ${when(
          showFooter,
          () =>
            html`<mxmp-footer
              style=${this.footerStyle()}
              .config=${this.config}
              .section=${this.section}
              @show-section=${this.showSectionListener}
            >
            </mxmp-footer>`,
        )}
      </ha-card>
    `;
  }
  private createStore() {
    if (this.activePlayerId) {
      this.store = new Store(this.hass, this.config, this.section, this, this.activePlayerId);
    } else {
      this.store = new Store(this.hass, this.config, this.section, this);
      this.activePlayerId = this.store.activePlayer?.id;
    }
  }
  getCardSize() {
    return 3;
  }

  static getConfigElement() {
    return document.createElement('mxmp-editor');
  }

  connectedCallback() {
    super.connectedCallback();
    if (cardDoesNotContainAllSections(this.config)) {
      window.addEventListener(ACTIVE_PLAYER_EVENT, this.activePlayerListener);
    }
    window.addEventListener(CALL_MEDIA_STARTED, this.callMediaStartedListener);
    window.addEventListener(CALL_MEDIA_DONE, this.callMediaDoneListener);
  }

  disconnectedCallback() {
    window.removeEventListener(ACTIVE_PLAYER_EVENT, this.activePlayerListener);
    super.disconnectedCallback();
  }

  private showSectionListener = (event: Event) => {
    const section = (event as CustomEvent).detail;
    if (!this.config.sections || this.config.sections.indexOf(section) > -1) {
      this.section = section;
    }
  };

  private callMediaStartedListener = (event: Event) => {
    if (!this.showLoader && (!this.config.sections || (event as CustomEvent).detail.section === this.section)) {
      this.cancelLoader = false;
      setTimeout(() => {
        if (!this.cancelLoader) {
          this.showLoader = true;
          this.loaderTimestamp = Date.now();
        }
      }, 300);
    }
  };

  private callMediaDoneListener = () => {
    this.cancelLoader = true;
    const duration = Date.now() - this.loaderTimestamp;
    if (this.showLoader) {
      if (duration < 1000) {
        setTimeout(() => (this.showLoader = false), 1000 - duration);
      } else {
        this.showLoader = false;
      }
    }
  };

  activePlayerListener = (event: Event) => {
    const newEntityId = (event as CustomEvent).detail.entityId;
    if (newEntityId !== this.activePlayerId) {
      this.activePlayerId = newEntityId;
      if (this.config.sections?.includes(PLAYER)) {
        this.section = PLAYER;
      }
      this.requestUpdate();
    }
  };

  private onMediaItemSelected = () => {
    if (this.config.sections?.includes(PLAYER)) {
      setTimeout(() => (this.section = PLAYER), 1000);
    }
  };

  haCardStyle(height: number) {
    const width = getWidth(this.config);
    return styleMap({
      color: 'var(--secondary-text-color)',
      height: `${height}rem`,
      minWidth: `20rem`,
      maxWidth: `${width}rem`,
      overflow: 'hidden',
    });
  }

  footerStyle() {
    return styleMap({
      height: `${FOOTER_HEIGHT}rem`,
      paddingBottom: '1rem',
    });
  }

  private contentStyle(height: number) {
    return styleMap({
      overflowY: 'auto',
      height: `${height}rem`,
    });
  }

  setConfig(config: CardConfig) {
    const newConfig = JSON.parse(JSON.stringify(config));
    for (const [key, value] of Object.entries(newConfig)) {
      if (Array.isArray(value) && value.length === 0) {
        delete newConfig[key];
      }
    }
    const sections = newConfig.sections;
    if (sections) {
      this.section = sections.includes(PLAYER)
        ? PLAYER
        : sections.includes(MEDIA_BROWSER)
          ? MEDIA_BROWSER
          : sections.includes(GROUPS)
            ? GROUPS
            : sections.includes(GROUPING)
              ? GROUPING
              : VOLUMES;
    } else {
      this.section = PLAYER;
    }
    newConfig.mediaBrowserItemsPerRow = newConfig.mediaBrowserItemsPerRow || 4;
    // support custom:auto-entities
    if (newConfig.entities?.length && newConfig.entities[0].entity) {
      newConfig.entities = newConfig.entities.map((entity: { entity: string }) => entity.entity);
    }
    this.config = newConfig;
  }

  static get styles() {
    return css`
      :host {
        --mdc-icon-button-size: 3rem;
        --mdc-icon-size: 2rem;
      }
      ha-circular-progress {
        --md-sys-color-primary: var(--accent-color);
      }
      .loader {
        position: absolute;
        z-index: 1000;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        --mdc-theme-primary: var(--accent-color);
      }
      .title {
        margin: 0.4rem 0;
        text-align: center;
        font-weight: bold;
        font-size: 1.2rem;
        color: var(--secondary-text-color);
      }
      .no-players {
        text-align: center;
        margin-top: 50%;
      }
    `;
  }
}
