# Sonos custom card
Customize media player for sonos speakers!<br><br>

Thanks to https://github.com/DBuit and https://github.com/exetico for creating this card.

## Features:

* Group/Ungroup speakers
* Control multiple speaker
* Play favorites from list

![Screenshot of card](https://github.com/johanfrick/custom-sonos-card/raw/master/screenshot-custom-sonos-card.png)

## Installation
### HACS
Add the URI to HACS's `Settings` > `CUSTOM REPOSITORIES`

### Manual
Download the resources, as you would do with all other modules.

Add the custom card as a module, like this:
```yaml
resources:
  - url: /local/custom-sonos-card.js?v=1.0
    type: module
```

## YAML
Here's one example, of how to add the Sonos Lovelace Card to Home Assistant.
```yaml
type: custom:custom-sonos-card
# Optional settings:
name: '' 
groupsTitle: '' 
groupingTitle: '' 
favoritesTitle: '' 
headerImage: '' 
shuffleFavorites: false 
noMediaText: 'No media selected' 
allVolumesText: 'All volumes'
# Required settings:
entities: 
  - media_player.sonos_kitchen
  - media_player.sonos_hallway
  - media_player.sonos_bedroom
  - media_player.sonos_livingroom
```

## Linking to specific player
Append `#media_player.my_sonos_player` to page URL to have that player selected selected. 