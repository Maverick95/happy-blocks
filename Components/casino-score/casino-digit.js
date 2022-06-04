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

    const digit = getDigit(this.score, this.power);

    this.attachShadow({ mode: 'open' });

    const styles = document.createElement('link');
    styles.setAttribute('rel', 'stylesheet');
    styles.setAttribute('href', './Components/casino-score/casino-digit.css');
    this.shadowRoot.appendChild(styles);

    const content = document.getElementById('casino-digit').content.cloneNode(true);

    const changes = [
      { digit: (digit + 1) % 10, className: 'digit-next' },
      { digit: digit, className: 'digit-current' },
      { digit: (digit + 9) % 10, className: 'digit-previous' },
    ];

    changes.forEach(change => {
      const element = content.getElementById(`digit-${change.digit}`);
      element.classList.replace('digit-hidden', change.className);
    });

    this.shadowRoot.appendChild(content);

  }

  attributeChangedCallback(attrName, _, newVal) {

    switch (attrName) {
      case 'score': {
        const score = parseInt(newVal);
        if (score !== this.score) {
          if (score !== this.score + 1) {
            throw new Error('Functionality currently not avaiable.');
          }
          const digitCurrent = getDigit(this.score, this.power);
          const digitNew = getDigit(score, this.power);

          this.score = score;

          if (digitNew !== digitCurrent) {
            this.shadowRoot.getElementById(`digit-${(digitCurrent + 9) % 10}`).classList.replace('digit-previous', 'digit-hidden');
            this.shadowRoot.getElementById(`digit-${digitCurrent}`).classList.replace('digit-current', 'digit-previous');
            this.shadowRoot.getElementById(`digit-${(digitCurrent + 1) % 10}`).classList.replace('digit-next', 'digit-current');
            this.shadowRoot.getElementById(`digit-${(digitCurrent + 2) % 10}`).classList.replace('digit-hidden', 'digit-next');
          }
        }
      }

        break;

      default:
        throw new Error('attrName not found.');
    }

  }

};

window.customElements.define('casino-digit', CasinoDigitElement);