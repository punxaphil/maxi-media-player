# Sonos custom card
Customize media player for sonos speakers!<br><br>

## Features:

* Group/Ungroup speakers
* Control multiple speaker
* Play favorites from list

![Screenshot of card](https://github.com/DBuit/custom-sonos-card/blob/master/screenshot-custom-sonos-card.png)

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
```
views:
  - title: "Sonos"
    icon: mdi:speaker
    id: muziek
    panel: true
    cards:
      - type: "custom:custom-sonos-card"
        name: "Sonos"
        entities:
          - media_player.sonos_kitchen
          - media_player.sonos_hallway
          - media_player.sonos_bedroom
          - media_player.sonos_livingroom
```
