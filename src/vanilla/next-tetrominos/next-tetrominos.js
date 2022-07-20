class NextTetrominosElement extends HTMLElement {
  
  static get observedAttributes() {
    return [ 'tetrominos' ];
  }
  
  constructor() {
    super();

    this.minX = this.minY = this.width = this.height = undefined;
    this.nextTetrominos = [];
    this.getTetrominoBoundaries();

    this.attachShadow({ mode: 'open' });
    const styles = document.createElement('link');
    styles.setAttribute('rel', 'stylesheet');
    styles.setAttribute('href', './src/vanilla/next-tetrominos/next-tetrominos.css');
    this.shadowRoot.appendChild(styles);  
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
          ids_update.push({ id: t_value.id, index: exists.index });
        }
      }

    });

    // If new queue has not been found, id and index need storing for insertion.
    const ids_insert = queue.filter(({exists}) => !exists)
      .map((value) => ({ id: value.id, index: value.index }));

    // Insert all insertions.
    ids_insert.forEach(({id, index}) => {
      const next_insert = document.createElement('div');
      next_insert.id = `next-tetromino-${id}`;
      next_insert.style.backgroundColor = "#ff0000";
      const sizePerPiece = 25, widthGap = 25;
      const left = (sizePerPiece * this.width * index) + (widthGap * index);
      next_insert.style.left = `${15 + left}px`;
      next_insert.classList.add('next-tetromino');
      next_insert.style.position = 'absolute';
      next_insert.style.width = `${sizePerPiece * this.width}px`;
      next_insert.style.height = `${sizePerPiece * this.height}px`;
      next_insert.textContent = `${id}`;
      container.appendChild(next_insert);
    });

    // Delete all deletions.
    ids_delete.forEach(({id}) => {
      const next_delete = this.shadowRoot.getElementById(`next-tetromino-${id}`);
      next_delete.remove();
    });

    // Update all updates.
    ids_update.forEach(({id, index}) => {
      const next_update = this.shadowRoot.getElementById(`next-tetromino-${id}`);
      const sizePerPiece = 25, widthGap = 25;
      const left = (sizePerPiece * this.width * index) + (widthGap * index);
      next_update.style.left = `${15 + left}px`;
    });

    this.nextTetrominos = queue.map(q => ({ id: q.id, type: q.type }));
    const [width, height] = this.getSize();
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
  }

  getTetrominoBoundaries() {
    let minX, minY, maxX, maxY;
    const tetrominos = happyblocks.tetrominos();
    tetrominos.forEach(t => {
      const tetromino = happyblocks.tetromino(t);
      tetromino.coordinates.forEach(coordinate => {
        minX = minX ?? coordinate.x;
        if (coordinate.x < minX) { minX = coordinate.x; }
        maxX = maxX ?? coordinate.x;
        if (coordinate.x > maxX) { maxX = coordinate.x; }
        minY = minY ?? coordinate.y;
        if (coordinate.y < minY) { minY = coordinate.y; }
        maxY = maxY ?? coordinate.y;
        if (coordinate.y > maxY) { maxY = coordinate.y; }
      });
    });
    this.minX = minX;
    this.minY = minY;
    this.width = 1 + maxX - minX;
    this.height = 1 + maxY - minY;
  }

  getSize() {
    const sizePerPiece = 25, widthGap = 25;
    const tetrominos = Math.max(this.nextTetrominos.length, 1);
    const width = (sizePerPiece * this.width * tetrominos) + (widthGap * (tetrominos - 1));
    const height = (sizePerPiece * this.height);
    return [width, height];
  }

  connectedCallback() {
    const container = document.createElement('div');
    container.id = 'next-tetrominos-container';
    const [width, height] = this.getSize();
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
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