import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { CardConfig, MediaPlayerItem } from '../types';
import { HomeAssistant } from 'custom-card-helpers';
import { stylable } from '../utils';

class MediaButton extends LitElement {
  @property() mediaItem!: MediaPlayerItem;
  @property() hass!: HomeAssistant;
  @property() config!: CardConfig;

  render() {
    const thumbnail = this.getThumbnail();
    return html`
      <div style="${this.wrapperStyle()}">
        <div style="${this.mediaButtonStyle(thumbnail)}" class="hoverable">
          <div style="${this.titleStyle(thumbnail)}">${this.mediaItem.title}</div>
          <ha-icon style="${this.folderStyle(thumbnail)}" .icon=${'mdi:folder-music'}></ha-icon>
        </div>
      </div>
    `;
  }

  private getThumbnail() {
    let thumbnail = this.mediaItem.thumbnail;
    if (!thumbnail) {
      thumbnail = this.config.customThumbnailIfMissing?.[this.mediaItem.title] || '';
    } else if (thumbnail?.match(/https:\/\/brands.home-assistant.io\/.+\/logo.png/)) {
      thumbnail = thumbnail?.replace('logo.png', 'icon.png');
    }
    return thumbnail;
  }
  private wrapperStyle() {
    return stylable('media-button-wrapper', this.config, {
      padding: '0 0.3rem 0.6rem 0.3rem',
    });
  }
  private mediaButtonStyle(thumbnail: string) {
    return stylable('media-button', this.config, {
      boxSizing: 'border-box',
      '-moz-box-sizing': 'border-box',
      '-webkit-box-sizing': 'border-box',
      overflow: 'hidden',
      border: 'var(--sonos-int-border-width) solid var(--sonos-int-color)',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 'var(--sonos-int-border-radius)',
      justifyContent: 'center',
      backgroundColor: 'var(--sonos-int-background-color)',
      ...((thumbnail || this.mediaItem.can_expand) && {
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        position: 'relative',
        paddingBottom: 'calc(100% - (var(--sonos-int-border-width) * 2))',
      }),
      ...(thumbnail && { backgroundImage: 'url(' + thumbnail + ')' }),
    });
  }
  private titleStyle(thumbnail: string) {
    return stylable('media-button-title', this.config, {
      width: 'calc(100% - 1rem)',
      fontSize: '1rem',
      padding: '0px 0.5rem',
      ...((thumbnail || this.mediaItem.can_expand) && {
        zIndex: '1',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'var(--sonos-int-media-button-white-space)',
        backgroundColor: 'var(--sonos-int-player-section-background)',
        position: 'absolute',
        top: '0rem',
        left: '0rem',
      }),
    });
  }

  private folderStyle(thumbnail: string) {
    return stylable('media-button-folder', this.config, {
      marginBottom: '-120%',
      '--mdc-icon-size': '1',
      ...((!this.mediaItem.can_expand || thumbnail) && { display: 'none' }),
    });
  }

  static get styles() {
    return css`
      .hoverable:focus,
      .hoverable:hover {
        border-color: var(--sonos-int-accent-color);
        color: var(--sonos-int-accent-color);
      }
    `;
  }
}

customElements.define('sonos-media-button', MediaButton);
