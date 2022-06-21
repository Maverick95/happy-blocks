class GameGridElement extends HTMLElement {

  static get observedAttributes() {
    return [
      'width',
      'height',
      'period',
    ];
  }

  constructor() {

    super();
    this.block = null;
    this.pieces = {};
    this.delete = [];
    this.grid = happyblocks.grid();
    this.pieceId = this.period = this.interval = 0;
    this.randomizer = happyblocks.randomizers['default']();

    this.attachShadow({ mode: 'open' });

    const styles = document.createElement('link');
    styles.setAttribute('rel', 'stylesheet');
    styles.setAttribute('href', './src/vanilla/game-grid/game-grid.css');
    this.shadowRoot.appendChild(styles);
  }

  connectedCallback() {
    const content = document.getElementById('game-grid').content.cloneNode(true);
    this.shadowRoot.appendChild(content);

    const input_left = document.createElement('input');
    input_left.setAttribute('type', 'button');
    input_left.setAttribute('value', '<');
    input_left.addEventListener('click', () => this.moveBlock('left'));
    
    const input_rotate = document.createElement('input');
    input_rotate.setAttribute('type', 'button');
    input_rotate.setAttribute('value', 'R');
    input_rotate.addEventListener('click', () => this.rotateBlock());

    const input_right = document.createElement('input');
    input_right.setAttribute('type', 'button');
    input_right.setAttribute('value', '>');
    input_right.addEventListener('click', () => this.moveBlock('right'))
    
    this.shadowRoot.appendChild(input_left);
    this.shadowRoot.appendChild(input_rotate);
    this.shadowRoot.appendChild(input_right);

    this.drawGrid();
  }

  rotateBlock() {
    if (this.block !== null) {
      const rotated = happyblocks.rotate(this.block, this.grid);
      // update this.grid
      this.block.coordinates.forEach(coordinate =>
        this.grid.clearSpace(this.block.x + coordinate.x, this.block.y + coordinate.y));
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
  }

  setNewBlock(type) {
    const block = happyblocks.new(type, this.grid);
    block.coordinates.forEach(coordinate => {
      // Set new id.
      coordinate.id = ++this.pieceId;
      // Create new piece.
      const piece = {
        type,
        x: block.x + coordinate.x,
        y: block.y + coordinate.y,
      };
      // Throw error if out-of-bounds of grid, or if space is populated.
      if (piece.x < 0 || piece.x >= this.grid.getWidth() || piece.y >= this.grid.getHeight() || (piece.y >= 0 && this.grid.getSpace(piece.x, piece.y))) {
        throw new Error('Invalid grid coordinate');
      }
      // Add id to grid.
      this.grid.setSpace(coordinate.id, piece.x, piece.y);
      // Add to pieces.
      this.pieces[coordinate.id] = piece;
    });
    this.block = block;
  }

  drawGrid() {
    const container = this.shadowRoot.getElementById('grid-container');
    container.style.width = `${this.grid.getWidth() * 25}px`;
    container.style.height = `${this.grid.getHeight() * 25}px`;
    for (var id of this.delete) {
      const grid_piece = this.shadowRoot.getElementById(`game-piece-${id}`);
      grid_piece.remove();
    };
    this.delete = [];
    for (var id of Object.keys(this.pieces)) {
      const piece = this.pieces[id];
      let grid_piece = this.shadowRoot.getElementById(`game-piece-${id}`);
      if (grid_piece) {
        grid_piece.style.backgroundColor = happyblocks.tetromino(piece.type).color;
        grid_piece.style.left = `${piece.x * 25}px`;
        grid_piece.style.top = `${piece.y * 25}px`;
        grid_piece.style.visibility = piece.y >= 0 ? 'visible' : 'hidden';
      }
      else {
        grid_piece = document.createElement('div');
        grid_piece.id = `game-piece-${id}`;
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
      case 'period': {
        const period = parseInt(newVal);
        if (isNaN(period) || period < 100) {
          throw new Error('Incorrect attribute');
        }
        this.period = period;
      }
    }

    this.isConnected && this.drawGrid();

    if (this.period > 0 && this.grid.getWidth() > 0 && this.grid.getHeight() > 0) {
      if (attrName === 'period') {
        if (this.interval !== 0) {
          clearInterval(this.interval);
        }
        this.interval = setInterval(() => this.gameEvent(), this.period);
      }
      else if (this.interval === 0) {
        this.interval = setInterval(() => this.gameEvent(), this.period);
      }
    }
    else if (this.interval !== 0) {
      clearInterval(this.interval);
      this.interval = 0;
    }

  }

  moveBlock(direction) {
    if (this.block !== null) {
      const moved = happyblocks.move(this.block, this.grid, direction);
      if (moved !== null) {
        // update this.grid
        this.block.coordinates.forEach(coordinate =>
          this.grid.clearSpace(this.block.x + coordinate.x, this.block.y + coordinate.y));
          moved.coordinates.forEach(coordinate => {
          this.grid.setSpace(coordinate.id, moved.x + coordinate.x, moved.y + coordinate.y);
          // update this.pieces
          this.pieces[coordinate.id].x = moved.x + coordinate.x;
          this.pieces[coordinate.id].y = moved.y + coordinate.y;
        });
        // set this.block
        this.block = moved;
        this.drawGrid();
      }
      else {
        return true;
      }
    }
  }

  gameEvent() {

    if (this.block !== null) {
      if (this.moveBlock('down')) {
        const rowsOccupied = this.block.coordinates
          .map(coordinate => this.block.y + coordinate.y)
          .filter(row => this.grid.getOccupiedForRow(row) === this.grid.getWidth());
        if (rowsOccupied.length) {
          const result = this.grid.deleteRows(rowsOccupied);
          result.delete.forEach(value => {
            delete this.pieces[value.id];
          });
          result.update.forEach(value => {
            this.pieces[value.id].x = value.x;
            this.pieces[value.id].y = value.y;
          });
          this.block.coordinates = this.block.coordinates.filter(coordinate =>
            !result.delete.includes(coordinate.id)
          ).map(coordinate => {
            const update = result.update.find(value => value.id === coordinate.id);
            if (update) {
              coordinate.x = update.x;
              coordinate.y = update.y; 
            }
            return coordinate;
          });
          this.delete = result.delete.map(value => value.id);
          const evtScoreIncrease = new CustomEvent('rowscompleted', {
            detail: { rows: rowsOccupied.length },
            bubbles: true,
            composed: true,
            cancelable: true,
          });
          const container = this.shadowRoot.getElementById('grid-container');
          container.dispatchEvent(evtScoreIncrease);
        }
        const gameEnd = this.block.coordinates.some(coordinate => this.block.y + coordinate.y < 0);
        if (gameEnd) {
          // Game End mechanic here. For now just clear the interval.
          clearInterval(this.interval);
          this.interval = 0;
          console.log('GaMe oVeR!');
        }
        this.block = null;
      }
    }
    else {
      const next = this.randomizer.next();
      this.setNewBlock(next);
    }

    this.drawGrid();

  }

}

window.customElements.define('game-grid', GameGridElement);
