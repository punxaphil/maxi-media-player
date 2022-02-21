import {LovelaceCardConfig} from 'custom-card-helpers';

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
  entityNameRegexToReplace?: string
  entityNameReplacement?: string
  entities: string[];
}
