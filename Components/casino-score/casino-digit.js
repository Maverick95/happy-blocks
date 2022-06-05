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
    styles.setAttribute('href', './Components/casino-score/casino-digit.css');
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

          }, 75);
        }
      }
      else {
        this.displayScore = this.score;
        this.displayDigit = Math.floor(
          (this.displayScore % Math.pow(10, this.power + 1)) /
          Math.pow(10, this.power));
        
        const changes = [
          { digit: (this.displayDigit + 1) % 10, className: 'digit-next' },
          { digit: this.displayDigit, className: 'digit-current' },
          { digit: (this.displayDigit + 9) % 10, className: 'digit-previous' },
        ];
    
        changes.forEach(change => {
          const element = this.shadowRoot.getElementById(`digit-${change.digit}`);
          element.classList.replace('digit-hidden', change.className);
        });
      }

    }

  }

  attributeChangedCallback(attrName, oldVal, newVal) {

    if (['score', 'power'].includes(attrName)) {

      if (attrName === 'score') {
        const score = parseInt(newVal);
        if (isNaN(score) || score < 0) {
          throw new Error('Incorrect score attribute');
        }
        this.score = score;
      }
      else if (attrName === 'power') {
        const power = parseInt(newVal);
        if (isNaN(power) || power < 0) {
          throw new Error('Incorrect score attribute');
        }
        this.power = power;
      }

      this.updateDigits(oldVal !== null);

   }
   else {
     throw new Error('attrName not found.');
    }

  }

};

window.customElements.define('casino-digit', CasinoDigitElement);