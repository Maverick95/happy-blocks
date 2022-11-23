class HappyBlocksCenter {

  #target;
  #rowscompleted;
  #score;

  constructor(target) {
    this.#target = target;
    this.#rowscompleted = 0;
    this.#score = 0;
  }

  #updateScore(rows, pieces) {
    this.#rowscompleted += rows;
    this.#score += pieces;
    const event = new CustomEvent(
      'updatescore',
      {
        detail: { score: this.#score },
        bubbles: true,
        cancelable: true,
        composed: true,
      });
    this.#target.dispatchEvent(event);
  }

  // HERE
  handle(event) {
    const { type, detail } = event;
    switch (type) {
      case 'happyblocksconnected':
        {
          const startGameCommand = new CustomEvent(
            'startgame',
            {
              detail: { score: this.#score },
              bubbles: true,
              cancelable: true,
              composed: true,
            });
          this.#target.dispatchEvent(startGameCommand);
        }
        break;
      case 'rowscompleted':
        {
          const { rows, pieces } = detail;
          this.#updateScore(rows, pieces);
        }
        break;
      case 'nexttetrominos':
        {
          const updateNextTetrominosCommand = new CustomEvent(
            'updatenexttetrominos',
            {
              detail,
              bubbles: true,
              cancelable: true,
              composed: true,
            });
          this.#target.dispatchEvent(updateNextTetrominosCommand);
        }
        break;
      case 'gameover':
        {
          const endGameCommand = new CustomEvent(
            'endgame',
            {
              bubbles: true,
              cancelable: true,
              composed: true,
            });
          this.#target.dispatchEvent(endGameCommand);
        }
        break;
      default:
        throw new Error('Invalid Event type passed to HappyBlocksCenter.');
    }
  }

}

class HappyBlocksElement extends HTMLElement {

  #center;

  constructor() {

    super();
    this.#center = new HappyBlocksCenter(this);
    
    this.attachShadow({ mode: 'open' });
    const styles = document.createElement('link');
    styles.setAttribute('rel', 'stylesheet');
    styles.setAttribute('href', './src/vanilla/happy-blocks/happy-blocks.css');
    this.shadowRoot.appendChild(styles);
  }

  connectedCallback() {
    const content = document.getElementById('happy-blocks').content.cloneNode(true);
    this.shadowRoot.appendChild(content);

    /* Subscribe to HappyBlocksCenter events. */
    this.addEventListener('startgame', this.#startGame);
    this.addEventListener('updatescore', this.#updateScore);
    this.addEventListener('updatenexttetrominos', this.#updateNextTetrominos);
    this.addEventListener('endgame', this.#endGame);

    /* Subscribe to Game Grid events. */
    this.addEventListener('rowscompleted', this.#handle);
    this.addEventListener('gameover', this.#handle);
    this.addEventListener('nexttetrominos', this.#handle);
    
    // This kicks off everything.
    const event = new CustomEvent(
      'happyblocksconnected',
      {
        bubbles: true,
        cancelable: true,
        composed: true,
      });

    this.#handle(event);
  }

  #handle(event) {
    this.#center.handle(event);
  }

  disconnectedCallback() {
    /* Unsubscribe from HappyBlocksCenter events. */ 
    this.removeEventListener('startgame', this.#startGame);
    this.removeEventListener('updatescore', this.#updateScore);
    this.removeEventListener('updatenexttetrominos', this.#updateNextTetrominos);
    this.removeEventListener('endgame', this.#endGame);

    /* Unsubscribe from Game Grid events. */
    this.removeEventListener('rowscompleted', this.#handle);
    this.removeEventListener('gameover', this.#handle);
    this.removeEventListener('nexttetrominos', this.#handle);
  }

  #endGame() {
    console.log('GaMe oVeR');
    this.#clear();
  }

  #updateScore(event) {
    const { detail: { score } } = event;
    const casinoScore = this.shadowRoot.getElementById('casino-score');
    casinoScore.setAttribute('score', score);
  }

  #updateNextTetrominos(event) {
    const { detail: { tetrominos } } = event;
    const nextTetrominos = this.shadowRoot.getElementById('next-tetrominos');
    nextTetrominos.setAttribute('tetrominos', tetrominos);
  }

  #clear() {
    const container = this.shadowRoot.getElementById('happy-blocks-container');
    container.replaceChildren();
  }

  #startGame(event) {
    this.#clear();

    const { detail: { score } } = event;
    const container = this.shadowRoot.getElementById('happy-blocks-container');

    const casinoScore = document.createElement('casino-score');
    casinoScore.id = 'casino-score';
    casinoScore.setAttribute('score', score);
    casinoScore.setAttribute('max-power', '4');

    const gameGrid = document.createElement('game-grid');
    gameGrid.setAttribute('width', '10');
    gameGrid.setAttribute('height', '20');
    gameGrid.setAttribute('period', '150');
    gameGrid.setAttribute('next-tetromino-count', 7);

    const nextTetrominos = document.createElement('next-tetrominos');
    nextTetrominos.id = 'next-tetrominos';

    container.appendChild(casinoScore);
    container.appendChild(gameGrid);
    container.appendChild(nextTetrominos);
  }
}

window.customElements.define('happy-blocks', HappyBlocksElement);