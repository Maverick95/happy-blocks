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
    casinoScore.setAttribute('score', '0');
    casinoScore.setAttribute('max-power', '4');

    const gameGrid = document.createElement('game-grid');
    gameGrid.setAttribute('width', '10');
    gameGrid.setAttribute('height', '20');
    gameGrid.setAttribute('period', '600');
    
    container.appendChild(casinoScore);
    container.appendChild(gameGrid);
  }

}

window.customElements.define('happy-blocks', HappyBlocksElement);