class GameGridElement extends HTMLElement {

  static get observedAttributes() {
    return [
      'width',
      'height',
      'period',
      'next-tetromino-count',
    ];
  }

  constructor() {

    super();
    this.block = null;
    this.pieces = {};
    this.delete = [];
    this.grid = happyblocks.grid();
    this.pieceId = this.period = this.timeout = 0;
    this.intervals = {};
    this.randomizer = happyblocks.randomizers['default']();
    this.nextTetrominos = [];
    this.nextTetrominoCount = 0;

    this.attachShadow({ mode: 'open' });

    const styles = document.createElement('link');
    styles.setAttribute('rel', 'stylesheet');
    styles.setAttribute('href', './src/vanilla/game-grid/game-grid.css');
    this.shadowRoot.appendChild(styles);
  }

  connectedCallback() {
    const content = document.getElementById('game-grid').content.cloneNode(true);
    this.shadowRoot.appendChild(content);
    window.addEventListener('keydown', (event) => this.processKeyDown(event.code));
    window.addEventListener('keyup', (event) => this.processKeyUp(event.code));
    this.drawGrid();
  }

  disconnectedCallBack() {
    this.removeIntervals('moveleft', 'moveright', 'gameevent');
    window.removeEventListener('keydown', (event) => this.processKeyDown(event.code));
    window.removeEventListener('keyup', (event) => this.processKeyUp(event.code));
  }

  processKeyUp(code) {
    switch (code) {
      case 'ArrowLeft': case 'KeyA':
      {
        this.removeIntervals('moveleft');
      }
      break;
      case 'ArrowRight': case 'KeyD':
      {
        this.removeIntervals('moveright');
      }
    }
  }

  processKeyDown(code) {
    switch (code) {
      case 'ArrowLeft': case 'KeyA':
        {
          if (!this.intervals['moveleft']) {
            this.moveBlock('left');
            this.intervals['moveleft'] = setInterval(() => this.moveBlock('left'), 150);  
          }
        }
        break;
      case 'ArrowRight': case 'KeyD':
        {
          if (!this.intervals['moveright']) {
            this.moveBlock('right');
            this.intervals['moveright'] = setInterval(() => this.moveBlock('right'), 150);  
          }
        }
        break;
      case 'ArrowDown': case 'KeyS':
        {
          this.pushBlock();
        }
        break;
      case 'KeyR':
        this.rotateBlock();
        break;
    }
  };

  rotateBlock() {
    if (this.block !== null && !this.block.finished) {
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
    for (let id of this.delete) {
      const grid_piece = this.shadowRoot.getElementById(`game-piece-${id}`);
      grid_piece.remove();
    };
    this.delete = [];
    for (let id of Object.keys(this.pieces)) {
      const piece = this.pieces[id];
      let grid_piece = this.shadowRoot.getElementById(`game-piece-${id}`);
      if (grid_piece) {
        grid_piece.style.left = `${piece.x * 25}px`;
        grid_piece.style.top = `${piece.y * 25}px`;
        grid_piece.style.visibility = piece.y >= 0 ? 'visible' : 'hidden';
      }
      else {
        const classNames = happyblocks.tetromino(piece.type).classNames;
        grid_piece = document.createElement('div');
        grid_piece.id = `game-piece-${id}`;
        grid_piece.classList.add('game-piece');
        classNames.forEach(name => grid_piece.classList.add(name));
        grid_piece.style.left = `${piece.x * 25}px`;
        grid_piece.style.top = `${piece.y * 25}px`;
        grid_piece.style.visibility = piece.y >= 0 ? 'visible' : 'hidden';
        container.appendChild(grid_piece);
      }
    }
  }

  attributeChangedCallback(attrName, _, newVal) {

    const keyEventAttributes = ['width', 'height', 'period'];

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
        if (isNaN(period) || period < 50) {
          throw new Error('Incorrect attribute');
        }
        this.period = period;
      }
        break;
      case 'next-tetromino-count': {
        const nextTetrominoCount = parseInt(newVal);
        if (isNaN(nextTetrominoCount) || nextTetrominoCount < 1) {
          throw new Error('Incorrect attribute');
        }
        this.nextTetrominoCount = nextTetrominoCount;
      }
        break;
    }

    if (keyEventAttributes.some(attr => attr === attrName)) {
      this.isConnected && this.drawGrid();
      if (this.period > 0 && this.grid.getWidth() > 0 && this.grid.getHeight() > 0) {
        this.setGameEventInterval(this.period);
      }
      else {
        this.removeIntervals('gameevent');
      }
    }

  }

  getNextTetromino() {
    let next = this.nextTetrominos.length > 0 ? this.nextTetrominos.shift() : this.randomizer.next();
    this.updateNextTetrominos();
    return next;
  }

  updateNextTetrominos() {
    let diff = this.nextTetrominoCount - this.nextTetrominos.length;
    if (diff > 0) {
      for (let _=0; _ < diff; _++) {
        this.nextTetrominos.push(this.randomizer.next());
      }
    }
    let nextTetrominos = this.nextTetrominos.join('');
    this.dispatchEvent('nexttetrominos', { nextTetrominos });
  }

  pushBlock() {
    if (this.block !== null && !this.block.finished) {
      const pushed = happyblocks.push(this.block, this.grid);
      // update this.grid
      this.block.coordinates.forEach(coordinate =>
        this.grid.clearSpace(this.block.x + coordinate.x, this.block.y + coordinate.y));
      pushed.coordinates.forEach(coordinate => {
        this.grid.setSpace(coordinate.id, pushed.x + coordinate.x, pushed.y + coordinate.y);
      // update this.pieces
      this.pieces[coordinate.id].x = pushed.x + coordinate.x;
      this.pieces[coordinate.id].y = pushed.y + coordinate.y;
      });
      // set this.block
      this.block = pushed;
      this.drawGrid();
    }
  }

  moveBlock(direction) {
    if (this.block !== null && !this.block.finished) {
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

  animateDeleteRows(result) {
    result.update.forEach(value => {
      const transition = happyblocks.transitions['gravity-falls'](value, this.grid);
      const grid_piece = this.shadowRoot.getElementById(`game-piece-${value.to.id}`);
      transition(grid_piece);
    });
    const animationDurationMs = 1000, additionalWaitMs = 500;
    const animationRows = result.delete.map(value => value.y)
      .sort((a, b) => b - a)
      .filter((value, index, array) => index === 0 || value !== array[index - 1]);

    const container = this.shadowRoot.getElementById('grid-container');

    const animations = animationRows.map(row => {
      const element = document.createElement('div');
      element.style.position = 'absolute';
      element.style.top = `${row * 25}px`;
      element.style.width = `${this.grid.getWidth() * 25}px`;
      element.style.height = '25px';
      element.style.animation = `${animationDurationMs / 7}ms linear 0s 7 alternate forwards running bomberguy`;
      element.style.zIndex = '5';
      element.style.backgroundColor = 'black';
      container.appendChild(element);
      return element;
    });

    setTimeout(() => {
      animations.forEach(element => element.remove());
      this.dispatchEvent('rowscompleted', { pieces: result.delete.length });
      this.drawGrid();
      this.setGameEventInterval(this.period);
    }, animationDurationMs + additionalWaitMs);

  }

  dispatchEvent(type, detail) {
    const container = this.shadowRoot.getElementById('grid-container');
    const evtScoreIncrease = new CustomEvent(type, {
      detail,
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    container.dispatchEvent(evtScoreIncrease);
  }

  removeIntervals(...intervals) {
    intervals.forEach(i => {
      if (this.intervals[i]) {
        clearInterval(this.intervals[i]);
        this.intervals[i] = 0;
      }
      if (i === 'gameevent' && this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = 0;
      }
    });
  }

  setGameEventInterval(period, delay = 0) {
    this.removeIntervals('gameevent');
    if (delay) {
      this.timeout = setTimeout(() => {
        this.gameEvent();
        this.intervals['gameevent'] = setInterval(() => this.gameEvent(), period);
      }, delay);
    }
    else {
      this.intervals['gameevent'] = setInterval(() => this.gameEvent(), period);
    }
  }

  gameEvent() {

    if (this.block === null) {
      const next = this.getNextTetromino();
      this.setNewBlock(next);
    }
    else if (this.block.finished) {
      const gameEnd = this.block.coordinates.some(coordinate => this.block.y + coordinate.y < 0);
      if (gameEnd) {
        this.removeIntervals('gameevent');
        this.dispatchEvent('gameover')
      }
      else {
        const next = this.getNextTetromino();
        this.setNewBlock(next);
      }
    }
    else if (this.moveBlock('down')) {
      this.removeIntervals('moveleft', 'moveright');
      this.block.finished = true;
      const rowsOccupied = this.block.coordinates
        .map(coordinate => this.block.y + coordinate.y)
        .filter(row => this.grid.getOccupiedForRow(row) === this.grid.getWidth());
      if (rowsOccupied.length) {
        this.removeIntervals('gameevent');
        const result = this.grid.deleteRows(rowsOccupied);
        result.delete.forEach(value => {
          delete this.pieces[value.id];
        });
        result.update.forEach(value => {
          this.pieces[value.to.id].x = value.to.x;
          this.pieces[value.to.id].y = value.to.y;
        });
        this.block.coordinates = this.block.coordinates.filter(coordinate =>
          !result.delete.includes(coordinate.id)
        ).map(coordinate => {
          const update = result.update.find(value => value.to.id === coordinate.id);
          if (update) {
            coordinate.x = update.to.x;
            coordinate.y = update.to.y;
          }
          return coordinate;
        });
        this.delete = result.delete.map(value => value.id);
        this.animateDeleteRows(result);
        return;
      }
    }

    this.drawGrid();
  }

}

window.customElements.define('game-grid', GameGridElement);
