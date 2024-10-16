import { html, TemplateResult } from 'lit';
import { BaseEditor } from './base-editor';

export const ADVANCED_SCHEMA = [
  {
    name: 'entityPlatform',
    help: 'Show all media players for the selected platform',
    type: 'string',
  },
  {
    name: 'hideGroupCurrentTrack',
    selector: { boolean: {} },
  },
  {
    name: 'dynamicVolumeSlider',
    selector: { boolean: {} },
  },
  {
    name: 'dynamicVolumeSliderThreshold',
    type: 'integer',
    default: 20,
    required: true,
    valueMin: 1,
    valueMax: 100,
  },
  {
    name: 'dynamicVolumeSliderMax',
    type: 'integer',
    default: 30,
    required: true,
    valueMin: 1,
    valueMax: 100,
  },
  {
    name: 'artworkMinHeight',
    type: 'integer',
    help: 'Minimum height of the artwork in rem',
    default: 5,
    required: true,
    valueMin: 0,
  },
  {
    name: 'hideBrowseMediaButton',
    selector: { boolean: {} },
  },

  {
    name: 'labelWhenNoMediaIsSelected',
    type: 'string',
  },
  {
    name: 'labelForTheAllVolumesSlider',
    type: 'string',
  },
  {
    name: 'mediaBrowserTitle',
    type: 'string',
  },
  {
    name: 'artworkHostname',
    type: 'string',
  },
  {
    name: 'mediaBrowserHideTitleForThumbnailIcons',
    selector: { boolean: {} },
  },
  {
    name: 'topFavorites',
    type: 'string',
  },
  {
    name: 'numberOfFavoritesToShow',
    type: 'integer',
    valueMin: 1,
  },
  {
    name: 'showAudioInputFormat',
    selector: { boolean: {} },
  },
  {
    name: 'adjustVolumeRelativeToMainPlayer',
    selector: { boolean: {} },
  },
  {
    name: 'skipApplyButtonWhenGrouping',
    selector: { boolean: {} },
  },
  {
    name: 'hideVolumeCogwheel',
    selector: { boolean: {} },
  },
  {
    name: 'artworkAsBackground',
    selector: { boolean: {} },
  },
  {
    name: 'playerVolumeEntityId',
    selector: { entity: { multiple: false, filter: { domain: 'media_player' } } },
  },
  {
    name: 'dontSwitchPlayerWhenGrouping',
    selector: { boolean: {} },
  },
  {
    name: 'showSourceInPlayer',
    selector: { boolean: {} },
  },
  {
    name: 'showChannelInPlayer',
    selector: { boolean: {} },
  },
  {
    name: 'hidePlaylistInPlayer',
    selector: { boolean: {} },
  },
  {
    name: 'fallbackArtwork',
    type: 'string',
    help: 'Override default fallback artwork image if artwork is missing for the currently selected media',
  },
  {
    name: 'entitiesToIgnoreVolumeLevelFor',
    help: 'If you want to ignore volume level for certain players in the player section',
    selector: { entity: { multiple: true, filter: { domain: 'media_player' } } },
  },
  {
    name: 'replaceHttpWithHttpsForThumbnails',
    selector: { boolean: {} },
  },
  {
    name: 'volumeStepSize',
    type: 'integer',
    valueMin: 1,
  },
  {
    name: 'showBrowseMediaInPlayerSection',
    selector: { boolean: {} },
  },
];

class AdvancedEditor extends BaseEditor {
  protected render(): TemplateResult {
    const topFavorites = this.config.topFavorites ?? [];
    const data = { ...this.config, topFavorites: topFavorites.join(', ') };
    return html`
      <mxmp-editor-form
        .schema=${ADVANCED_SCHEMA}
        .config=${this.config}
        .hass=${this.hass}
        .data=${data}
        .changed=${this.changed}
      ></mxmp-editor-form>
      <div>
        The following needs to be configured using code (YAML):
        <ul>
          <li>customSources</li>
          <li>customThumbnail</li>
          <li>customThumbnailIfMissing</li>
          <li>favoritesToIgnore</li>
          <li>groupingButtonIcons</li>
        </ul>
      </div>
    `;
  }
  protected changed(ev: CustomEvent): void {
    const changed = ev.detail.value;
    this.config = {
      ...this.config,
      ...changed,
      topFavorites: changed.topFavorites.split(/ *, */),
    };
    this.configChanged();
  }
}

customElements.define('mxmp-advanced-editor', AdvancedEditor);
