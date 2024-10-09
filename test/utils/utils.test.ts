import { beforeEach, describe, expect, it, vi } from 'vitest';
import { dispatchActivePlayerId, getGroupingChanges, getHeight, getSpeakerList, getWidth } from '../../src/utils/utils';
import { HassEntity } from 'home-assistant-js-websocket';
import { CardConfig, PredefinedGroup, Section } from '../../src/types';
import { ACTIVE_PLAYER_EVENT, ACTIVE_PLAYER_EVENT_INTERNAL } from '../../src/constants';
import { GroupingItem } from '../../src/model/grouping-item';
import { MediaPlayer } from '../../src/model/media-player';

function entity(entityId: string, friendlyName: string) {
  return {
    entity_id: entityId,
    attributes: {
      friendly_name: friendlyName,
    },
  } as unknown as HassEntity;
}

const entityOne = entity('1', 'PlayerOne');
const entityTwo = entity('2', 'PlayerTwo');
const entityThree = entity('3', 'PlayerThree');
const entities = [entityOne, entityTwo, entityThree];
const groupMembers = [entityOne.entity_id, entityTwo.entity_id];
let config: CardConfig;
const elemDispatchEvent = vi.fn();
const element = {
  dispatchEvent: elemDispatchEvent,
} as unknown as Element;

describe('Utils', () => {
  beforeEach(() => {
    entityOne.attributes.group_members = [];
    config = { sections: [] } as unknown as CardConfig;
  });
  describe('getSpeakerList', () => {
    beforeEach(() => {
      entityOne.attributes.group_members = groupMembers;
    });
    it('group', () => {
      // Arrange
      const mainPlayer: MediaPlayer = new MediaPlayer(entityOne, config, entities);
      // Act
      const speakerList = getSpeakerList(mainPlayer);
      // Assert
      expect(speakerList).toBe(`${entityOne.attributes.friendly_name} + ${entityTwo.attributes.friendly_name}`);
    });
    it('single', () => {
      // Arrange
      entityOne.attributes.group_members = [entityOne.entity_id];
      const mainPlayer: MediaPlayer = new MediaPlayer(entityOne, config, [entityOne]);
      // Act
      const speakerList = getSpeakerList(mainPlayer);
      // Assert
      expect(speakerList).toBe(entityOne.attributes.friendly_name);
    });
    it('predefined group', () => {
      // Arrange
      const pg = {
        entities: groupMembers.map((i) => ({ player: { id: i } })),
        name: 'Group 1',
      } as unknown as PredefinedGroup;
      const mainPlayer: MediaPlayer = new MediaPlayer(entityOne, config, entities);
      // Act
      const speakerList = getSpeakerList(mainPlayer, [pg]);
      // Assert
      expect(speakerList).toBe(pg.name);
    });
  });

  describe('dispatchActivePlayerId', () => {
    it('not all sections', () => {
      // Arrange
      const spy = vi.spyOn(window, 'dispatchEvent');

      // Act
      dispatchActivePlayerId(entityOne.entity_id, config, element);

      // Assert
      const customEvent = spy.mock.calls[0][0] as CustomEvent;
      expect(customEvent.type).toBe(ACTIVE_PLAYER_EVENT);
      expect(customEvent.detail.entityId).toBe(entityOne.entity_id);
    });
    it('all sections', () => {
      // Arrange
      config.sections = Object.values(Section);

      // Act
      dispatchActivePlayerId(entityOne.entity_id, config, element);

      // Assert
      const customEvent = elemDispatchEvent.mock.calls[0][0] as CustomEvent;
      expect(customEvent.type).toBe(ACTIVE_PLAYER_EVENT_INTERNAL);
      expect(customEvent.detail.entityId).toBe(entityOne.entity_id);
    });
  });
  describe('getHeight', () => {
    it('%', () => {
      // Arrange
      config.heightPercentage = 50;
      config.widthPercentage = 25;
      // Act
      const height = getHeight(config);
      const width = getWidth(config);
      // Assert
      expect(height).toBe(20);
      expect(width).toBe(10);
    });
    it('default', () => {
      // Arrange
      // Act
      const height = getHeight(config);
      const width = getWidth(config);
      // Assert
      expect(height).toBe(40);
      expect(width).toBe(40);
    });
  });

  describe('getGroupingChanges', () => {
    it.each([
      [[false, true, true], [entityOne, entityTwo], '1', ['2'], ['3'], '1'],
      [[false, false, true], [entityOne, entityTwo], '1', [], ['3'], '1'],
      [[true, false, false], [entityOne, entityTwo], '1', ['1'], [], '2'],
      [[true, false, false], [entityOne, entityTwo], '3', ['1'], [], '3'],
      [[false, true, true], [entityOne], '1', [], ['2', '3'], '1'],
      [[false, true, true], [entityOne], '1', [], ['2', '3'], '1'],
    ])(
      'modified %j, joined %j, active %i -> unJoin %j, join %j, newMain %i',
      (modified, joined, active, unJoin, join, newMain) => {
        // Arrange
        joined.forEach((j) => (j.attributes.group_members = joined.map((m) => m.entity_id)));
        const mainPlayer: MediaPlayer = new MediaPlayer(entityOne, config, entities);
        const secondPlayer: MediaPlayer = new MediaPlayer(entityTwo, config, entities);
        const thirdPlayer: MediaPlayer = new MediaPlayer(entityThree, config, entities);
        const groupingItems = [
          new GroupingItem(mainPlayer, mainPlayer, modified[0]),
          new GroupingItem(secondPlayer, mainPlayer, modified[1]),
          new GroupingItem(thirdPlayer, mainPlayer, modified[2]),
        ];

        // Act
        const joinedIds = joined.map((j) => j.entity_id);
        const result = getGroupingChanges(groupingItems, joinedIds, active);

        // Assert
        expect(result).toEqual({
          unJoin: unJoin,
          join: join,
          newMainPlayer: newMain,
        });
      },
    );

    // it('should correctly calculate unJoin, join, and newMainPlayer when activePlayerId is in unJoin', () => {
    //   // Arrange
    //   const activePlayerId = '1';
    //   const joinedPlayers = ['1', '2'];
    //   const mainPlayer: MediaPlayer = new MediaPlayer(entityOne, config, entities);
    //   const secondaryPlayer: MediaPlayer = new MediaPlayer(entityTwo, config, entities);
    //   const groupingItems = [
    //     new GroupingItem(mainPlayer, mainPlayer, false),
    //     new GroupingItem(secondaryPlayer, mainPlayer, false),
    //   ];
    //
    //   // Act
    //   const result = getGroupingChanges(groupingItems, joinedPlayers, activePlayerId);
    //
    //   // Assert
    //   expect(result).toEqual({
    //     unJoin: ['1', '2'],
    //     join: ['3'],
    //     newMainPlayer: '3',
    //   });
    // });
  });
});
