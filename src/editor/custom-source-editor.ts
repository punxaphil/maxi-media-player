import { html, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { BaseEditor } from './base-editor';

class CustomSourceEditor extends BaseEditor {
  @property({ type: Number }) index!: number;

  protected render(): TemplateResult {
    return html``;
  }
}

customElements.define('mxmp-custom-source-editor', CustomSourceEditor);
