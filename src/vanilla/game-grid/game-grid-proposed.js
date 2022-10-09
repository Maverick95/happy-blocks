class GameCenter {

  #target;
  #grid;
  #period;
  #tetrominoId;
  #pieceId;
  #nextTetrominos;
  #randomizer;  
  #nextTetrominoCount;
  #started;
  #intervals;
  #timeout;
  #block;

  constructor(target) {
    this.#target = target;
    this.#grid = happyblocks.grid();
    this.#period = this.#tetrominoId = this.#pieceId = 0;
    this.#nextTetrominos = [];
    this.#randomizer = happyblocks.randomizers['default']();  
    this.#nextTetrominoCount = 1;
    this.#started = false;
    this.#intervals = {};
    this.#timeout = 0;
    this.#block = null;
  }

  #startGame() {
    if (this.#started) return;
    if (this.#period > 0 && this.grid.getWidth() > 0 && this.grid.getHeight() > 0) {
      this.#setGameEventInterval(this.#period);
      this.#started = true;
    }
  }

  #updateNextTetrominos() {
    let diff = this.#nextTetrominoCount - this.#nextTetrominos.length;
    if (diff > 0) {
      for (let _ = 0; _ < diff; _++) {
        this.#nextTetrominos.push({
          id: ++this.#tetrominoId,
          type: this.#randomizer.next()
        });
      }
    }
    let nextTetrominos = happyblocks.translator.encode(this.#nextTetrominos);
    this.#target.dispatchEvent('nexttetrominos', { tetrominos: nextTetrominos });
  }

  
  #getNextTetromino() {
    let next = this.#nextTetrominos.length > 0 ? this.#nextTetrominos.shift().type : this.#randomizer.next();
    this.#updateNextTetrominos();
    return next;
  }

  #setNewBlock(type) {
    const block = happyblocks.new(type, this.#grid);
    const pieces = [];
    block.coordinates.forEach(coordinate => {
      // Set new id.
      coordinate.id = ++this.#pieceId;
      // Create new piece.
      const piece = {
        id: coordinate.id,
        x: block.x + coordinate.x,
        y: block.y + coordinate.y,
        type,
      };
      // Throw error if out-of-bounds of grid, or if space is populated.
      if (
        piece.x < 0 || piece.x >= this.#grid.getWidth() ||
        piece.y >= this.#grid.getHeight() ||
        (piece.y >= 0 && this.#grid.getSpace(piece.x, piece.y))) {
        throw new Error('Invalid grid coordinate');
      }
      // Add id to grid.
      this.#grid.setSpace(piece.id, piece.x, piece.y);
      pieces.push(piece);
    });
    // Dispatch addpieces event.
    const event = new CustomEvent(
      'addpieces',
      {
        detail: pieces,
        bubbles: true,
        cancelable: true,
        composed: true,
      });
    this.#target.dispatchEvent(event);
    this.#block = block;
  }

  #moveBlock(direction) {
    if (this.#block !== null && !this.#block.finished) {
      const moved = happyblocks.move(this.#block, this.#grid, direction);
      const pieces = [];
      if (moved !== null) {
        // update this.grid
        this.#block.coordinates.forEach(coordinate =>
          this.#grid.clearSpace(this.#block.x + coordinate.x, this.#block.y + coordinate.y));
        moved.coordinates.forEach(coordinate => {
          this.#grid.setSpace(coordinate.id, moved.x + coordinate.x, moved.y + coordinate.y);
          pieces.push({
            id: coordinate.id,
            x: moved.x + coordinate.x,
            y: moved.y + coordinate.y,
          });
        });
        const event = new CustomEvent(
          'movepieces',
          {
            detail: pieces,
            bubbles: true,
            cancelable: true,
            composed: true,
          });
        this.#target.dispatchEvent(event);
        this.#block = moved;
      }
      else {
        return true;
      }
    }
  }

  #gameEvent() {

    if (this.#block === null) {
      const next = this.#getNextTetromino();
      this.#setNewBlock(next);
    }
    else if (this.#block.finished) {
      const gameEnd = this.#block.coordinates.some(coordinate => this.#block.y + coordinate.y < 0);
      if (gameEnd) {
        this.#removeIntervals('gameevent');
        const event = new CustomEvent('gameover',
        {
          bubbles: true,
          cancelable: true,
          composed: true,
        });
        this.#target.dispatchEvent(event);
      }
      else {
        const next = this.#getNextTetromino();
        this.#setNewBlock(next);
      }
    }
    else if (this.#moveBlock('down')) {
      this.#removeIntervals('moveleft', 'moveright');
      this.#block.finished = true;
      const rowsOccupied = this.#block.coordinates
        .map(coordinate => this.#block.y + coordinate.y)
        .filter(row => this.#grid.getOccupiedForRow(row) === this.#grid.getWidth());
      if (rowsOccupied.length) {
        this.#removeIntervals('gameevent');
        const result = this.#grid.deleteRows(rowsOccupied);
        // 'completerows' event required.
        const detail_completerows = result.delete.map(value => value.y)
          .sort((a, b) => b - a)
          .filter((value, index, array) => index === 0 || value !== array[index - 1]);
        const event_completerows = new CustomEvent('completerows',
        {
          detail: detail_completerows,
          bubbles: true,
          cancelable: true,
          composed: true,
        });
        this.#target.dispatchEvent(event_completerows);
        this.#block.coordinates = this.#block.coordinates.filter(coordinate =>
          !result.delete.includes(coordinate.id)
        ).map(coordinate => {
          const update = result.update.find(value => value.to.id === coordinate.id);
          if (update) {
            coordinate.x = update.to.x;
            coordinate.y = update.to.y;
          }
          return coordinate;
        });
        this.#removeRowsEvent(result);
        return;
      }
    }
  }

  #removeRowsEvent(result) {
    const animationDurationMs = 1000, additionalWaitMs = 500;
    const gameEventTimeoutMs = animationDurationMs + additionalWaitMs;
    const detail_completeRows = result.delete.map(value => value.y)
          .sort((a, b) => b - a)
          .filter((value, index, array) => index === 0 || value !== array[index - 1]);
    const detail = {
      completeRows: detail_completeRows, 
      delete: result.delete.map(coordinate => coordinate.id),
      update: result.update.map(update => update.to),
    };
    
    setTimeout(() => {
      const event = new CustomEvent('deletecompletedrows',
      {
        detail,
        bubbles: true,
        cancelable: true,
        composed: true,
      });
      this.#target.dispatchEvent(event);
    }, animationDurationMs);

    setTimeout(() => {
      this.#setGameEventInterval(this.#period);
    }, gameEventTimeoutMs);
  }

  #setGameEventInterval(period, delay = 0) {
    this.#removeIntervals('gameevent');
    if (delay) {
      this.#timeout = setTimeout(() => {
        this.#gameEvent(); // Required
        this.#intervals['gameevent'] = setInterval(() => this.#gameEvent(), period);
      }, delay);
    }
    else {
      this.#intervals['gameevent'] = setInterval(() => this.#gameEvent(), period);
    }
  }

  #removeIntervals(...intervals) {
    intervals.forEach(i => {
      if (this.#intervals[i]) {
        clearInterval(this.#intervals[i]);
        this.#intervals[i] = 0;
      }
      if (i === 'gameevent' && this.#timeout) {
        clearTimeout(this.#timeout);
        this.#timeout = 0;
      }
    });
  }

  updateWidth(value) {
    const width = parseInt(value);
    if (isNaN(width) || width < 1 || width > 10) {
      throw new Error('Incorrect attribute');
    }
    this.#grid.setWidth(width);

    const event = new CustomEvent(
      'setwidth',
      {
        detail: width,
        bubbles: true,
        cancelable: true,
        composed: true,
      });
    this.#target.dispatchEvent(event);
    this.#startGame();
  }

  updateHeight(value) {
    const height = parseInt(value);
    if (isNaN(height) || height < 1 || height > 20) {
      throw new Error('Incorrect attribute');
    }
    this.#grid.setHeight(height);

    const event = new CustomEvent(
      'setheight',
      {
        detail: height,
        bubbles: true,
        cancelable: true,
        composed: true,
      });
    this.#target.dispatchEvent(event);
    this.#startGame();
  }

  updatePeriod(value) {
    const period = parseInt(value);
    if (isNaN(period) || period < 50) {
      throw new Error('Incorrect attribute');
    }
    this.#period = period;
    this.#startGame();
  }

  updateNextTetrominoCount(value) {
    const nextTetrominoCount = parseInt(value);
    if (isNaN(nextTetrominoCount) || nextTetrominoCount < 1) {
      throw new Error('Incorrect attribute');
    }
    this.#nextTetrominoCount = nextTetrominoCount;
  }

  

}

class GameGridElement extends HTMLElement {

  static get observedAttributes() {
    return [
      'width',
      'height',
      'period',
      'next-tetromino-count',
    ];
  }

  #width;
  #height;
  #pieces;
  #delete;
  #rows_complete;

  constructor() {

    super();

    this.#width = 0;
    this.#height = 0;
    this.#pieces = {};
    this.#delete = [];
    this.#rows_complete = [];

    this.tetrominoId = this.period = this.timeout = 0;
    this.intervals = {};
    this.nextTetrominos = [];
    this.nextTetrominoCount = 0;

    this.center = new GameCenter(this);

    this.attachShadow({ mode: 'open' });

    const styles = document.createElement('link');
    styles.setAttribute('rel', 'stylesheet');
    styles.setAttribute('href', './src/vanilla/game-grid/game-grid.css');
    this.shadowRoot.appendChild(styles);

    this.addEventListener('setwidth', ({detail}) => {
      this.#width = detail;
      // Remove pieces outside the width?
      this.isConnected && this.drawGrid();
    });

    this.addEventListener('setheight', ({detail}) => {
      this.#height = detail;
      // Remove pieces outside the height?
      this.isConnected && this.drawGrid();
    });

    this.addEventListener('addpieces', ({detail}) => {
      detail.forEach(piece => {
        this.#pieces[piece.id] = {
          type: piece.type,
          x: piece.x,
          y: piece.y,
        };
      });
      // Do we draw grid now??
    });

    this.addEventListener('movepieces', ({detail}) => {
      detail.forEach(piece => {
        this.#pieces[piece.id].x = piece.x;
        this.#pieces[piece.id].y = piece.y;
      });
      this.isConnected && this.drawGrid();
    });

    this.addEventListener('completerows', ({detail}) => {
      const container = this.shadowRoot.getElementById('grid-container');
      detail.forEach(row => {
        const element = document.createElement('div');
        element.id = `row-complete-${row}`;
        element.style.position = 'absolute';
        element.style.top = `${row * 25}px`;
        element.style.width = `${this.grid.getWidth() * 25}px`;
        element.style.height = '25px';
        element.style.animation = `${animationDurationMs / 7}ms linear 0s infinite alternate forwards running bomberguy`;
        element.style.zIndex = '5';
        element.style.backgroundColor = 'black';
        container.appendChild(element);
      });
      this.#rows_complete.push(...detail);
    });

    this.addEventListener('deletecompletedrows', ({detail}) => {
      // Remove the completed row animations.
      for (let row of detail.completeRows) {
        const id = `row-complete-${row}`;
        const row_element = this.shadowRoot.getElementById(id);
        row_element.remove();
      }
      // Delete pieces.
      this.#delete.push(...detail.delete);
      // Update pieces.
      detail.update.forEach(value => {
        const transition = happyblocks.transitions['gravity-falls'](value);
        const grid_piece = this.shadowRoot.getElementById(`game-piece-${value.to.id}`);
        transition(grid_piece);
      });
      this.dispatchEvent('rowscompleted', { pieces: result.completeRows.length });
    });

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


  drawGrid() {
    const container = this.shadowRoot.getElementById('grid-container');
    container.style.width = `${this.#width * 25}px`;
    container.style.height = `${this.#height * 25}px`;
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
    this.center.updateAttribute(attrName, newVal);
  }

  getNextTetromino() {
    let next = this.nextTetrominos.length > 0 ? this.nextTetrominos.shift().type : this.randomizer.next();
    this.updateNextTetrominos();
    return next;
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
    
    

    /*
      // This is the previous code, need to retain / translate across to the graphics display.
      animations.forEach(element => element.remove());
      this.dispatchEvent('rowscompleted', { pieces: result.delete.length });
      this.drawGrid();
      this.setGameEventInterval(this.period);
      */

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
