# Maxi Media Player

Media card for Home Assistant UI with a focus on managing multiple media players!

*(If this looks familiar to you, it's probably because it's almost identical to my [Sonos Card](https://github.com/punxaphil/custom-sonos-card), except this one is focused on supporting all players, not just Sonos.)*
## Features:

* Group/Ungroup speakers
  * If the individual speakers support it
* Control multiple speakers
* Play favorites from list
* Media browser button
* Control individual volumes in a group
* Artwork background
* Possibility to override artwork
* Shuffle and repeat mode
* Theming
* Configurable styling
* Dynamic volume level slider
* Track progress bar

and more!

![player.png](https://github.com/punxaphil/maxi-media-player/raw/main/img/player.png) ![media_browser.png](https://github.com/punxaphil/maxi-media-player/raw/main/img/media_browser.png) ![groups.png](https://github.com/punxaphil/maxi-media-player/raw/main/img/groups.png) ![grouping.png](https://github.com/punxaphil/maxi-media-player/raw/main/img/grouping.png) ![volumes.png](https://github.com/punxaphil/maxi-media-player/raw/main/img/volumes.png)

## Support the project

Do you like the Maxi Media Player? Support the project with a coffee ☕️

[![BMC](https://www.buymeacoffee.com/assets/img/custom_images/white_img.png)](https://www.buymeacoffee.com/punxaphil)

# Installation
## With HACS (recommended)
1. Download HACS following the instructions on https://hacs.xyz/docs/setup/download
1. Proceed to the initial configuration following the instructions on https://hacs.xyz/docs/configuration/basic
1. On your sidebar go to HACS > Frontend
1. click on the icon at the right top corner then on Custom repositories
1. For the repository add this: https://github.com/punxaphil/maxi-media-player
1. For the category select Lovelace then click Add
1. Now click on Maxi Media Player then on the Dowload button
1. Go back on your dashboard and click on the icon at the right top corner then on Edit dashboard
1. You can now click on Add card in the bottom right corner and search for Maxi Media Player

Coming soon in the HACS default repo (still waiting for validation).

## Without HACS
1. Download this file: maxi-media-player.js
1. Add this file into your <config>/www folder
1. On your dashboard click on the icon at the right top corner then on Edit dashboard
1. Click again on that icon and then on Manage resources
1. Click on Add resource
1. Copy and paste this: /local/maxi-media-player.js?v=1
1. Click on JavaScript Module then Create
1. Go back and refresh your page
1. You can now click on Add card in the bottom right corner and search for Maxi Media Player
1. After any update of the file you will have to edit /local/maxi-media-player.js?v=1 and change the version to any higher number

## Usage

### Individual sections

By default, all sections of the card is available, and you can jump between them in the footer of the card.

However, you can also select individual sections to enable. Use this if you want to show the different sections next to
each other (by adding multiple instances of the card with different sections enabled).

By using the section configuration you can utilise the full power of Home Assistant's layout capabilities and also drag
in other cards in your Dashboard view.

### Configuration

Use the Visual Editor in Home Assistant to configure the card. Most options are available there.

### Configuration in YAML

```yaml
type: custom:maxi-media-player
entities: # Required unless you specify entityPlatform
  - media_player.kitchen_player
  - media_player.hallway_player
  - media_player.bedroom_player
  - media_player.livingroom_player
excludeItemsInEntitiesList: true # Will invert the selection in the `entities` list, so that all players that are not in the list will be used.
entityPlatform: sonos # will select all entities for this platform. Will override the `entities` list if set.

# All settings below are optional

# common for all sections
title: ''
sections: # see explanation further up
  - volumes
  - groups
  - grouping
  - media browser
  - player
widthPercentage: 75 # default is 100. Use this to change the width of the card.
heightPercentage: 75 # default is 100. Use this to change the height of the card. Set to 'auto' to make the card height adjust to the content.
selectedEntityId: media_player.bedroom # Forces this player to be the selected one on loading the card (overrides url param etc)
entityNameRegexToReplace: ' PLAYER' # Regex pattern to replace parts of the entity names
entityNameReplacement: ''
volumeStepSize: 1 # Use this to change the step size when using volume up/down. Default is to use the step size of Home Assistant's media player integration. 
adjustVolumeRelativeToMainPlayer: true # default is false, which means all players will be set to the same volume as the main player. If set to true, volume will be adjusted relative to the main player in the group.

# groups specific
groupsTitle: ''
hideGroupCurrentTrack: true # default is false, which means song/track info for groups will be shown

# grouping specific
groupingTitle: ''
predefinedGroups: # defaults to empty
  - name: Inside
    volume: 15 # If you want to set the volume of all speakers when grouping
    unmuteWhenGrouped: true # If you want to unmute all speakers when grouping
    entities:
      - media_player.bedroom
      - media_player.hall
  - name: Kitchen&Hall
    media: Legendary # If you want to start playing a specific favorite when grouping 
    entities: # Use below format if you want to set the volume of the speakers when grouping
      - player: media_player.kitchen
        volume: 10
      - player: media_player.hall
        volume: 5
  - name: All (except TV)
    excludeItemsInEntitiesList: true # Invert entities selection, so that all players will be grouped except those in the entities list
    entities: 
      - media_player.tv
skipApplyButtonWhenGrouping: true # default is false. Will skip the apply button when grouping.
dontSwitchPlayerWhenGrouping: true # default is false. Will not switch to another player if main player is ungrouped.

# player specific
hidePlayerControlNextTrackButton: false # default is false, hides player control next track button.
hidePlayerControlPrevTrackButton: false # default is false, hides player control previous track button.
hidePlayerControlRepeatButton: false # default is false, hides player control track repeat mode button.
hidePlayerControlShuffleButton: false # default is false, hides player control track shuffle mode button.
hidePlayerControlPowerButton: false # default is false, hides player control power button if media player TURN_ON feature is enabled.  This setting does nothing if media player TURN_ON feature is not supported.
showVolumeUpAndDownButtons: true # default is false, shows buttons for increasing and decreasing volume
labelWhenNoMediaIsSelected: 'No media selected'
labelForTheAllVolumesSlider: 'All volumes'
mediaArtworkOverrides: # Show your own selected artwork if certain rules match
  - mediaTitleEquals: TV
    imageUrl: https://cdn-icons-png.flaticon.com/512/716/716429.png
    sizePercentage: 40
  - mediaContentIdEquals: "x-htastream:RINCON_949F3EC2E15B01400:spdif"
    imageUrl: https://cdn-icons-png.flaticon.com/512/4108/4108783.png
  - mediaTitleEquals: p4malmo-aac-192
    imageUrl: >-
      https://mytuner.global.ssl.fastly.net/media/tvos_radios/2BDTPrpMbn_cTdteqo.jpg
  - mediaArtistEquals: Metallica
    imageUrl: >-
      https://mytuner.global.ssl.fastly.net/media/tvos_radios/2BDTPrpMbn_cTdteqo.jpg
  - mediaAlbumNameEquals: "Master of Puppets"
    imageUrl: >-
      https://mytuner.global.ssl.fastly.net/media/tvos_radios/2BDTPrpMbn_cTdteqo.jpg
  - mediaChannelEquals: "Sky Radio Smooth Hits"
    imageUrl: https://cdn-icons-png.flaticon.com/512/4108/4108794.png
  - ifMissing: true # ifMissing will only be used if none of the "Equals" overrides above resulted in a match 
    imageUrl: https://cdn-icons-png.flaticon.com/512/651/651758.png
customSources: # Main use case is probably to set tv media player to play TV sound
  media_player.tv: # set this to 'all' to show the custom source for all players
    - title: TV
      thumbnail: https://cdn-icons-png.flaticon.com/512/716/716429.png
dynamicVolumeSlider: true # default is false. See more in section further down.
dynamicVolumeSliderThreshold: 30 # default is 20. Use this to change the threshold for the dynamic volume slider.
dynamicVolumeSliderMax: 40 # default is 30. Use this to change the max value for the dynamic volume slider.
artworkHostname: http://192.168.0.59:8123 #default is ''. Usually not needed, but depending on your setup your device might not be able to access the artwork on the default host. One example where it could be needed is if you cast the dashboard with Google Cast.
showAudioInputFormat: true # default is false. Will show the audio input format (e.g. Dolby Digital) in the player section if available. By default, it will only show if the input format in the volumes section.
fallbackArtwork: https://cdn-icons-png.flaticon.com/512/651/651717.png # Override default fallback artwork image if artwork is missing for the currently selected media.
entitiesToIgnoreVolumeLevelFor: # default is empty. Use this if you want to ignore volume level for certain players in the player section. Useful if you have a main device with fixed volume.
  - media_player.my_sonos_port_device
artworkMinHeight: 10 # default is 5. Use this to change the minimum height of the artwork in the player section. Unit is in rem.
artworkAsBackground: true # default is false. Will show the artwork as background for the player section.
playerVolumeEntityId: media_player.bedroom # default is empty. Use this to control the volume of another player in the player section. Entity ID must the selected player or part of the selected player's group, otherwise it will not be controlled.

# media browser specific
mediaBrowserItemsPerRow: 1 # default is 4. Use this to show items as list.
mediaBrowserHideTitleForThumbnailIcons: true # default is false. Only makes a difference if mediaBrowserItemsPerRow > 1. Will hide title for thumbnail artworks.
customThumbnail:
  Voyage: https://i.scdn.co/image/ab67706f000000027b2e7ee752dc222ff2fd466f
customThumbnailIfMissing:
  Ed Sheeran Radio: https://i.scdn.co/image/ab6761610000e5eb4d2f80ceffc6c70a432ccd7c
  Legendary: https://i.scdn.co/image/ab67706f000000027b2e7ee752dc222ff2fd466f
  fallback: https://cdn-icons-png.flaticon.com/512/651/651717.png # will use this if thumbnail is missing and none of the above matches. Defaults to black music notes with white background.  
favoritesToIgnore:
  - My Favorite Album
  - My Bad Playlist
topFavorites: # Show these favorites at the top of the list
  - Legendary
  - Country Rocks
  - Kacey Musgraves Radio
numberOfFavoritesToShow: 10 # Use this to limit the amount of favorites to show
hideBrowseMediaButton: true # default is false. Hides the button to open the media browser.
replaceHttpWithHttpsForThumbnails: true # default is false. Use this if you  want to replace http with https for thumbnails. 
mediaBrowserTitle: My favorites # default is 'All favorites'. Use this to change the title for the media browser/favorites section.

# volumes specific
hideVolumeCogwheel: true # default is false. Will hide the cogwheel for the volumes section.
```

## Using individual section cards

As mentioned earlier, use the individual sections for more layout flexibility.

Here is an example:

![sections.png](https://github.com/punxaphil/maxi-media-player/raw/main/img/sections.png)
```yaml
type: horizontal-stack
cards:
  - type: custom:maxi-media-player
    sections:
      - groups
      - volumes
  - type: custom:maxi-media-player
    sections:
      - player
  - type: custom:maxi-media-player
    sections:
      - grouping
      - media browser
```

## Theme variables

The following variables are being used and can be set in your theme to change the appearance of the card:
```
--accent-color
--primary-color
--secondary-text-color
--secondary-background-color
--disabled-text-color
```

Read more about using theme variables here: https://www.home-assistant.io/integrations/frontend/#defining-themes

## CSS Styling

The recommend way to change look and feel is to use the built-in theming capabilities in Home Assistant. If that is not enough this card supports being styled with [card_mod](https://github.com/thomasloven/lovelace-card-mod).

Example:

```yaml
type: custom:maxi-media-player
card_mod:
  style: |
    ha-card {
      color: white !important;
      background: gray;
      --accent-color: pink;
      --primary-color: white;
      --secondary-text-color: white;
      --secondary-background-color: pink;
    }
```

The above YAML renders the following:

![styling.png](https://github.com/punxaphil/maxi-media-player/raw/main/img/styling.png)

## Dynamic volume level slider

The volume level slider is dynamically adjusting its scale. If volume is below 20% it will show a scale up to 30%. Above
20% it will show a scale up to 100%. The color will also change from green to red clearly indicating which scale is
being used.

![dynamic_volumes.png](https://github.com/punxaphil/maxi-media-player/raw/main/img/dynamic_volumes.png)

Enable it in config with `dynamicVolumeSlider: true`

## Linking to specific player

Append `#media_player.my_player` to page URL to have that player selected.

If `entityId` is configured for the card, the url param will be ignored. See more in the Usage section above.
