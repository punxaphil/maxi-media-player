export function getEntityName(hass, config, entity) {
  let name = hass.states[entity].attributes.friendly_name;
  if (config.entityNameRegex) {
    const parts = config.entityNameRegex.split('/').filter(i => i);
    if (parts.length === 2) {
      const [pattern, replaceWith] = parts;
      return name.replace(new RegExp(pattern, 'g'), replaceWith);
    }
  } else if (config.entityNameRegexToReplace) {
    return name.replace(new RegExp(config.entityNameRegexToReplace, 'g'), config.entityNameReplacement);
  }
  return name;
}