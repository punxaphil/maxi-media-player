export function getEntityName(hass, config, entity) {
  let name = hass.states[entity].attributes.friendly_name;
  if (config.entityNameRegex) {
    const parts = config.entityNameRegex.split('/').filter(i => i);
    if (parts.length === 2) {
      const [pattern, replaceWith] = parts;
      return name.replace(new RegExp(pattern, 'g'), replaceWith);
    }
  }
  return name;
}