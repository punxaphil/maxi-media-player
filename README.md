# Sonos custom card
Customize media player for sonos speakers!<br><br>

## Features:

* Group/Ungroup speakers
* Control multiple speaker
* Play favorites from list

![Screenshot of card](https://github.com/DBuit/custom-sonos-card/blob/master/screenshot-custom-sonos-card.png)

## Installation
### HACS
Just add the URI to HACS's custom 

### Manual
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
          - media_player.sonos_stue
          - media_player.sonos_kontor
          - media_player.sonos_kokken
          - media_player.sonos_badevaerelse
```
