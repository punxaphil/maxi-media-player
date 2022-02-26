import { HomeAssistant } from 'custom-card-helpers';
import { MediaPlayerItem, Members } from './types';
import { ServiceCallRequest } from 'custom-card-helpers/dist/types';

export default class Service {
  private hass: HomeAssistant;

  constructor(hass: HomeAssistant) {
    this.hass = hass;
  }

  join(master: string, entities: string) {
    this.callSonosService('join', {
      master: master,
      entity_id: entities,
    });
  }

  unjoin(entities: string) {
    this.callSonosService('unjoin', {
      entity_id: entities,
    });
  }

  callSonosService(service: string, inOptions: ServiceCallRequest['serviceData']) {
    this.hass.callService('sonos', service, inOptions);
  }

  callMediaService(service: string, inOptions: ServiceCallRequest['serviceData']) {
    this.hass.callService('media_player', service, inOptions);
  }

  pause(entity: string) {
    this.callMediaService('media_pause', {
      entity_id: entity,
    });
  }

  prev(entity: string) {
    this.callMediaService('media_previous_track', {
      entity_id: entity,
    });
  }

  next(entity: string) {
    this.callMediaService('media_next_track', {
      entity_id: entity,
    });
  }

  play(entity: string) {
    this.callMediaService('media_play', {
      entity_id: entity,
    });
  }

  shuffle(entity: string, state: boolean) {
    this.callMediaService('shuffle_set', {
      entity_id: entity,
      shuffle: state,
    });
  }

  repeat(entity: string, currentState: string) {
    const state = currentState === 'all' ? 'one' : currentState === 'one' ? 'off' : 'all';
    this.callMediaService('repeat_set', {
      entity_id: entity,
      repeat: state,
    });
  }

  volumeDown(entity: string, members: Members) {
    this.callMediaService('volume_down', {
      entity_id: entity,
    });

    for (const member in members) {
      this.callMediaService('volume_down', {
        entity_id: member,
      });
    }
  }

  volumeUp(entity: string, members: Members) {
    this.callMediaService('volume_up', {
      entity_id: entity,
    });

    for (const member in members) {
      this.callMediaService('volume_up', {
        entity_id: member,
      });
    }
  }

  volumeSet(entity: string, members: Members, volume: string) {
    const volumeFloat = Number.parseInt(volume) / 100;

    this.callMediaService('volume_set', {
      entity_id: entity,
      volume_level: volumeFloat,
    });

    for (const member in members) {
      this.callMediaService('volume_set', {
        entity_id: member,
        volume_level: volumeFloat,
      });
    }
  }

  setSource(entity: string, favorite: string) {
    this.callMediaService('select_source', {
      source: favorite,
      entity_id: entity,
    });
  }

  async getFavorites(mediaPlayers: string[]): Promise<MediaPlayerItem[]> {
    if (!mediaPlayers.length) {
      return [];
    }
    const favoritesForAllPlayers = await Promise.all(mediaPlayers.map((player) => this.getFavoritesForPlayer(player)));
    let favorites = favoritesForAllPlayers.flatMap((f) => f);
    favorites = this.removeDuplicateFavorites(favorites);
    return favorites.length ? favorites : this.getFavoritesFromStates(mediaPlayers);
  }

  private removeDuplicateFavorites(favorites: MediaPlayerItem[]) {
    return favorites.filter((value, index, self) => {
      return index === self.findIndex((t) => t.title === value.title);
    });
  }

  private async getFavoritesForPlayer(player: string) {
    const favoritesRoot = await this.browseMedia(player, 'favorites');
    const favoriteTypesPromise = favoritesRoot.children?.map((favoriteItem) =>
      this.browseMedia(player, favoriteItem.media_content_type, favoriteItem.media_content_id),
    );
    const favoriteTypes = favoriteTypesPromise ? await Promise.all(favoriteTypesPromise) : [];
    return favoriteTypes.flatMap((item) => item.children || []);
  }

  private getFavoritesFromStates(mediaPlayers: string[]) {
    console.log('Custom Sonos Card: found no favorites with thumbnails, trying with titles only');
    let titles = mediaPlayers
      .map((entity) => this.hass.states[entity])
      .flatMap((state) => state.attributes.source_list);
    titles = [...new Set(titles)];
    if (!titles.length) console.log('Custom Sonos Card: No favorites found');
    return titles.map((title) => ({ title }));
  }

  private async browseMedia(entity_id: string, media_content_type?: string, media_content_id = '') {
    return await this.hass.callWS<MediaPlayerItem>({
      type: 'media_player/browse_media',
      entity_id,
      media_content_id,
      media_content_type,
    });
  }
}
