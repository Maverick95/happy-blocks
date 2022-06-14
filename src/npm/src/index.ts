import Grid from 'classes/Grid';
import moveBlock from 'helpers/moveBlock';
import getRandomizerDefault from 'helpers/Randomizers';
import rotateBlock from 'helpers/rotateBlock';
import getTetromino from 'data/getTetromino';

const grid = (): Grid => new Grid(0, 0);

export {
  grid,
  moveBlock as move,
  getRandomizerDefault as randomizer,
  rotateBlock as rotate,
  getTetromino as tetromino,
};
