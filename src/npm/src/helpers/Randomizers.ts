import TetrominoType from 'models/TetrominoType';
import Randomizer from 'models/Randomizer';
import random from './random';

const getRandomizerDefault = (): Randomizer => {

  const types: TetrominoType[] = [
    TetrominoType.I,
    TetrominoType.J,
    TetrominoType.L,
    TetrominoType.O,
    TetrominoType.S,
    TetrominoType.T,
    TetrominoType.Z,
  ];

  const types_next: TetrominoType[] = [];

  return ({
    next: () => {
      if (types_next.length === 0) {
        const types_choose = [...types];
        while (types_choose.length > 0) {
          const index = Math.floor(random() * types_choose.length);
          types_next.push(types_choose[index]);
          types_choose.splice(index, 1);
        }
      }
      const next = types_next[0];
      types_next.splice(0, 1);
      return next;
    },
  });

};

export default getRandomizerDefault;