# Sonos card for Home Assistant's Lovelace UI
Customized media player for sonos speakers!

Thanks to https://github.com/DBuit and https://github.com/exetico for creating this card.

## Features:

* Group/Ungroup speakers
* Control multiple speaker
* Play favorites from list
* Control individual volumes in a group
* Artwork background
* Shuffle and repeat mode

and more!

![Screenshot of card](https://github.com/johanfrick/custom-sonos-card/raw/master/screenshot-custom-sonos-card.png)

## Installation
### HACS
This card is available in HACS (Home Assistant Community Store)

### Manual
Download the resources, as you would do with all other modules.

Add the custom card as a module, like this:
```yaml
resources:
  - url: /local/custom-sonos-card.js?v=1.0
    type: module
```

## Usage
To get the full width of the Sonos Card, please make sure to use `panel` mode in your Lovelace view. 
Read more here: https://www.home-assistant.io/lovelace/views/

After that add a card to the view, and in YAML mode add the following (configured according to your preferences):
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

## Theme variables
The following variables are available and can be set in your theme to change the appearence of the card.

| Name | Default |
|------|---------|
| --sonos-box-shadow | var( --ha-card-box-shadow, 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12) )
| --sonos-background-color | var(--card-background-color)
| --sonos-player-section-background | #ffffffe6
| --sonos-color | var(--secondary-text-color)
| --sonos-artist-album-text-color | var(--primary-text-color)
| --sonos-accent-color | var(--accent-color)
|--mdc-icon-size | 18px

## Linking to specific player
Append `#media_player.my_sonos_player` to page URL to have that player selected. 