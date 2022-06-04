class CasinoScoreElement extends HTMLElement {

  static get observedAttributes() {
    return [
      'score',
    ];
  }

  constructor() {

    super();
    this.attachShadow({ mode: 'open' });
    const content = document.getElementById('casino-score').content.cloneNode(true);
    this.shadowRoot.appendChild(content);

  }

  attributeChangedCallback(attrName, _, newVal) {
    switch (attrName) {
      case 'score': {
        const score = parseInt(newVal);
        if (isNaN(score) || score < 0) {
          throw new Error('Incorrect score attribute');
        }
        let digits = this.shadowRoot.querySelectorAll('casino-digit');
        for (let digit of digits) {
          digit.setAttribute('score', score);
        }
      }
        break;

      default:
        throw new Error('attrName not found.');
    }

  }

}

window.customElements.define('casino-score', CasinoScoreElement);