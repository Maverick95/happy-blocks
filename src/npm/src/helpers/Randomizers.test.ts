import TetrominoType from '../models/TetrominoType';
import random from './random';
import getRandomizerDefault from './Randomizers';

jest.mock('./random');

const mockedRandom = random as jest.Mock;

describe('Randomizers', () => {

  beforeEach(() => {
    mockedRandom.mockReset();
  });

  describe('getRandomizerDefault', () => {
    test('returns as expected', () => {
      // ARRANGE
      mockedRandom.mockReturnValue(0);
      const randomizer = getRandomizerDefault();
      const expected: TetrominoType[] = [
        TetrominoType.I,
        TetrominoType.J,
        TetrominoType.L,
        TetrominoType.O,
        TetrominoType.S,
        TetrominoType.T,
        TetrominoType.Z,
        TetrominoType.I,
        TetrominoType.J,
        TetrominoType.L,
      ]
      // ACT
      const actual: TetrominoType[] = [];
      for (let i = 0; i < 10; i++) {
        actual.push(randomizer.next());
      }
      // ASSERT
      expect(actual).toEqual(expected);
    })
  });
})

