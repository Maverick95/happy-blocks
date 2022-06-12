import TetrominoType from 'models/TetrominoType';
import Tetromino from 'models/Tetromino';

const tetrominos = (): Record<TetrominoType, Tetromino> => ({
  
  [TetrominoType.O]: {
      color: '#00ff00',
      coordinates: [
        {x: 0, y: 0},
        {x: 0, y: 1},
        {x: 1, y: 0},
        {x: 1, y: 1},
      ],
    },
    [TetrominoType.S] : {
      color: '#00ffff',
      coordinates: [
        {x: 0, y: 1},
        {x: 1, y: 0},
        {x: 1, y: 1},
        {x: 2, y: 0},
      ],
    },
    [TetrominoType.Z]: {
      color: '#400000',
      coordinates: [
        {x: 0, y: 0},
        {x: 1, y: 0},
        {x: 1, y: 1},
        {x: 2, y: 1},
      ],
    },
    [TetrominoType.T]: {
      color: '#8000ff',
      coordinates: [
        {x: 0, y: 0},
        {x: 1, y: 0},
        {x: 1, y: 1},
        {x: 2, y: 0},
      ],
    },
    [TetrominoType.L]: {
      color: '#0000ff',
      coordinates: [
        {x: 0, y: 0},
        {x: 0, y: 1},
        {x: 1, y: 0},
        {x: 2, y: 0},
      ],
    },
    [TetrominoType.J]: {
      color: '#ff00ff',
      coordinates: [
        {x: 0, y: 0},
        {x: 0, y: 1},
        {x: 1, y: 1},
        {x: 2, y: 1},
      ],
    },
    [TetrominoType.I]: {
      color: '#ffff00',
      coordinates: [
        {x: 0, y: 0},
        {x: 1, y: 0},
        {x: 2, y: 0},
        {x: 3, y: 0},
      ],
    },
  });

  const getTetromino = (type: TetrominoType): Tetromino => tetrominos()[type];
