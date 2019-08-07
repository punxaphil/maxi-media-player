# Sonos custom card
Customize media player for sonos speakers!<br><br>

## Features:

* Group/Ungroup speakers
* Control multiple speaker
* Play favorites from list

![Screenshot of card](https://github.com/DBuit/custom-sonos-card/blob/master/screenshot-custom-sonos-card.png)

<details>
  <summary><b>Example lovelace yaml:</b></summary>

```yaml
views:
- title: "Sonos"
    icon: mdi:speaker
    id: muziek
    panel: true
    cards:
      - type: "custom:custom-sonos-card"
        name: "Sonos"
        entities:
          - media_player.player1
          - media_player.player2
```

This card requires `type: module`.
```yaml
resources:
  - url: /local/custom-sonos-card.js?v=1.0
    type: module
```

</details>

