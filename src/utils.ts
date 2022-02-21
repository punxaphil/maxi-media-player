import { HomeAssistant } from 'custom-card-helpers';
import { CardConfig } from './types';

export function getEntityName(hass: HomeAssistant, config: CardConfig, entity: string) {
  const name = hass.states[entity].attributes.friendly_name || '';
  if (config.entityNameRegex) {
    const parts = config.entityNameRegex.split('/').filter((i: string) => i);
    if (parts.length === 2) {
      const [pattern, replaceWith] = parts;
      return name.replace(new RegExp(pattern, 'g'), replaceWith);
    }
  } else if (config.entityNameRegexToReplace) {
    return name.replace(new RegExp(config.entityNameRegexToReplace, 'g'), config.entityNameReplacement || '');
  }
  return name;
}
