class HappyBlocksElement extends HTMLElement {

  constructor() {

    super();
    this.attachShadow({ mode: 'open'});

    const styles = document.createElement('link');
    styles.setAttribute('rel', 'stylesheet');
    styles.setAttribute('href', './src/vanilla/happy-blocks/happy-blocks.css');
    this.shadowRoot.appendChild(styles);

    const content = document.getElementById('happy-blocks').content.cloneNode(true);
    this.shadowRoot.appendChild(content);

  }

}

window.customElements.define('happy-blocks', HappyBlocksElement);