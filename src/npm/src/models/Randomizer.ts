import { TetrominoType } from './TetrominoType';

interface Randomizer {
  next: () => TetrominoType,
};

export default Randomizer;