class CasinoDigitElement extends HTMLElement {

  static get observedAttributes() {
    return [
      'score',
      'power',
    ];
  }

  constructor() {
    super();

    this.interval = 0;
    this.power = this.score = this.displayScore = this.displayDigit = null;

    this.attachShadow({ mode: 'open' });

    const styles = document.createElement('link');
    styles.setAttribute('rel', 'stylesheet');
    styles.setAttribute('href', './src/vanilla/casino-score/casino-digit.css');
    this.shadowRoot.appendChild(styles);

    const content = document.getElementById('casino-digit').content.cloneNode(true);

    this.shadowRoot.appendChild(content);
  }

  updateDigits(isOldValDefined) {
    if (this.score !== null && this.power !== null) {
      if (isOldValDefined) {
        if (this.interval === 0) {
          this.interval = setInterval(() => {
            if (this.score === this.displayScore) {
              clearInterval(this.interval);
              this.interval = 0;
              return;
            }

            if ((++this.displayScore) % Math.pow(10, this.power) === 0) {
              this.shadowRoot.getElementById(`digit-${(this.displayDigit + 9) % 10}`).classList.replace('digit-previous', 'digit-hidden');
              this.shadowRoot.getElementById(`digit-${this.displayDigit}`).classList.replace('digit-current', 'digit-previous');
              this.shadowRoot.getElementById(`digit-${(this.displayDigit + 1) % 10}`).classList.replace('digit-next', 'digit-current');
              this.shadowRoot.getElementById(`digit-${(this.displayDigit + 2) % 10}`).classList.replace('digit-hidden', 'digit-next');

              this.displayDigit = (this.displayDigit + 1) % 10;
            }
          }, 250);
        }
      }
      else {
        this.displayScore = this.score;
        this.displayDigit = Math.floor(
          (this.displayScore % Math.pow(10, this.power + 1)) /
          Math.pow(10, this.power));

        this.shadowRoot.getElementById(`digit-${(this.displayDigit + 1) % 10}`).classList.replace('digit-hidden', 'digit-next');
        this.shadowRoot.getElementById(`digit-${this.displayDigit}`).classList.replace('digit-hidden', 'digit-current');
        this.shadowRoot.getElementById(`digit-${(this.displayDigit + 9) % 10}`).classList.replace('digit-hidden', 'digit-previous');
      }
    }
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
      case 'power': {
        const power = parseInt(newVal);
        if (isNaN(power) || power < 0) {
          throw new Error('Incorrect attribute');
        }
        this.power = power;
      }
      break;
    }
    
    this.updateDigits(oldVal !== null);
  }

};

window.customElements.define('casino-digit', CasinoDigitElement);