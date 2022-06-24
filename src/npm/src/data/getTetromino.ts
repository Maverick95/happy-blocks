import TetrominoType from 'models/TetrominoType';
import Tetromino from 'models/Tetromino';

const tetrominos = (): Record<TetrominoType, Tetromino> => ({
  
  [TetrominoType.O]: {
      classNames: ['tetromino-o'],
      color: '#00ff00',
      coordinates: [
        {x:  0, y:  0},
        {x:  0, y:  1},
        {x:  1, y:  0},
        {x:  1, y:  1},
      ],
    },
    [TetrominoType.S] : {
      classNames: ['tetromino-s'],
      color: '#00ffff',
      coordinates: [
        {x: -1, y:  1},
        {x:  0, y:  0},
        {x:  0, y:  1},
        {x:  1, y:  0},
      ],
    },
    [TetrominoType.Z]: {
      classNames: ['tetromino-z'],
      color: '#ff3f00',
      coordinates: [
        {x: -1, y:  0},
        {x:  0, y:  0},
        {x:  0, y:  1},
        {x:  1, y:  1},
      ],
    },
    [TetrominoType.T]: {
      classNames: ['tetromino-t'],
      color: '#7f1fff',
      coordinates: [
        {x: -1, y:  0},
        {x:  0, y:  0},
        {x:  0, y:  1},
        {x:  1, y:  0},
      ],
    },
    [TetrominoType.L]: {
      classNames: ['tetromino-l'],
      color: '#1f1fff',
      coordinates: [
        {x: -1, y:  0},
        {x: -1, y:  1},
        {x:  0, y:  0},
        {x:  1, y:  0},
      ],
    },
    [TetrominoType.J]: {
      classNames: ['tetromino-j'],
      color: '#ff00ff',
      coordinates: [
        {x: -1, y: -1},
        {x: -1, y:  0},
        {x:  0, y:  0},
        {x:  1, y:  0},
      ],
    },
    [TetrominoType.I]: {
      classNames: ['tetromino-i'],
      color: '#ffff00',
      coordinates: [
        {x: -1, y:  0},
        {x:  0, y:  0},
        {x:  1, y:  0},
        {x:  2, y:  0},
      ],
    },
  });

  const getTetromino = (type: TetrominoType): Tetromino => tetrominos()[type];

  export default getTetromino;
