class NextTetrominosElement extends HTMLElement {
  
  static get observedAttributes() {
    return [ 'next-tetrominos' ];
  }
  
  constructor() {
    super();

    this.minX = this.minY = this.width = this.height = 0;

    this.attachShadow({ mode: 'closed' });
    const styles = document.createElement('link');
    styles.setAttribute('rel', 'stylesheet');
    styles.setAttribute('href', './src/next-tetrominos/next-tetrominos.css');
    this.shadowRoot.appendChild(styles);  
  }

  connectedCallback() {

  }

  disconnectedCallback() {

  }

  attributeChangedCallback(name, oldValue, newValue) {

  }

}