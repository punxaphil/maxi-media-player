import { Player } from './sections/player';
import { Card } from './card';
import { Grouping } from './sections/grouping';
import { Groups } from './sections/groups';
import { MediaBrowser } from './sections/media-browser';
import './sections/volumes';
import './components/ha-player';

const name = (type?: string) => `Sonos${type ? ` (${type})` : ''}`;
const desc = (type?: string) => `Media player for your Sonos speakers${type ? ` (${type})` : ''}`;

window.customCards.push({
  type: 'sonos-card',
  name: name(),
  description: desc(),
  preview: true,
});

customElements.define('sonos-card', Card);
customElements.define('sonos-grouping', Grouping);
customElements.define('sonos-groups', Groups);
customElements.define('sonos-media-browser', MediaBrowser);
customElements.define('sonos-player', Player);
