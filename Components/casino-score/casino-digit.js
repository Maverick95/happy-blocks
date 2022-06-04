const getDigit = (score, power) => {
  const upperDiv = Math.pow(10, power + 1);
  const lowerDiv = Math.pow(10, power);
  return Math.floor((score % upperDiv) / lowerDiv);
}

class CasinoDigitElement extends HTMLElement {

  static get observedAttributes() {
    return [
      'score',
    ];
  }

  constructor() {
    
    super();
    this.power = parseInt(this.getAttribute('power'));
    this.score = parseInt(this.getAttribute('score'));
    this.digit = getDigit(this.score, this.power);

    this.attachShadow({mode: 'open'});

    const styles = document.createElement('link');
    styles.setAttribute('rel', 'stylesheet');
    styles.setAttribute('href', './Components/casino-score/casino-digit.css');
    this.shadowRoot.appendChild(styles);

    const content = document.getElementById('casino-digit').content.cloneNode(true);

    const changes = [
      { digit: (this.digit + 1) % 10, className: 'digit-next' },
      { digit: this.digit, className: 'digit-current' },
      { digit: (this.digit + 9) % 10, className: 'digit-previous' },
    ];

    changes.forEach(change => {
      const element = content.getElementById(`digit-${change.digit}`);
      element.classList.remove('digit-hidden');
      element.classList.add(change.className);
    });

    this.shadowRoot.appendChild(content);

  }

  attributeChangedCallback(attrName, _, newVal) {

    switch (attrName) {
      case 'score': {
        const score = parseInt(newVal);
        // HERE - trying to change classes once new score set.
        break;
      }
        
      default:
        throw new Error('attrName not found.');
    }

  }

};

window.customElements.define('casino-digit', CasinoDigitElement);