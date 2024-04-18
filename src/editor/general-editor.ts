import { html, TemplateResult } from 'lit';
import { BaseEditor } from './base-editor';

export const GENERAL_SCHEMA = [
  {
    type: 'multi_select',
    options: {
      player: 'Player',
      'media browser': 'Media Browser',
      groups: 'Groups',
      grouping: 'Grouping',
      volumes: 'Volumes',
    },
    name: 'sections',
  },
  {
    type: 'integer',
    name: 'mediaBrowserItemsPerRow',
    default: 4,
    required: true,
    valueMin: 1,
    valueMax: 30,
  },
  {
    type: 'string',
    name: 'title',
  },
  {
    name: 'showVolumeUpAndDownButtons',
    selector: { boolean: {} },
  },
  {
    name: 'hidePlayerControlPowerButton',
    selector: { boolean: {} },
  },
  {
    name: 'hidePlayerControlShuffleButton',
    selector: { boolean: {} },
  },
  {
    name: 'hidePlayerControlPrevTrackButton',
    selector: { boolean: {} },
  },
  {
    name: 'hidePlayerControlNextTrackButton',
    selector: { boolean: {} },
  },
  {
    name: 'hidePlayerControlRepeatButton',
    selector: { boolean: {} },
  },
  {
    type: 'integer',
    name: 'widthPercentage',
    default: 100,
    required: true,
  },
  {
    type: 'integer',
    name: 'heightPercentage',
    default: 100,
    required: true,
  },
];

class GeneralEditor extends BaseEditor {
  protected render(): TemplateResult {
    return html`
      <mxmp-editor-form
        .schema=${GENERAL_SCHEMA}
        .config=${this.config}
        .hass=${this.hass}
      ></mxmp-editor-form>
    `;
  }
}

customElements.define('mxmp-general-editor', GeneralEditor);
