import { MediaPlayer } from './media-player';

export class GroupingItem {
  isSelected: boolean;
  icon!: string;
  isDisabled = false;
  isModified: boolean;
  readonly name: string;
  readonly isMain: boolean;
  readonly player: MediaPlayer;

  constructor(player: MediaPlayer, activePlayer: MediaPlayer, isModified: boolean) {
    this.isMain = player.id === activePlayer.id;
    this.isModified = isModified;
    const currentlyJoined = this.isMain || activePlayer.hasMember(player.id);
    this.isSelected = isModified ? !currentlyJoined : currentlyJoined;
    this.player = player;
    this.name = player.name;
    this.icon = this.isSelected ? 'check-circle' : 'checkbox-blank-circle-outline';
  }
}
