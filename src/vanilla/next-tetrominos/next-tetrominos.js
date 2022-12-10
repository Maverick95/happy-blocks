class NextTetrominosElement extends HTMLElement {

  static get observedAttributes() {
    return ['tetrominos'];
  }

  #tetrominos;

  constructor() {
    super();

    this.#tetrominos = undefined;
    this.minX = this.minY = this.width = this.height = undefined;
    this.nextTetrominos = [];
    this.getTetrominoBoundaries();

    // TODO - display settings.
    this.sizePerPiece = 25;
    this.widthGap = 25;
    this.padding = 15;

    this.attachShadow({ mode: 'open' });
    const stylesNextTetromino = document.createElement('link');
    stylesNextTetromino.setAttribute('rel', 'stylesheet');
    stylesNextTetromino.setAttribute('href', './src/vanilla/next-tetrominos/next-tetrominos.css');
    this.shadowRoot.appendChild(stylesNextTetromino);
    const stylesGameGrid = document.createElement('link');
    stylesGameGrid.setAttribute('rel', 'stylesheet');
    stylesGameGrid.setAttribute('href', './src/vanilla/game-grid/game-grid.css');
    this.shadowRoot.appendChild(stylesGameGrid);
  }

  updateNextTetrominos(queue) {

    queue.forEach((q_value, q_index) => {
      q_value.index = q_index;
      q_value.exists = false;
    });

    const ids_delete = [];
    const ids_update = [];

    const container = this.shadowRoot.getElementById('next-tetrominos-container');

    this.nextTetrominos.forEach((t_value, t_index) => {

      const exists = queue.find(q => q.id === t_value.id);
      if (typeof exists === 'undefined') {
        // Not in new queue, id needs sorting for deletion
        ids_delete.push({ id: t_value.id, index: t_index });
      }
      else {
        exists.exists = true;
        if (exists.index !== t_index) {
          // If in new queue, but index is different, id and index need storing for update.
          ids_update.push({ id: t_value.id, index: exists.index, type: exists.type, });
        }
      }

    });

    this.nextTetrominos = queue.map(q => ({ id: q.id, type: q.type }));

    // If new queue has not been found, id and index need storing for insertion.
    const ids_insert = queue.filter(({ exists }) => !exists)
      .map((value) => ({ id: value.id, index: value.index, type: value.type }));

    // Insert all insertions.
    ids_insert.forEach(({ id, index, type }) => {
      const next_insert = document.createElement('div');
      next_insert.id = `next-tetromino-${id}`;
      const { left, top, width, height } = this.#getTetrominoDimensions(index, type);
      next_insert.style.left = left;
      next_insert.style.top = top;
      next_insert.style.width = width;
      next_insert.style.height = height;
      next_insert.classList.add('next-tetromino');
      // Append the pieces.
      const tetromino = this.#tetrominos[type];
      tetromino.coordinates.forEach((coordinate) => {
        const next_piece = document.createElement('div');
        next_piece.classList.add('game-piece', ...tetromino.classNames);
        const { left, top, width, height } = this.#getPieceDimensions(coordinate, type);
        next_piece.style.left = left;
        next_piece.style.top = top;
        next_piece.style.width = width;
        next_piece.style.height = height;
        next_insert.appendChild(next_piece);
      });  
      container.appendChild(next_insert);
    });

    // Delete all deletions.
    ids_delete.forEach(({ id }) => {
      const next_delete = this.shadowRoot.getElementById(`next-tetromino-${id}`);
      next_delete.remove();
    });

    // Update all updates.
    ids_update.forEach(({ id, index, type }) => {
      const next_update = this.shadowRoot.getElementById(`next-tetromino-${id}`);
      const { left, top, width, height } = this.#getTetrominoDimensions(index, type);
      next_update.style.left = left;
      next_update.style.top = top;
      next_update.style.width = width;
      next_update.style.height = height;
      //const left = (this.sizePerPiece * this.width * index) + (this.widthGap * index);
      //next_update.style.left = `${15 + left}px`;
    });

    const [width, height] = this.getSize();
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
  }

  getTetrominoBoundaries() {
    this.#tetrominos = {};
    const tetrominos = happyblocks.tetrominos();
    tetrominos.forEach(t => {
      const tetromino = happyblocks.tetromino(t);
      const minX = Math.min(...tetromino.coordinates.map(c => c.x));
      const minY = Math.min(...tetromino.coordinates.map(c => c.y));
      const maxX = Math.max(...tetromino.coordinates.map(c => c.x));
      const maxY = Math.max(...tetromino.coordinates.map(c => c.y));
      const width = 1 + maxX - minX;
      const height = 1 + maxY - minY;
      this.#tetrominos[t] = {
        width,
        height,
        coordinates: tetromino.coordinates.map(c => ({
          x: c.x - minX,
          y: c.y - minY,
        })),
        classNames: tetromino.classNames,
      };
    });
    this.minX = 0;
    this.minY = 0;
    this.width = Math.max(...tetrominos.map(t => this.#tetrominos[t].width));
    this.height = Math.max(...tetrominos.map(t => this.#tetrominos[t].height));
  }

  #getPieceDimensions(coordinate, type) {
    const pxLeft = (coordinate.x - this.minX) * this.sizePerPiece;
    const pxTop = (coordinate.y - this.minY) * this.sizePerPiece;
    const pxWidth = this.sizePerPiece;
    const pxHeight = this.sizePerPiece;

    const width = this.#tetrominos[type].width * this.sizePerPiece;
    const height = this.#tetrominos[type].height * this.sizePerPiece;

    const percLeft = width === 0 ? 0 : Math.round(100 * pxLeft / width);
    const percTop = height === 0 ? 0 : Math.round(100 * pxTop / height);
    const percWidth = width === 0 ? 0 : Math.round(100 * pxWidth / width);
    const percHeight = height === 0 ? 0 : Math.round(100 * pxHeight / height);

    return ({
      left: `${percLeft}%`,
      top: `${percTop}%`,
      width: `${percWidth}%`,
      height: `${percHeight}%`,
    });
  }

  #getTetrominoDimensions(index, type) {
    const diffWidth = this.width - this.#tetrominos[type].width;
    const diffHeight = this.height - this.#tetrominos[type].height; 

    const pxLeft = this.padding + (this.sizePerPiece * this.width * index) + (this.widthGap * index) + (this.sizePerPiece * diffWidth / 2);
    const pxTop = this.padding + (this.sizePerPiece * diffHeight / 2);
    const pxWidth = (this.sizePerPiece * this.width) - (this.sizePerPiece * diffWidth);
    const pxHeight = (this.sizePerPiece * this.height) - (this.sizePerPiece * diffHeight);

    const [width, height] = this.getSize();

    const percLeft = width === 0 ? 0 : Math.round(100 * pxLeft / width);
    const percTop = height === 0 ? 0 : Math.round(100 * pxTop / height);
    const percWidth = width === 0 ? 0 : Math.round(100 * pxWidth / width);
    const percHeight = height === 0 ? 0 : Math.round(100 * pxHeight / height);

    return ({
      left: `${percLeft}%`,
      top: `${percTop}%`,
      width: `${percWidth}%`,
      height: `${percHeight}%`,
    });

  }

  getSize() {
    const tetrominos = Math.max(this.nextTetrominos.length, 1);
    const width = (2 * this.padding) + (this.sizePerPiece * this.width * tetrominos) + (this.widthGap * (tetrominos - 1));
    const height = (2 * this.padding) + (this.sizePerPiece * this.height);
    return [width, height];
  }

  connectedCallback() {
    const container = document.createElement('div');
    container.id = 'next-tetrominos-container';
    const [width, height] = this.getSize();
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
    container.style.padding = `${this.padding}px`;
    this.shadowRoot.appendChild(container);
  }

  disconnectedCallback() {

  }

  attributeChangedCallback(name, _, newValue) {
    switch (name) {
      case 'tetrominos': {
        const queue = happyblocks.translator.decode(newValue);
        this.updateNextTetrominos(queue);
      }
    }
  }

}

window.customElements.define('next-tetrominos', NextTetrominosElement);