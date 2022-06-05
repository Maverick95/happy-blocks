class CasinoScoreElement extends HTMLElement {

  static get observedAttributes() {
    return [
      'score',
      'max-power',
    ];
  }

  constructor() {
    super();
    this.score = this.maxPower = null;

    this.attachShadow({ mode: 'open' });
    const content = document.getElementById('casino-score').content.cloneNode(true);
    this.shadowRoot.appendChild(content);
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    switch (attrName) {
      case 'score': {
        const score = parseInt(newVal);
        if (isNaN(score) || score < 0) {
          throw new Error('Incorrect attribute');
        }
        this.score = score;
      }
      break;
      case 'max-power': {
        const maxPower = parseInt(newVal);
        if (isNaN(maxPower) || maxPower < 0) {
          throw new Error('Incorrect attribute');
        }
        this.maxPower = maxPower;
      }
      break;
    }

    if (this.score !== null && this.maxPower !== null) {
      const container = this.shadowRoot.getElementById('score-container');
      if (oldVal !== null) {
        let digits = container.querySelectorAll('casino-digit');
        for (let digit of digits) {
          digit.setAttribute('score', this.score);
        }
      }
      else {
        for (let i=this.maxPower; i >= 0; i--) {
          const digit = document.createElement('casino-digit');
          digit.setAttribute('score', this.score);
          digit.setAttribute('power', i);
          container.appendChild(digit);
        }
      }
    }
  }

}

window.customElements.define('casino-score', CasinoScoreElement);