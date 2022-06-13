class GameGridElement extends HTMLElement {

  static get observedAttributes() {
    return [
      'width',
      'height',
    ];
  }

  constructor() {

    super();
    this.block = null;
    this.pieces = {};
    this.grid = happyblocks.grid();
    this.id = 0;

    this.attachShadow({ mode: 'open' });

    const styles = document.createElement('link');
    styles.setAttribute('rel', 'stylesheet');
    styles.setAttribute('href', './src/vanilla/game-grid/game-grid.css');
    this.shadowRoot.appendChild(styles);

    const content = document.getElementById('game-grid').content.cloneNode(true);
    this.shadowRoot.appendChild(content);

    // Test lines
    setTimeout(() => {
      this.setNewBlock(3, 3, 'I');
      this.drawGrid();
    }, 5000);

    const input = document.createElement('input');
    input.setAttribute('type', 'button');
    input.setAttribute('value', 'Click here');
    input.addEventListener('click', () => {
      if (this.block !== null) {
        const rotated = happyblocks.rotate(this.block, this.grid);
        // update this.grid
        this.block.coordinates.forEach(coordinate => 
          this.grid.clearSpace(rotated.x + coordinate.x, rotated.y + coordinate.y));
        rotated.coordinates.forEach(coordinate => {
          this.grid.setSpace(coordinate.id, rotated.x + coordinate.x, rotated.y + coordinate.y);
          // update this.pieces
          this.pieces[coordinate.id].x = rotated.x + coordinate.x;
          this.pieces[coordinate.id].y = rotated.y + coordinate.y;
        });
        // set this.block
        this.block = rotated;
        this.drawGrid();
      }
    });
    this.shadowRoot.appendChild(input);
  }

  setNewBlock(x, y, type) {
    const coordinates = happyblocks.tetromino(type).coordinates;
    coordinates.forEach(coordinate => {
      // Set new id.
      coordinate.id = ++this.id;
      // Create new piece.
      const piece = {
        type,
        x: x + coordinate.x,
        y: y + coordinate.y,
      };
      // Throw error if out-of-bounds of grid, or if space is populated.
      if (piece.x < 0 || piece.x >= this.grid.getWidth() || piece.y < 0 || piece.y >= this.grid.getHeight() || this.grid.getSpace(piece.x, piece.y)) {
        throw new Error('Invalid grid coordinate');
      }
      // Add id to grid.
      this.grid.setSpace(coordinate.id, piece.x, piece.y);
      // Add to pieces.
      this.pieces[coordinate.id] = piece;
    });
    this.block = { x, y, coordinates };
  }

  drawGrid() {
    // NOTE - does not delete pieces that have been removed.
    // Just adds new / draws existing.
    const container = this.shadowRoot.getElementById('grid-container');
    container.style.width = `${this.grid.getWidth() * 25}px`;
    container.style.height = `${this.grid.getHeight() * 25}px`;
    for (var piece_id of Object.keys(this.pieces)) {
      const piece = this.pieces[piece_id];
      let grid_piece = this.shadowRoot.getElementById(`game-piece-${piece_id}`);
      if (grid_piece) {
        grid_piece.style.backgroundColor = happyblocks.tetromino(piece.type).color;
        grid_piece.style.left = `${piece.x * 25}px`;
        grid_piece.style.top = `${piece.y * 25}px`;
        grid_piece.style.visibility = piece.y >= 0 ? 'visible' : 'hidden'; 
      }
      else {
        grid_piece = document.createElement('div');
        grid_piece.id = `game-piece-${piece_id}`;
        grid_piece.classList.add('game-piece');
        grid_piece.style.backgroundColor = happyblocks.tetromino(piece.type).color;
        grid_piece.style.left = `${piece.x * 25}px`;
        grid_piece.style.top = `${piece.y * 25}px`;
        grid_piece.style.visibility = piece.y >= 0 ? 'visible' : 'hidden';
        container.appendChild(grid_piece);
      }
    }
  }

  attributeChangedCallback(attrName, _, newVal) {

    switch (attrName) {
      case 'width': {
        // If width increases, expand. If width decreases, shrink.
        const width = parseInt(newVal);
        if (isNaN(width) || width < 1 || width > 10) {
          throw new Error('Incorrect attribute');
        }
        this.grid.setWidth(width);
      }
        break;
      case 'height': {
        const height = parseInt(newVal);
        if (isNaN(height) || height < 1 || height > 20) {
          throw new Error('Incorrect attribute');
        }
        this.grid.setHeight(height);
      }
        break;
    }
    
    this.drawGrid();

  }

}

window.customElements.define('game-grid', GameGridElement);
