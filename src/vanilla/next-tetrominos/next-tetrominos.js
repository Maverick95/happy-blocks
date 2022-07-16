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
        const tetrominos = happyblocks.tetrominos();
        const nextTetrominos = newValue.split('');
        if (nextTetrominos.some(t => !tetrominos.includes(t))) {
          throw new Error('Invalid attribute');
        }
        // Crude assignment for now.
        this.nextTetrominos = nextTetrominos;
        const container = this.shadowRoot.getElementById('next-tetrominos-container');
        const [width, height] = this.getSize();
        container.style.width = `${width}px`;
        container.style.height = `${height}px`;
      }
    }
  }

}

window.customElements.define('next-tetrominos', NextTetrominosElement);