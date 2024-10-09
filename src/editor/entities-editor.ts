import { html, TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { mdiPen, mdiPlus } from '@mdi/js';
import { BaseEditor } from './base-editor';

export const ENTITIES_RENAME_SCHEMA = [
  {
    type: 'string',
    name: 'entityNameRegexToReplace',
  },
  {
    type: 'string',
    name: 'entityNameReplacement',
  },
  {
    type: 'boolean',
    name: 'excludeItemsInEntitiesList',
  },
];

export const ENTITIES_SCHEMA = [
  {
    name: 'entityId',
    help: 'Not needed, but forces this player to be the selected one on loading the card (overrides url param etc)',
    selector: { entity: { multiple: false, filter: { domain: 'media_player' } } },
  },
  {
    name: 'entities',
    help: 'Required, unless you have specified entity platform', //#ONLY_MXMP_CARD
    selector: { entity: { multiple: true, filter: { domain: 'media_player' } } },
  },
];

class EntitiesEditor extends BaseEditor {
  @state() editGroup!: number;
  private entitiesSchema = ENTITIES_SCHEMA;
  protected render(): TemplateResult {
    const predefinedGroups = this.config.predefinedGroups;
    return this.editGroup > -1
      ? html`<mxmp-predefined-group-editor
          .index=${this.editGroup}
          .config=${this.config}
          .hass=${this.hass}
          @closed=${() => (this.editGroup = -1)}
        ></mxmp-predefined-group-editor>`
      : html`
          <mxmp-editor-form
            .schema=${this.entitiesSchema}
            .config=${this.config}
            .hass=${this.hass}
          ></mxmp-editor-form>
          <div>
            Predefined Groups
            <ha-control-button-group>
              ${predefinedGroups?.map(
                (pg, index) => html`
                  <ha-control-button @click=${() => (this.editGroup = index)}>
                    ${pg.name}<ha-svg-icon .path=${mdiPen} label="Edit Group"></ha-svg-icon>
                  </ha-control-button>
                `,
              )}
              <ha-control-button @click=${() => (this.editGroup = predefinedGroups ? predefinedGroups.length : 0)}>
                Add group<ha-svg-icon .path=${mdiPlus} label="Add Group"></ha-svg-icon>
              </ha-control-button>
            </ha-control-button-group>
          </div>

          <div>
            Entity Renaming
            <mxmp-editor-form
              .schema=${ENTITIES_RENAME_SCHEMA}
              .config=${this.config}
              .hass=${this.hass}
            ></mxmp-editor-form>
          </div>
        `;
  }
}

customElements.define('mxmp-entities-editor', EntitiesEditor);
