import Direction from 'models/Direction';
import Block from 'models/Block';
import Grid from 'classes/Grid';

const moveBlock = (
  block: Block,
  grid: Grid,
  direction: Direction
): Block => {

  /* List of ids from block required to do lookups without altering grid */

  const ids = [0, ...block.coordinates.map(coordinate => coordinate.id)];

  /* Returned Block object needs to be deep-copy of original */

  const result: Block = {
    x: block.x,
    y: block.y,
    coordinates: block.coordinates.map(coordinate => ({...coordinate})),
  };

  switch (direction) {
    case Direction.LEFT:
      result.x--;
    break;
    case Direction.DOWN:
      result.y++;
    break;
    case Direction.RIGHT:
      result.x++;
    break;
  }

  let isValid = true;
  for (var coordinate of result.coordinates) {
    const
      x = result.x + coordinate.x,
      y = result.y + coordinate.y;

    /* Normal check on y < 0 excluded so that rotations can allow parts of pieces to plot above the top of the grid (possible in Tetris). */
    /* Last condition is slightly nuanced, grid check is enforced to be inside boundaries so that certain grid behaviour is catered for. */
    
    if (x < 0 || x >= grid.getWidth() || y >= grid.getHeight() || (y >= 0 && !ids.includes(grid.getSpace(x, y)))) {
      isValid = false;
      break;
    }
  }

  return isValid ? result : null;

};

export default moveBlock;