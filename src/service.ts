import {HomeAssistant} from "custom-card-helpers";

export default class Service {
  private hass: HomeAssistant;
  
  constructor(hass) {
    this.hass = hass;
  }

  join(master, entities) {
    this.callSonosService('join', {
      master: master,
      entity_id: entities,
    });
  }

  unjoin(entities) {
    this.callSonosService('unjoin', {
      entity_id: entities
    });
  }

  callSonosService(service, inOptions) {
    this.hass.callService('sonos', service, inOptions);
  }

  callMediaService(service, inOptions) {
    this.hass.callService('media_player', service, inOptions);
  }

  pause(entity) {
    this.callMediaService('media_pause', {
      entity_id: entity,
    });
  }

  prev(entity) {
    this.callMediaService('media_previous_track', {
      entity_id: entity,
    });
  }

  next(entity) {
    this.callMediaService('media_next_track', {
      entity_id: entity,
    });
  }

  play(entity) {
    this.callMediaService('media_play', {
      entity_id: entity,
    });
  }

  shuffle(entity, state) {
    this.callMediaService('shuffle_set', {
      entity_id: entity,
      shuffle: state,
    });
  }

  repeat(entity, currentState) {
    const state = currentState === 'all' ? 'one' : currentState === 'one' ? 'off' : 'all';
    this.callMediaService('repeat_set', {
      entity_id: entity,
      repeat: state,
    });
  }

  volumeDown(entity, members) {
    this.callMediaService('volume_down', {
      entity_id: entity,
    });

    for (const member in members) {
      this.callMediaService('volume_down', {
        entity_id: member,
      });
    }
  }

  volumeUp(entity, members) {
    this.callMediaService('volume_up', {
      entity_id: entity,
    });

    for (const member in members) {
      this.callMediaService('volume_up', {
        entity_id: member,
      });
    }
  }

  volumeSet(entity, members, volume) {
    const volumeFloat = volume / 100;

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

  setSource(entity, favorite) {
    this.callMediaService('select_source', {
      source: favorite,
      entity_id: entity,
    });
  }
}