class HappyBlocksElement extends HTMLElement {

  constructor() {

    super();
    this.score = 0;
    this.attachShadow({ mode: 'open' });

    const styles = document.createElement('link');
    styles.setAttribute('rel', 'stylesheet');
    styles.setAttribute('href', './src/vanilla/happy-blocks/happy-blocks.css');
    this.shadowRoot.appendChild(styles);    
  }

  connectedCallback() {
    const content = document.getElementById('happy-blocks').content.cloneNode(true);
    this.shadowRoot.appendChild(content);

    const container = this.shadowRoot.getElementById('happy-blocks-container');
    
    const casinoScore = document.createElement('casino-score');
    casinoScore.setAttribute('score', `${this.score}`);
    casinoScore.setAttribute('max-power', '4');

    const gameGrid = document.createElement('game-grid');
    gameGrid.setAttribute('width', '10');
    gameGrid.setAttribute('height', '20');
    gameGrid.setAttribute('period', '150');
    
    container.appendChild(casinoScore);
    container.appendChild(gameGrid);

    container.addEventListener('rowscompleted', (e) => {
      const pieces = parseInt(e.detail?.pieces);
      if (isNaN(pieces) || !Number.isInteger(pieces) || pieces <= 0) {
        throw new Error('incorrect scoreIncrease');
      }
      this.score += pieces;
      casinoScore.setAttribute('score', `${this.score}`);
    });

    container.addEventListener('gameover', (e) => {
      console.log('GaMe oVeR');
    });
  }

}

window.customElements.define('happy-blocks', HappyBlocksElement);