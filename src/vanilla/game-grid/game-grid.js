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
    this.width = this.height = 0;
    this.grid = [];
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
      this.setNewBlock(1, 1, 'T');
      this.drawGrid();
    }, 5000);

  }

  setNewBlock(x, y, type) {
    const coordinates = happyblocks.common.blocks[type].coordinates;
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
      if (piece.x < 0 || piece.x >= this.width || piece.y < 0 || piece.y >= this.height || this.grid[piece.x][piece.y]) {
        throw new Error('Invalid grid coordinate');
      }
      // Add id to grid.
      this.grid[piece.x][piece.y] = coordinate.id;
      // Add to pieces.
      this.pieces[coordinate.id] = piece;
    });
    this.block = { x, y, coordinates };
  }

  drawGrid() {
    // NOTE - does not delete pieces that have been removed.
    // Just adds new / draws existing.
    const container = this.shadowRoot.getElementById('grid-container');
    container.style.width = `${this.width * 25}px`;
    container.style.height = `${this.height * 25}px`;
    for (var piece_id of Object.keys(this.pieces)) {
      const piece = this.pieces[piece_id];
      let grid_piece = this.shadowRoot.getElementById(`game-piece-${piece_id}`);
      if (grid_piece) {
        grid_piece.style.backgroundColor = happyblocks.common.blocks[piece.type].color;
        grid_piece.style.left = `${piece.x * 25}px`;
        grid_piece.style.top = `${piece.y * 25}px`; 
      }
      else {
        grid_piece = document.createElement('div');
        grid_piece.id = `game-piece-${piece_id}`;
        grid_piece.classList.add('game-piece');
        grid_piece.style.backgroundColor = happyblocks.common.blocks[piece.type].color;
        grid_piece.style.left = `${piece.x * 25}px`;
        grid_piece.style.top = `${piece.y * 25}px`; 
        container.appendChild(grid_piece);
      }
    }
  }

  attributeChangedCallback(attrName, _, newVal) {

    let redraw;

    switch (attrName) {
      case 'width': {
        // If width increases, expand. If width decreases, shrink.
        const width = parseInt(newVal);
        if (isNaN(width) || width < 1 || width > 10) {
          throw new Error('Incorrect attribute');
        }
        if (width !== this.width) {
          redraw = true;
          if (width < this.width) {
            this.grid.forEach(row => row.splice(width));
          }
          else if (width > this.width) {
            this.grid.forEach(row => row.splice(
              this.width, 0,
              ...new Array(width - this.width).fill(0)
            ));
          }
          this.width = width;
        }
      }
        break;
      case 'height': {
        const height = parseInt(newVal);
        if (isNaN(height) || height < 1 || height > 20) {
          throw new Error('Incorrect attribute');
        }
        if (height !== this.height) {
          redraw = true;
          if (height < this.height) {
            this.grid.splice(height);
          }
          else if (height > this.height) {
            for (let i=0; i < height - this.height; i++) {
              this.grid.push(new Array(this.width).fill(0));
            }
          }
          this.height = height;
        }
      }
        break;
    }

    redraw && this.drawGrid();

  }

}

window.customElements.define('game-grid', GameGridElement);
