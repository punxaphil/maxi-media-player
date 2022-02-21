import { LovelaceCardConfig } from 'custom-card-helpers';

export interface CardConfig extends LovelaceCardConfig {
  type: string;
  name?: string;
  groupsTitle?: string;
  groupingTitle?: string;
  favoritesTitle?: string;
  headerImage?: string;
  shuffleFavorites?: boolean;
  noMediaText?: string;
  allVolumesText?: string;
  entityNameRegexToReplace?: string;
  entityNameReplacement?: string;
  entities: string[];
}

export interface PlayerGroups {
  [name: string]: PlayerGroup;
}

export interface Members {
  [name: string]: string;
}

export interface PlayerGroup {
  entity: string;
  state: string;
  roomName: string;
  members: Members;
}
