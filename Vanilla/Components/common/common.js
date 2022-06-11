var happyblocks = happyblocks || {};

happyblocks.common = (() => ({
  blocks: {
    'O': {
      color: '#00ff00',
      coordinates: [
        {x: 0, y: 0},
        {x: 0, y: 1},
        {x: 1, y: 0},
        {x: 1, y: 1},
      ],
    },
    'S': {
      color: '#00ffff',
      coordinates: [
        {x: 0, y: 1},
        {x: 1, y: 0},
        {x: 1, y: 1},
        {x: 2, y: 0},
      ],
    },
    'Z': {
      color: '#400000',
      coordinates: [
        {x: 0, y: 0},
        {x: 1, y: 0},
        {x: 1, y: 1},
        {x: 2, y: 1},
      ],
    },
    'T': {
      color: '#8000ff',
      coordinates: [
        {x: 0, y: 0},
        {x: 1, y: 0},
        {x: 1, y: 1},
        {x: 2, y: 0},
      ],
    },
    'L': {
      color: '#0000ff',
      coordinates: [
        {x: 0, y: 0},
        {x: 0, y: 1},
        {x: 1, y: 0},
        {x: 2, y: 0},
      ],
    },
    'J': {
      color: '#ff00ff',
      coordinates: [
        {x: 0, y: 0},
        {x: 0, y: 1},
        {x: 1, y: 1},
        {x: 2, y: 1},
      ],
    },
    'I': {
      color: '#ffff00',
      coordinates: [
        {x: 0, y: 0},
        {x: 1, y: 0},
        {x: 2, y: 0},
        {x: 3, y: 0},
      ],
    },
  }
}))();
