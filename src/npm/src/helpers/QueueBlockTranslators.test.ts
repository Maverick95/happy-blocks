import { QueueBlock } from 'models/QueueBlock';
import { TetrominoType } from 'models/TetrominoType';
import { generatorForCharSeparator } from './QueueBlockTranslators';

describe('generatorForCharSeparator', () => {

  describe('decode', () => {

    it.each([
      [
        'empty',
        ''
      ],
      [
        'input odd length',
        '1_J_2_L_3',
      ],
      [
        'id not integer',
        '1_J_2_L_hippo_Z',
      ],
      [
        'duplicate id',
        '1_J_2_L_2_Z',
      ],
      [
        'invalid tetromino type',
        '1_J_2_L_3_hippo',
      ]
    ])('should throw Error for reason: %s', (_: string, queue: string) => {
      // ARRANGE
      const translator = generatorForCharSeparator('_');
      const action = () => translator.decode(queue);
      // ASSERT
      expect(action).toThrow('Bad decode input');
    });

    it('should parse correct input', () => {
      // ARRANGE
      const queue = '1_J_2_L_3_Z';
      const translator = generatorForCharSeparator('_');
      const expected: QueueBlock[] = [
        { id: 1, type: TetrominoType.J },
        { id: 2, type: TetrominoType.L },
        { id: 3, type: TetrominoType.Z },
      ];
      // ACT
      const actual = translator.decode(queue);
      // ASSERT
      expect(actual).toEqual(expected);
    });

  });

  describe('encode', () => {

    it.each([
      [
        [ { id: 5, type: TetrominoType.O } ],
        '5_O'
      ],
      [
        [ { id: 13, type: TetrominoType.O }, { id: 17, type: TetrominoType.J }, { id: 3, type: TetrominoType.S }  ],
        '13_O_17_J_3_S'
      ],
    ])('encode correct result for Case %#', (queue: QueueBlock[], expected: string) => {
      // ARRANGE
      const translator = generatorForCharSeparator('_');
      // ACT
      const actual = translator.encode(queue);
      // ASSERT
      expect(actual).toEqual(expected);
    });

  });

});