import { createElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import FlightSearch from './FlightSearch';
import styles from './FlightSearch.css?inline';

const TAG_NAME = 'sw-flight-search';

class FlightSearchElement extends HTMLElement {
  private root: Root | null = null;

  connectedCallback() {
    const shadow = this.shadowRoot ?? this.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = styles;
    shadow.appendChild(style);

    const mountPoint = document.createElement('div');
    shadow.appendChild(mountPoint);

    this.root = createRoot(mountPoint);
    this.root.render(createElement(FlightSearch));
  }

  disconnectedCallback() {
    this.root?.unmount();
    this.root = null;
  }
}

if (!customElements.get(TAG_NAME)) {
  customElements.define(TAG_NAME, FlightSearchElement);
}
