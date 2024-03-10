import { Player } from './sections/player';
import { Card } from './card';
import { Grouping } from './sections/grouping';
import { Groups } from './sections/groups';
import { MediaBrowser } from './sections/media-browser';
import './sections/volumes';
import './components/ha-player';

window.customCards.push({
  type: 'maxi-media-player',
  name: 'Maxi Media Player',
  description: 'Media card for Home Assistant UI with a focus on managing multiple media players',
  preview: true,
});

customElements.define('maxi-media-player', Card);
customElements.define('mxmp-grouping', Grouping);
customElements.define('mxmp-groups', Groups);
customElements.define('mxmp-media-browser', MediaBrowser);
customElements.define('mxmp-player', Player);
