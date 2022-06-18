import Grid from 'classes/Grid';
import moveBlock from 'helpers/moveBlock';
import getRandomizerDefault from 'helpers/Randomizers';
import rotateBlock from 'helpers/rotateBlock';
import getTetromino from 'data/getTetromino';
import Randomizer from 'models/Randomizer';

const grid = (): Grid => new Grid(0, 0);

const randomizers: Record<string, () => Randomizer> = {
  'default': getRandomizerDefault,
};

export {
  grid,
  moveBlock as move,
  randomizers,
  rotateBlock as rotate,
  getTetromino as tetromino,
};
