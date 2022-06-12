import Block from 'models/Block';
import Rotation from 'models/Rotation';
import Grid from 'classes/Grid';

const rotateBlock = (
  block: Block,
  rotation: Rotation,
  grid: Grid,
): Block => {

  /*
  // Outline major steps -
  // a) create new Block object,
  // b) apply rotation,
  // c) begin main algorithm.
  This is, using dominant / negative options...
  Move each individual piece
  Check whether piece is...
  1) Off-screen to left/right/down (up is only exception)
  2) Occupied by piece that is NOT the id provided (very important)
  */

  /* Assumption - each coordinate of block has id > 0. */

  /* List of ids from block required to do lookups without altering grid */

  const ids = block.coordinates.map(coordinate => coordinate.id);

  /* Returned Block object needs to be deep-copy of original */

  const result: Block = {
    x: block.x,
    y: block.y,
    coordinates: block.coordinates.map(coordinate => ({...coordinate})),
  };

  result.coordinates.forEach(coordinate => {
    const x = coordinate.x, y = coordinate.y;
    coordinate.x = -y;
    coordinate.y = x;
  });

  /*
  Okay so how do we do this?
  Well there is an order to the relative movement we perform.
  Need to order things from minimal move / maximal move.
  There's really no preference.
  So we will try...
  a) axis - max horizontal, min vertical
  b) vertical direction - max down, min up (duh)
  c) horizontal direction  max left, min right
  So wtf does this mean exactly??
  Well, start off ordering the squares. There is a definite order.
  (0, 0)
  vertical is first
  Godammit!
  This is manhattan distance.
  So...
        3
      3 2 3
    3 2 1 2 3
  3 2 1 0 1 2 3
    3 2 1 2 3
      3 2 3
        3
  
  0 - 1 element
  1 - 4 elements
  2 - 8 elements
  3 - 12 elements
  */

  return result;

};

export default rotateBlock;
