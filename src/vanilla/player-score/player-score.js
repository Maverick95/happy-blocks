class PlayerScoreElement extends HTMLElement
{
  static get observedAttributes() {
    return [ 'score' ];
  }

  constructor()
  {
    super();
    this.scoreDiffId = 0;
    this.score = this.getAttribute('score');
    
    this.attachShadow({mode: 'open'});
    
    const styles = document.createElement('link');
    styles.setAttribute('rel', 'stylesheet');
    styles.setAttribute('href', './src/vanilla/player-score/player-score.css');
    this.shadowRoot.appendChild(styles);
    
    const div = document.createElement('div');
    div.id = 'player-score-container';
    
    const pScore = document.createElement('p');
    pScore.id = 'player-score';
    pScore.textContent = `Player Score : 0`;
    
    div.appendChild(pScore);
    this.shadowRoot.appendChild(div);
  }

  attributeChangedCallback(attrName, _, newVal) {
    switch (attrName) {
      case 'score': {
        const newScore = parseInt(newVal);
        if (!isNaN(newScore)) {
          this.onScoreChange(newScore);
        }
        else {
          throw new Error('score received invalid newVal');
        }
      }
        break;
      default:
        throw new Error('attrName not found.');
    }
  }

  onScoreChange(newScore) {
    const div = this.shadowRoot.getElementById('player-score-container');
    const pScore = this.shadowRoot.getElementById('player-score');
    pScore.textContent = `Player Score : ${newScore}`;
    const pDifferenceId = `player-score-diff-${this.scoreDiffId++}`;
    const pDifference = document.createElement('p');
    pDifference.id = pDifferenceId;
    pDifference.className = "player-score-diff";
    pDifference.textContent = `${newScore - this.score}`,
    div.appendChild(pDifference);
    setTimeout(() => {
      this.shadowRoot.getElementById(pDifferenceId).remove();
    }, 2000);
  }
}

window.customElements.define('player-score', PlayerScoreElement);