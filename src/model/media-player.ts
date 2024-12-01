import { HassEntity } from 'home-assistant-js-websocket';
import { CardConfig } from '../types';
import { findPlayer, getGroupPlayerIds } from '../utils/utils';

export class MediaPlayer {
  id: string;
  name: string;
  state: string;
  members: MediaPlayer[];
  attributes: HassEntity['attributes'];
  private readonly config: CardConfig;
  volumePlayer: MediaPlayer;
  ignoreVolume: boolean;

  constructor(hassEntity: HassEntity, config: CardConfig, mediaPlayerHassEntities?: HassEntity[]) {
    this.id = hassEntity.entity_id;
    this.config = config;
    this.name = this.getEntityName(hassEntity);
    this.state = hassEntity.state;
    this.attributes = hassEntity.attributes;
    this.members = mediaPlayerHassEntities ? this.createGroupMembers(hassEntity, mediaPlayerHassEntities) : [this];
    this.volumePlayer = this.determineVolumePlayer();
    this.ignoreVolume = !!this.config.entitiesToIgnoreVolumeLevelFor?.includes(this.volumePlayer.id);
  }

  getMember(playerId?: string) {
    return findPlayer(this.members, playerId);
  }

  hasMember(playerId: string) {
    return this.getMember(playerId) !== undefined;
  }

  isPlaying() {
    return this.state === 'playing';
  }

  isMuted(checkMembers: boolean): boolean {
    return this.attributes.is_volume_muted && (!checkMembers || this.members.every((member) => member.isMuted(false)));
  }

  getCurrentTrack() {
    let track = `${this.attributes.media_artist || ''} - ${this.attributes.media_title || ''}`;
    track = track.replace(/^ - | - $/g, '');
    if (!track) {
      track = this.attributes.media_content_id?.replace(/.*:\/\//g, '') ?? '';
    }
    if (this.config.mediaTitleRegexToReplace) {
      track = track.replace(
        new RegExp(this.config.mediaTitleRegexToReplace, 'g'),
        this.config.mediaTitleReplacement || '',
      );
    }
    return track;
  }

  private getEntityName(hassEntity: HassEntity) {
    const name = hassEntity.attributes.friendly_name || '';
    if (this.config.entityNameRegexToReplace) {
      return name.replace(
        new RegExp(this.config.entityNameRegexToReplace, 'g'),
        this.config.entityNameReplacement || '',
      );
    }
    return name;
  }

  private createGroupMembers(mainHassEntity: HassEntity, mediaPlayerHassEntities: HassEntity[]): MediaPlayer[] {
    return getGroupPlayerIds(mainHassEntity).reduce((players: MediaPlayer[], id) => {
      const hassEntity = mediaPlayerHassEntities.find((hassEntity) => hassEntity.entity_id === id);
      return hassEntity ? [...players, new MediaPlayer(hassEntity, this.config)] : players;
    }, []);
  }

  private determineVolumePlayer() {
    let find;
    if (this.members.length > 1 && this.config.entitiesToIgnoreVolumeLevelFor) {
      find = this.members.find((p) => {
        return !this.config.entitiesToIgnoreVolumeLevelFor?.includes(p.id);
      });
    }
    return find ?? this;
  }

  getVolume() {
    let volume: number;
    if (this.members.length > 1 && this.config.adjustVolumeRelativeToMainPlayer) {
      volume = this.getAverageVolume();
    } else {
      volume = 100 * (this.volumePlayer.attributes.volume_level || 0);
    }
    return Math.round(volume);
  }

  private getAverageVolume() {
    const volumes = this.members
      .filter((m) => !this.config.entitiesToIgnoreVolumeLevelFor?.includes(m.id))
      .map((m) => m.attributes.volume_level || 0);
    return (100 * volumes.reduce((a, b) => a + b, 0)) / volumes.length;
  }
}
