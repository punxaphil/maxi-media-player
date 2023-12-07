import { Card } from './card';
import './sections/volumes';

const name = (type?: string) => `Sonos${type ? ` (${type})` : ''}`;
const desc = (type?: string) => `Media player for your Sonos speakers${type ? ` (${type})` : ''}`;

window.customCards.push({
  type: 'sonos-card',
  name: name(),
  description: desc(),
  preview: true,
});

customElements.define('sonos-card', Card);
